'use client'

import { useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { cafe, skies } from '@/lib/data'
import { TextRoll } from './ui/text-roll'

export function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()

  return (
    <footer data-sky={skies.dusk} className="on-dark overflow-x-clip bg-ink text-cream">
      <div className="container-page py-14">
        <div ref={ref} className="display min-h-[0.9em] text-[clamp(4rem,15vw,14rem)] text-cream">
          {/* the letters roll in once the footer is on screen */}
          {inView && !reduce ? <TextRoll>Ember & Oak</TextRoll> : 'Ember & Oak'}
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-cream/20 pt-6 text-cream/75 sm:flex-row sm:justify-between">
          <p>
            {cafe.street}, {cafe.city}
          </p>
          <div className="flex flex-wrap gap-x-6">
            <a href={`mailto:${cafe.email}`} className="inline-flex min-h-11 items-center hover:text-cream">
              {cafe.email}
            </a>
            <a href={cafe.phoneHref} className="inline-flex min-h-11 items-center hover:text-cream">
              {cafe.phone}
            </a>
          </div>
        </div>
        <p className="mt-4 text-sm text-cream/60">A sample landing page. Ember &amp; Oak is not a real café.</p>
      </div>
    </footer>
  )
}
