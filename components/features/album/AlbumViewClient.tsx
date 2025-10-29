"use client"

import React from 'react'
import AlbumGrid from '@/components/features/album/AlbumGrid'
import ToggleButton from '@/components/shared/ToggleButton'
import { useButtonStore } from '@/store'
import AlbumSlide from '@/components/features/album/AlbumSlide'

function AlbumViewClient({ album }: { album: string }) {
  const isToggled = useButtonStore((state) => state.isToggled)
  
  return (
    <>
      {isToggled ? <AlbumSlide 
            album={album}
            options={{ loop: true }}
          /> : <AlbumGrid album={album} />}
    </>
  )
}

export default AlbumViewClient
