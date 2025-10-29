"use client"

import React from "react"
import { useAlbumsStore } from "@/store"
import ImageCard from "@/components/shared/ImageCard"
import styles from '../shared/embla.module.css'

const Gallery = ({ album }: { album: string }) => {
  const albums = useAlbumsStore((state) => state.albums)
  const albumData = albums.find((a) => a.name === album)
  const images = albumData?.album.album

  if (!images || images.length === 0) {
    return (
        <div className="text-center p-8 rounded-2xl">
          <p className="text-xl sm:text-2xl text-white/80 font-medium mb-2">
            No images found
          </p>
          <p className="text-sm sm:text-base text-white/60">
            This album is empty
          </p>
        </div>
    )
  }

  return (
    <div 
      className={` grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 w-full`}
    >
      {images.map((image) => (
        <div key={image.id}>
          <ImageCard image={image} />
        </div>
      ))}
    </div>
  )
}

export default Gallery
