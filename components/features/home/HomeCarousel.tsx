import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './HomeCarouselArrowButton'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import ImageCard from '../../shared/ImageCard'
import styles from './embla-carousel.module.css'

type PropType = {
  images: Array<{ id: string; url: string }>
  albumName: string
  options?: EmblaOptionsType
  autoplay?: boolean
}

const HomeCarousel: React.FC<PropType> = (props) => {
  const { images, albumName, options, autoplay } = props
  
  // Configure plugins
  const plugins = []
  if (autoplay) {
    plugins.push(Autoplay({ 
      delay: 3500,
      playOnInit: true,
      stopOnMouseEnter: false,
      stopOnInteraction: false,
      stopOnFocusIn: false,
      stopOnLastSnap: false,
      jump: false
    }))
  }
  
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className={styles.embla}>
      <div className={styles['embla__viewport-wrapper']}>
        <div className={styles.embla__viewport} ref={emblaRef}>
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
    </section>
  )
}

export default HomeCarousel
