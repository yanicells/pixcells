import * as React from "react"

import HomeCarousel from "./HomeCarousel"
import { useAlbumsStore } from "@/store/albums.store"

export function AlbumCarousel({ album }: { album: string }) {
    
    const albums = useAlbumsStore((state) => state.albums)
    const albumData = albums.find((a) => a.name === album)
    if (!albumData) return null

    const images = albumData.album.album
    
    const isFirstAlbum = albums[0]?.name === album

  return (
    <HomeCarousel
      images={images} 
      albumName={albumData.name}
      options={{ 
        align: 'start', 
        loop: true, 
        dragFree: true,
        duration: 1000,
        startIndex: 0
      }}
      autoplay={isFirstAlbum}
    />
)
}

export default AlbumCarousel
