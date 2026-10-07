'use client'

import { useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { type PresetType, TextEffect } from './ui/text-effect'

type InViewHeadingProps = {
  text: string
  className?: string
  preset?: PresetType
  as?: 'h2' | 'h3'
  id?: string
}

// TextEffect renders nothing until triggered, so hold the heading's place (and its text, for search
// engines and no-JavaScript visitors) with a hidden copy until it scrolls into view
export function InViewHeading({ text, className, preset = 'slide', as = 'h2', id }: InViewHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const Tag = as

  return (
    <div ref={ref}>
      {inView && !reduce ? (
        <TextEffect as={as} per="word" preset={preset} className={className}>
          {text}
        </TextEffect>
      ) : (
        <Tag id={id} className={className} style={reduce ? undefined : { opacity: 0 }}>
          {text}
        </Tag>
      )}
    </div>
  )
}
