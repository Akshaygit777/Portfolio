"use client";
import { Card } from '@/components/ui/card'
import React from 'react'
import { MorphingText } from './ui/morphing-text'
import { texts } from '@/constants/contants'
import { Circle } from 'lucide-react'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { SiReaddotcv } from 'react-icons/si';
import Image from 'next/image';
import Link from 'next/link';

const ProfileCard = () => {
    const currentTime = useCurrentTime()

    return (
        <Card className='h-full w-full flex flex-col justify-between  p-6 gap-1 font-NHassDisplay tracking-wider overflow-y-auto'>
            <div className='w-full flex justify-between '>
                <div className='flex items-center w-full gap-2'>
                    <div className='relative h-14 aspect-square rounded-full shrink-0'>
                        <Image src="/profile.jpg" fill alt='dp' className='h-full w-full border rounded-full [box-shadow:2px_2px_85px_0px_#ffffff] dark:[box-shadow:0px_0px_65px_45px_#ffffff20]' />
                        {/* <Image src="/me.png" fill alt='dp' className='h-full w-full rounded-full' /> */}
                    </div>
                    <div className='flex flex-grow flex-col items-start justify-center'>
                        <span className='text-xl font-medium uppercase tracking-widest font-NHassDisplay'>akshay shukla</span>
                        <span className='text-sm opacity-60 font-SpaceGrotesk tracking-normal'>@akshay2334</span>
                    </div>
                </div>
              
            </div>
            <div className="flex flex-col gap-1">
                <div className="font-medium w-full text-foreground flex items-center justify-start gap-1">
                    <p className="inline text-base">I build </p>
                    <div className="inline-block">
                        <MorphingText texts={texts} className='h-5 text-lg inline-flex whitespace-nowrap items-start dark:text-foreground text-black' />
                    </div>
                </div>
                <div className="w-full text-foreground">
                    <p className="text-sm">
                        Hello, I&apos;m Akshay! a 21 years old developer based in{" "}
                        <span className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent font-semibold">
                            India
                        </span>.
                    </p>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div className="flex items-center justify-center gap-2 text-sm font-mono text-zinc-500 font-light tracking-wider">
                    <p className="hidden sm:block text-xs font-mono text-black/70 dark:text-zinc-400/70 tracking-tighter">
                        {`I automated the boring parts so well,`}<br />{`I had time to automate the fun parts too.`}
                    </p>
                </div>

                <div className="whitespace-nowrap">
                    <div className="font-mono flex justify-end items-center gap-1 text-sm text-green-500">
                        <div className="relative">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                            <Circle className="relative h-2 w-2 fill-green-500" />
                        </div>
                        <p className="text-xs">Available for work</p>
                    </div>

                    <div className="flex items-center justify-center">
                        <time className="text-xs font-light text-zinc-500 font-mono tabular-nums tracking-wider">
                            {currentTime}
                        </time>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ProfileCard





// just replace mohit sing element with this:
// <div className='flex items-center  text-xl font-medium uppercase tracking-widest font-NHassDisplay'>
//     <span>M</span>
//     <div className="relative" style={{ fontSize: 'inherit' }}>
//         <span
//             className="moon block rounded-full border-none mr-px"
//             style={{
//                 width: '0.8em',
//                 height: '0.8em',
//             }}
//         />
//     </div>
//     <span>HIT SINGH</span>
// </div> 