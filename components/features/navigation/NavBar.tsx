'use client';

import { useAlbumsStore, useButtonStore } from "@/store"
import { MenuDock, type MenuDockItem } from '@/components/ui/shadcn-io/menu-dock';
import { Home, Image, Video, LayoutGrid, LayoutList } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'
import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const albums = useAlbumsStore((state) => state.albums)
  const { isToggled, toggle } = useButtonStore()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Check if navbar has already animated in this session
    const navAnimated = sessionStorage.getItem('navbarAnimated')
    if (navAnimated === 'true') {
      setHasAnimated(true)
    } else {
      // Set flag after component mounts
      setTimeout(() => {
        sessionStorage.setItem('navbarAnimated', 'true')
        setHasAnimated(true)
      }, 1000)
    }
  }, [])

  const menuItems: MenuDockItem[] = [
    { 
      label: 'home', 
      icon: Home, 
      onClick: () => router.push('/')
    },
    { 
      label: 'albums', 
      icon: Image,
      subItems: albums.map(({ name }) => ({
        label: name,
        onClick: () => router.push(`/albums/${encodeURIComponent(name)}`)
      }))
    },
    { 
      label: 'videos', 
      icon: Video, 
      onClick: () => router.push('/videos')
    },
    {
      label: isToggled ? 'grid view' : 'slide view',
      icon: isToggled ? LayoutGrid : LayoutList,
      onClick: toggle,
      noHighlight: true // View toggle should not be highlighted as active
    },
  ];

  const activeIndex = useMemo(() => {
    if (pathname === '/') return 0;
    if (pathname.startsWith('/albums')) return 1;
    if (pathname === '/videos') return 2;
    return 0;
  }, [pathname]);

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        delay: hasAnimated ? 0 : 0.3
      }}
      className="flex items-center justify-center min-h-[80px] p-4"
    >
      {/* Responsive menu - icons only, no labels */}
      <MenuDock 
        items={menuItems}
        variant="compact"
        showLabels={false}
        className="lg:hidden"
        defaultActiveIndex={activeIndex}
      />
      <MenuDock 
        items={menuItems}
        variant="default"
        showLabels={false}
        className="hidden lg:flex"
        defaultActiveIndex={activeIndex}
      />
    </motion.div>
  );
}
