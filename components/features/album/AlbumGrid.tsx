import Gallery from '@/components/shared/Gallery'
import React from 'react'
import styles from '@/components/shared/embla.module.css'

function AlbumGrid({ album }: { album: string }) {
  return (
    <div 
      className={`${styles.container} w-full lg:w-[60vw] lg:mx-auto p-4 h-[68vh] md:h-[74vh] lg:h-[76vh]`}
    >
      <div
        className="w-full h-full overflow-y-auto overflow-x-hidden pr-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(150, 160, 130, 0.5) transparent',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background: rgba(150, 160, 130, 0.5);
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(150, 160, 130, 0.7);
          }
        `}</style>
        <Gallery album={album} />
      </div>
    </div>
  )
}

export default AlbumGrid
