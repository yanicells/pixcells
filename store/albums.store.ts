import { create } from "zustand"
import { preCollegeAlbum } from '@/lib/albums/pre-college'

export interface AlbumImage {
  id: string
  url: string
}

export interface Album {
  album: AlbumImage[]
}

export type AlbumsStore = {
  albums: { name: string; album: Album }[]
}

export const useAlbumsStore = create<AlbumsStore>(() => ({
  albums: [
    { name: "Pre-College", album: preCollegeAlbum },
  ],
}))
