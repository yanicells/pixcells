import React from 'react'
import AlbumViewClient from '@/components/features/album/AlbumViewClient'
import AlbumPagination from '@/components/features/album/AlbumPagination'

async function AlbumViewer({ params }: { params: Promise<{ album: string }> }) {
  const { album } = await params

  return (
    <>
      <AlbumViewClient album={album} />
      <AlbumPagination />
    </>
  )
}

export default AlbumViewer