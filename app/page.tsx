import Albums from "@/components/features/home/Albums"
import { Hero } from "@/components/features/hero/Hero"

export default function Home() {
  return (
    <>
      <Hero />
      <div id="albums">
        <Albums />
        <div className="p-8 sm:p-16 lg:p-24"></div>
      </div>
    </>
  )
}
