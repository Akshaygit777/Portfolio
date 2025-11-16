import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { motion, useMotionValue, cubicBezier } from "framer-motion";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

// easeInOutQuart easing function using cubicBezier
const easeInOutQuart = cubicBezier(0.76, 0, 0.24, 1);

const TRANSITION_OPTIONS = {
    duration: 1.5,
    ease: easeInOutQuart,
};


interface MediaItem {
    src: string;
    type: 'image' | 'video';
}

interface SwipeCarouselProps {
    media: MediaItem[];
}

export const SwipeCarousel = ({ media }: SwipeCarouselProps) => {
    const [imgIndex, setImgIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const dragX = useMotionValue(0);

    useEffect(() => {
        const currentMedia = media[imgIndex];
        let delay = AUTO_DELAY;

        if (currentMedia.type === 'video') {
            const video = videoRefs.current[imgIndex];
            if (video) {
                // Get video duration in milliseconds
                const duration = video.duration * ONE_SECOND;
                // Use the shorter of video duration or AUTO_DELAY
                delay = Math.min(duration || AUTO_DELAY, AUTO_DELAY);
            }
        }

        const intervalRef = setInterval(() => {
            const x = dragX.get();

            if (x === 0) {
                setImgIndex((pv) => {
                    if (pv === media.length - 1) {
                        return 0;
                    }
                    return pv + 1;
                });
            }
        }, delay);

        // If current media is a video, listen for 'ended' event to advance early
        if (currentMedia.type === 'video') {
            const video = videoRefs.current[imgIndex];
            if (video) {
                const handleVideoEnd = () => {
                    setImgIndex((pv) => {
                        if (pv === media.length - 1) {
                            return 0;
                        }
                        return pv + 1;
                    });
                };
                video.addEventListener('ended', handleVideoEnd);
                return () => {
                    video.removeEventListener('ended', handleVideoEnd);
                    clearInterval(intervalRef);
                };
            }
        }

        return () => clearInterval(intervalRef);
    }, [imgIndex, media]);

    const onDragEnd = () => {
        const x = dragX.get();

        if (x <= -DRAG_BUFFER && imgIndex < media.length - 1) {
            setImgIndex((pv) => pv + 1);
        } else if (x >= DRAG_BUFFER && imgIndex > 0) {
            setImgIndex((pv) => pv - 1);
        }
    };

    return (
        <div className="h-full w-full rounded-lg">
            <motion.div
                drag="x"
                dragConstraints={{
                    left: 0,
                    right: 0,
                }}
                style={{
                    x: dragX,
                }}
                animate={{
                    translateX: `-${imgIndex * 100}%`,
                }}
                transition={TRANSITION_OPTIONS}
                onDragEnd={onDragEnd}
                className="w-full aspect-video h-auto flex cursor-grab items-center active:cursor-grabbing rounded-lg"
            >
                <Images imgIndex={imgIndex} media={media} videoRefs={videoRefs} />
            </motion.div>

            <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} media={media} />
            <GradientEdges />
        </div>
    );
};

const Images = ({
    imgIndex,
    media,
    videoRefs,
}: {
    imgIndex: number;
    media: MediaItem[];
    videoRefs: React.RefObject<(HTMLVideoElement | null)[]>;
}) => {
    return (
        <>
            {media.map((item, idx) => (
                <motion.div
                    key={idx}
                    animate={{
                        scale: imgIndex === idx ? 0.95 : 0.85,
                    }}
                    transition={TRANSITION_OPTIONS}
                    className="w-full h-full shrink-0 rounded-lg bg-[#1F1F1F]"
                >
                    {item.type === 'video' ? (
                        <video
                            ref={(el) => { videoRefs.current[idx] = el; }}
                            className="w-full h-full object-fill rounded-lg"
                            src={item.src}
                            muted
                            loop={false} // Disable loop to detect 'ended' event
                            playsInline
                            autoPlay={imgIndex === idx} // Auto-play only the current video
                            controls
                        />
                    ) : (
                        <motion.div
                            key={idx}
                            style={{
                                backgroundImage: `url(${item.src})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                borderRadius: "4px"
                            }}
                            transition={TRANSITION_OPTIONS}
                            className=" w-full h-full shrink-0 rounded-lg"
                        />
                    )}
                </motion.div>
            ))}
        </>
    );
};

const Dots = ({
    imgIndex,
    setImgIndex,
    media,
}: {
    imgIndex: number;
    setImgIndex: Dispatch<SetStateAction<number>>;
    media: MediaItem[];
}) => {
    return (
        <div className="flex w-full justify-center gap-2 mb-2">
            {media.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setImgIndex(idx)}
                    className={`h-3 w-3 cursor-pointer rounded-full transition-colors ${idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"
                        }`}
                />
            ))}
        </div>
    );
};

const GradientEdges = () => {
    return (
        <>
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
        </>
    );
};
