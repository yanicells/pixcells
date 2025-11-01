import React from 'react'
import VideoCard from './VideoCard'

function VideoView() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <VideoCard title="Video Title" imageUrl="/bg.jpg" videoUrl="https://www.youtube.com/watch?v=YOUR_VIDEO_ID" description='Video description'/>
        </div>
      </div>
    </div>
  )
}
    
export default VideoView