import { create } from "zustand"
import { precollegeAlbum } from "@/lib/albums/precollege";
import { asiyafestAlbum } from '@/lib/albums/asiyafest'
import { binhiAlbum } from '@/lib/albums/binhi'
import {featuredAlbum} from '@/lib/albums/featured'

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
    { name: "Featured", album: featuredAlbum },
    { name: "Pre-College", album: precollegeAlbum },
    { name: "Asiyafest", album: asiyafestAlbum },
    { name: "Binhi", album: binhiAlbum },
  ],
}));
