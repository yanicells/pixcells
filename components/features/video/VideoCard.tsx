'use client';

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import Image from "next/image"
import { Play } from "lucide-react"
import { motion } from "framer-motion"

interface VideoCardProps {
  title: string
  imageUrl: string
  videoUrl: string
  description: string
}

export default function VideoCard({ title, imageUrl, videoUrl, description }: VideoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 group">
          {/* Thumbnail image */}
          <div className="relative aspect-video bg-black/20 overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={title} 
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              quality={75}
              loading="lazy"
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75" 
            />
            
            {/* Play button overlay - always visible */}
            <div className="absolute inset-0 flex items-center justify-center opacity-100">
              <motion.div
                className="w-16 h-16 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2 }}
              >
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </motion.div>
            </div>
          </div>

          {/* Text section below */}
          <div className="p-4 bg-white/5 backdrop-blur-sm">
            <CardTitle className="text-base sm:text-lg mb-1.5 text-white group-hover:text-white/90 transition-colors line-clamp-2">
              {title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-white/60 line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </div>
      </a>
    </motion.div>
  )
}