"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { useButtonStore } from '@/store'

function ToggleButton() {
  const toggle = useButtonStore((state) => state.toggle)
  const isToggled = useButtonStore((state) => state.isToggled)

  return (
    <Button onClick={toggle}>{isToggled ? 'Grid' : 'Slide'}</Button>
  )
}

export default ToggleButton
