import React from 'react'
import { Card } from './ui/card'
import Image from 'next/image'
// import { BubbleText } from './ui/bubble-text'

const CurrentlyBuilding = () => {
    return (
        <Card className='relative shadow-none overflow-hidden p-0 h-full w-full flex items-center justify-center pointer-events-none'>
            <Image
                src="/ultra.gif"
                alt="bg"
                fill
                className="object-cover rounded-lg -z-0"
            />
            <div className='absolute inset-0 h-full bg-gradient-to-r z-0 from-black/10  via-black/70 to-black/10' />
            <span className='absolute font-mono italic text-xs font-semibold mt-11 '>
                "stars fall and the world goes blind"
                Stay determined?
                {/* <BubbleText
                    className='text-xs'
                    activeColor="white"
                    restColor="rgb(255, 255, 255, 0.6)"
                    autoAnimate={true}
                    animationInterval={1000}
                >
                    "stars fall and the world goes blind"
                </BubbleText> */}
            </span>
        </Card>
    )
}

export default CurrentlyBuilding
