"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { Thumb } from '../../shared/EmblaCarouselThumbsButton'
import ImageCard from '../../shared/ImageCard'
import { useAlbumsStore } from '@/store'
import styles from '../../shared/embla.module.css'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from '../home/HomeCarouselArrowButton'

type PropType = {
  album: string
  options?: EmblaOptionsType
}

export function AlbumSlide({ album, options }: PropType) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaMainApi)

  const albums = useAlbumsStore((state) => state.albums)
  const albumData = albums.find((a) => a.name === album)

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  if (!albumData) return null

  const images = albumData.album.album

  return (
    <div className={`${styles.embla} ${styles.container}`}>
      <div className={styles['embla__viewport-wrapper']}>
        <div className={styles.embla__viewport} ref={emblaMainRef}>
          <div className={styles.embla__container}>
            {images.map((image, index) => (
              <div className={styles.embla__slide} key={image.id}>
                <div className={styles.embla__slide__img}>
                  <ImageCard image={image} variant="carousel" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <PrevButton 
          onClick={onPrevButtonClick} 
          disabled={prevBtnDisabled}
          className={`${styles.embla__button} ${styles['embla__button--prev']}`}
        />
        <NextButton 
          onClick={onNextButtonClick} 
          disabled={nextBtnDisabled}
          className={`${styles.embla__button} ${styles['embla__button--next']}`}
        />
      </div>

      <div className={styles['embla-thumbs']}>
        <div className={styles['embla-thumbs__viewport']} ref={emblaThumbsRef}>
          <div className={styles['embla-thumbs__container']}>
            {images.map((image, index) => (
              <Thumb
                key={image.id}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                imageSrc={image.url}
                alt={`${albumData.name} thumbnail ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbumSlide
