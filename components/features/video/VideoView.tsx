import React from 'react'
import VideoCard from './VideoCard'

function VideoView() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <VideoCard
            title="Matcha"
            imageUrl="/IMG_3519.JPG"
            videoUrl="https://drive.google.com/file/d/14G-gekQB5iD6kb3wKEINMuZ6QognDJcy/view?usp=sharing"
            description="Pru and Elle's matcha popup event."
          />
          <VideoCard
            title="Still"
            imageUrl="/02.PNG"
            videoUrl="https://youtu.be/L5VtwPlY2co "
            description="A Short Film on Losing Direction."
          />
        </div>
      </div>
    </div>
  );
}
    
export default VideoView