"use client";
import React, { useEffect } from 'react';
import { Project } from '@/constants/contants';
import { Card } from './card';
import { SwipeCarousel } from './carousel';
import { BsGlobe } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: Project | null;
}

const Modal = ({ isOpen, onClose, media }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    interface EscKeyEvent extends KeyboardEvent {
      key: string;
    }

    const handleEscKey = (event: EscKeyEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen || !media) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <Card
        className="relative rounded-lg w-full mx-[13%] max-h-[75vh] p-0 border-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="z-50 absolute font-SpaceGrotesk top-7 gap-0.5 inline-flex -rotate-90 left-[-3.5rem] text-white hover:text-gray-300 focus:outline-none cursor-pointer"
          aria-label="Close modal"
        >
          <span>CLOSE</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="z-50 absolute top-[-2.25rem] left-1/2 transform -translate-x-1/2 text-lg sm:text-2xl font-SpaceGrotesk font-semibold w-full text-center">
          {media.title}
        </h2>

        <div className="flex flex-col items-center w-full h-full overflow-y-auto overflow-x-hidden hide-scrollbar rounded-lg">
          {/* <div className="w-full space-y-4">
            {media.media.map((item, index) => (
              <div key={index} className="w-full">
                {item.type === 'video' ? (
                  <video
                    className="w-full h-auto rounded-lg"
                    src={item.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    controls
                  />
                ) : (
                  <img
                    className="w-full h-auto rounded-lg"
                    src={item.src}
                    alt={`${media.title} media ${index + 1}`}
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div> */}
          <SwipeCarousel media={media.media} />

          <div className='min-h-0.5 w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent' />

          {media.description && (
            <div className="mt-4 w-full px-6">
              {/* <h3 className="text-xl font-NHassDisplay">Description</h3> */}
              <p className='font-SpaceGrotesk'>{media.description}</p>
            </div>
          )}

          {media.techStack && media.techStack.length > 0 && (
            <div className="mt-4 px-6 w-full">
              {/* <h3 className="text-xl font-semibold mb-2">Tech Stack</h3> */}
              {/* <ul className="flex flex-wrap gap-2">
                {media.techStack.map((tech, index) => (
                  <li key={index} className="px-3 py-1 bg-gray-700 rounded-full">
                    {tech}
                  </li>
                ))}
              </ul> */}


              <div className="flex flex-wrap gap-1.5">
                {media.techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="p-px text-xs font-normal border line-clamp-1 overflow-hidden w-max rounded-lg size-max hover:border-zinc-800/70 dark:hover:border-white/30 transition-all bg-transparent backdrop-blur-xl backdrop-saturate-200"
                  >
                    <p className="px-2 py-1 rounded-md border mx-auto bg-background">{tech}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(media.liveLink || media.githubLink || media.playStoreLink || media.appStoreLink) && (
            <div className="my-4 px-6 text-gray-200 w-full">
              {/* <h3 className="text-xl font-semibold mb-2">Links</h3> */}
              <div className="flex flex-wrap gap-4">
                {media.liveLink && (
                  <a
                    href={media.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 py-1 px-2 border text-background bg-foreground/90 hover:bg-blue-200 rounded-lg"
                  >
                    <BsGlobe /> Website
                  </a>
                )}
                {media.githubLink && (
                  <a
                    href={media.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 py-1 px-2 border text-background bg-foreground/90 hover:bg-blue-200 rounded-lg"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
                {media.playStoreLink && (
                  <a
                    href={media.playStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Play Store
                  </a>
                )}
                {media.appStoreLink && (
                  <a
                    href={media.appStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    App Store
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Modal;