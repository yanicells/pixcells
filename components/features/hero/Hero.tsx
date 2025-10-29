"use client"

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Button } from '@/components/ui/button'
import { ArrowRight, Image as ImageIcon, Video } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Hero.module.css'

// Looping Typewriter Component with Multiple Texts
const LoopingTypewriter = ({ texts }: { texts: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [key, setKey] = useState(0)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayText = useTransform(rounded, (latest) => 
    texts[currentIndex].slice(0, latest)
  )

  // Get the longest text to reserve maximum space
  const longestText = texts.reduce((a, b) => a.length > b.length ? a : b, '')

  useEffect(() => {
    const currentText = texts[currentIndex]
    let timeoutId: NodeJS.Timeout
    
    const controls = animate(count, currentText.length, {
      type: "tween",
      duration: 5, // 5 seconds to type
      ease: "linear",
      delay: 0.5
    })

    controls.then(() => {
      // Wait 3 seconds after finishing, then move to next text
      timeoutId = setTimeout(() => {
        count.set(0)
        setCurrentIndex((prev) => (prev + 1) % texts.length) // Loop through texts
        setKey(prev => prev + 1)
      }, 3000)
    })

    return () => {
      controls.stop()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [key, currentIndex, texts, count])

  return (
    <span style={{ 
      position: 'relative',
      display: 'inline-block',
      textAlign: 'center'
    }}>
      {/* Invisible text to reserve space (using longest text) */}
      <span style={{ visibility: 'hidden' }}>{longestText}</span>
      {/* Visible typewriter text */}
      <motion.span 
        key={key}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0,
          right: 0,
          textAlign: 'center'
        }}
      >
        {displayText}
      </motion.span>
    </span>
  )
}

export const Hero = () => {
  const [greetingComplete, setGreetingComplete] = useState(false)

  useEffect(() => {
    // Check if greeting was already shown in this session (navigation, not refresh)
    const hasSeenGreeting = sessionStorage.getItem('greetingShown')
    if (hasSeenGreeting === 'true') {
      setGreetingComplete(true)
      return
    }

    const handleGreetingComplete = () => {
      setGreetingComplete(true)
      sessionStorage.setItem('greetingShown', 'true')
    }

    window.addEventListener('greetingComplete', handleGreetingComplete)
    return () => window.removeEventListener('greetingComplete', handleGreetingComplete)
  }, [])

  const subtitleTexts = [
    "Capturing life's fleeting moments through the lens. Every photograph tells a story worth preserving.",
    "Where light meets creativity. Exploring the world one frame at a time.",
    "Photography is the art of frozen time. Browse through curated collections of visual narratives."
  ]

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Portrait Photo */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={greetingComplete ? { 
            opacity: 1, 
            filter: "blur(0px)",
            y: [0, -10, 0]
          } : { 
            opacity: 0, 
            filter: "blur(10px)" 
          }}
          transition={{ 
            opacity: { duration: 0.8, ease: "easeOut" },
            filter: { duration: 0.8, ease: "easeOut" },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }
          }}
          className={styles.portraitWrapper}
        >
          <div className={styles.portraitFrame}>
            <Image
              src="/bg.jpg"
              alt="Photography Portfolio"
              fill
              priority
              className={styles.portraitImage}
            />
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={greetingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.title}
        >
          Welcome to{' '}
          <span className={styles.titleAccent}>pixcells</span>
        </motion.h1>

        {/* Subtitle with Looping Typewriter */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={greetingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={styles.subtitle}
        >
          <LoopingTypewriter texts={subtitleTexts} />
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={greetingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={styles.ctaButtons}
        >
          <Button 
            onClick={() => {
              document.getElementById('albums')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }} 
            size="lg" 
            className={styles.primaryButton}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            View Albums
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Link href="/videos">
            <Button size="lg" variant="outline" className={styles.secondaryButton}>
              <Video className="w-4 h-4 mr-2" />
              View Videos
            </Button>
          </Link>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className={styles.floatingElement}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  )
}
