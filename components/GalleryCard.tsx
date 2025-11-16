import React from 'react'
import { Card } from './ui/card'
import Image from 'next/image'

const GalleryCard = () => {
  return (
    <Card className='h-full relative w-full flex items-center justify-center p-0'>
      <Image
        src="/chess.png"
        alt="bg"
        fill
        className="object-cover h-full w-full rounded-lg"
        />
    </Card>
  )
}

export default GalleryCard
