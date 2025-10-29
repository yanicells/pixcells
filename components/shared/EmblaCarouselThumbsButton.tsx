import React from 'react'
import Image from 'next/image'
import styles from './embla.module.css'

type PropType = {
  selected: boolean
  imageSrc: string
  alt: string
  onClick: () => void
}

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, imageSrc, alt, onClick } = props

  return (
    <div
      className={`${styles['embla-thumbs__slide']} ${
        selected ? styles['embla-thumbs__slide--selected'] : ''
      }`}
    >
      <button
        onClick={onClick}
        type="button"
        className={styles['embla-thumbs__slide__button']}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
        />
      </button>
    </div>
  )
}
