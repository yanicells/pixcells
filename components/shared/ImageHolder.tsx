"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import type { AlbumImage } from '@/store'
import ImageLightbox from './ImageLightbox'

type Props = {
  image: AlbumImage
  variant?: 'grid' | 'carousel'
}

function ImageHolder({ image, variant = 'grid' }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  if (variant === 'carousel') {
    return (
      <>
        <div className="relative w-full h-full" onClick={openModal}>
          <Image
            src={image.url}
            alt="Image"
            fill
            className='object-cover rounded-lg transform scale-100 group-hover:scale-110 hover:brightness-45 group-hover:brightness-75 transition duration-200'
          />
        </div>
        
        <ImageLightbox
          image={image}
          alt="Full size image"
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center" onClick={openModal}>
        <Image
          src={image.url}
          alt="Image"
          width={300}
          height={300}
          className='w-full aspect-square object-cover rounded-lg transform scale-100 group-hover:scale-105 hover:brightness-45 group-hover:brightness-75 transition duration-200'
        />
      </div>
      
      <ImageLightbox
        image={image}
        alt="Full size image"
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  )
}

export default ImageHolder
