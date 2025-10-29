import {
  Card,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import Image from "next/image"

interface VideoCardProps {
  title: string
  imageUrl: string
  videoUrl: string
  description: string
}

export default function VideoCard({ title, imageUrl, videoUrl, description }: VideoCardProps) {
  return (
    <Card className="w-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-4">
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block group">
          <div className="aspect-video rounded-lg overflow-hidden mb-3 relative">
            <Image 
              src={imageUrl} 
              alt={title} 
              width={400} 
              height={225} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
            />
          </div>
        </a>
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block group">
          <CardTitle className="text-base sm:text-lg mb-2 text-white group-hover:text-white/80 transition-colors">
            {title}
          </CardTitle>
        </a>
        <CardDescription className="text-sm text-white/70">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}