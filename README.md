# pixcells

My photography portfolio website showcasing moments captured with my Canon R50 + 50mm f/1.8.

## About

I'm still a beginner just having fun and playing around with my camera. I try to be active with orgs as well, capturing events and random moments that catch my eye. I can't post process to save my life, so what you see is pretty much straight out of camera (with maybe some light editing for when I feel motivated).

## Features

- **Home page** previews all albums in a Netflix-style carousel
- **Albums** can be viewed in grid or slide mode
- **Videos** section for video content

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui
- Zustand

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Adding New Albums

1. **Add your images** to `public/albums/[album-name]/`

2. **Create album file** in `lib/albums/[album-name].ts`:

```typescript
export const myAlbum = {
  album: [
    { id: "3000", url: "/albums/my-album/1.jpg" },
    { id: "3001", url: "/albums/my-album/2.jpg" },
    // add more images...
  ],
};
```

3. **Update the store** in `store/albums.store.ts`:

```typescript
import { myAlbum } from "@/lib/albums/my-album";

export const useAlbumsStore = create<AlbumsStore>(() => ({
  albums: [
    { name: "My Album", album: myAlbum },
    // other albums...
  ],
}));
```

That's it. Your new album will show up everywhere automatically.

## Project Structure

```
pixcells/
├── app/                    # Next.js app router pages
├── components/
│   ├── features/          # Feature-specific components
│   ├── shared/            # Reusable components
│   └── ui/                # shadcn/ui components
├── lib/
│   └── albums/            # Album data files
├── public/
│   └── albums/            # Image files
└── store/                 # Zustand state management
```

---

Built with Next.js and way too much coffee and <del>Vibe</del> aura coding
