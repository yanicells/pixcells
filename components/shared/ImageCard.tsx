import React from 'react'
import type { AlbumImage } from '@/store'
import ImageHolder from './ImageHolder'

type Props = { 
  image: AlbumImage
  variant?: 'grid' | 'carousel'
}

function ImageCard({ image, variant = 'grid' }: Props) {
  return (
    <div key={image.id} className="group relative cursor-pointer w-full h-full">
        <ImageHolder image={image} variant={variant} />
    </div>
  )
}

export default ImageCard
