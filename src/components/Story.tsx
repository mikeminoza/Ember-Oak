'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, useRef } from 'react'
import { img, skies, story } from '@/lib/data'
import { ease } from '@/lib/motion'
import { InView } from './ui/in-view'

export function Story() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // the photo opens like the sun coming out from behind a cloud
  const clip = useTransform(scrollYProgress, [0.1, 0.5], ['circle(22% at 50% 55%)', 'circle(75% at 50% 50%)'])
  const scale = useTransform(scrollYProgress, [0.1, 0.6], [1.25, 1])

  return (
    <section id="story" ref={ref} data-sky={skies.afternoon} style={{ '--sky': skies.afternoon } as CSSProperties} className="py-28 lg:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)]">
          <motion.div
            className="relative h-[28rem] overflow-hidden rounded-[2.5rem] lg:h-full"
            style={reduce ? undefined : { clipPath: clip }}
          >
            <motion.div className="absolute inset-0" style={reduce ? undefined : { scale }}>
              <Image
                src={img('1511537190424-bbbab87ac5eb')}
                alt="Freshly roasted beans pouring from the drum into the cooling tray"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        <div>
          <h2 className="display text-[clamp(3.25rem,7vw,6.5rem)]">From a cart to a roastery</h2>
          <ol className="mt-16 space-y-20 lg:space-y-32 lg:pb-24">
            {story.map((s) => (
              <InView
                key={s.year}
                as="li"
                variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.8, ease: ease.out }}
                viewOptions={{ margin: '0px 0px -25% 0px' }}
              >
                <p className="inline-block rounded-full bg-ink px-4 py-1.5 font-bold text-paper">{s.year}</p>
                <h3 className="display mt-5 text-5xl">{s.title}</h3>
                <p className="mt-4 max-w-md text-xl">{s.text}</p>
              </InView>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
