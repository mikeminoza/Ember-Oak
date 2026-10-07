'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, useRef } from 'react'
import { img, skies } from '@/lib/data'
import { useMediaQuery } from '@/lib/useMediaQuery'

const PHOTO = '1554118811-1e0d58224f24'
const ALT = 'Café interior with a coffee bar, pendant lights and a potted tree'

function Caption() {
  return (
    <>
      <h2 className="display text-[clamp(3.25rem,9vw,8.5rem)] text-cream">Pull up a chair.</h2>
      <p className="mt-4 max-w-md text-lg text-cream/85 sm:text-xl">
        Good light, an outlet at every table, and nobody rushing you out.
      </p>
    </>
  )
}

// a photo that opens from an inset window to the full screen as you scroll through it
export function Window() {
  const reduce = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')
  // remount when the mode changes so the scroll tracking is rebuilt with the right offsets
  return <WindowInner key={desktop ? 'pinned' : 'flow'} pinned={desktop && !reduce} reduce={!!reduce} />
}

function WindowInner({ pinned, reduce }: { pinned: boolean; reduce: boolean }) {
  const ref = useRef<HTMLElement>(null)

  // pinned on desktop: the section holds while the window opens; on phones it opens as it passes
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: pinned ? ['start start', 'end end'] : ['start end', 'center center'],
  })
  const clipPath = useTransform(
    scrollYProgress,
    [0, pinned ? 0.65 : 1],
    ['inset(12% 16% 12% 16% round 2.5rem)', 'inset(0% 0% 0% 0% round 0rem)'],
  )
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1])
  const textOpacity = useTransform(scrollYProgress, [pinned ? 0.45 : 0.55, pinned ? 0.75 : 1], [0, 1])
  const textY = useTransform(scrollYProgress, [pinned ? 0.45 : 0.55, pinned ? 0.75 : 1], [40, 0])

  if (reduce) {
    return (
      <section data-sky={skies.noon} style={{ '--sky': skies.noon } as CSSProperties} className="relative h-[80svh]">
        <Image src={img(PHOTO)} alt={ALT} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-16">
          <Caption />
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      data-sky={skies.noon}
      style={{ '--sky': skies.noon } as CSSProperties}
      className={pinned ? 'relative h-[220vh]' : 'relative h-[85svh]'}
    >
      <div className={pinned ? 'sticky top-0 h-screen overflow-hidden' : 'relative h-full overflow-hidden'}>
        <motion.div className="absolute inset-0 will-change-[clip-path]" style={{ clipPath }}>
          <motion.div className="absolute inset-0" style={{ scale }}>
            <Image src={img(PHOTO)} alt={ALT} fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/15 to-transparent" />
          <motion.div className="container-page absolute inset-x-0 bottom-0 pb-16 lg:pb-24" style={{ opacity: textOpacity, y: textY }}>
            <Caption />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
