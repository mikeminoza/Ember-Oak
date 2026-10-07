'use client'

import { motion, type MotionValue, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ChevronDown, Sun } from 'lucide-react'
import Image from 'next/image'
import { type CSSProperties, type PointerEvent, type ReactNode, useRef } from 'react'
import { cafe, img, openStatus, skies } from '@/lib/data'
import { ease } from '@/lib/motion'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useCafeClock } from '@/lib/useCafeClock'
import { useIntroReady } from './Providers'
import { RollLink } from './RollLink'
import { Magnetic } from './ui/magnetic'
import { SpinningText } from './ui/spinning-text'
import { TextEffect } from './ui/text-effect'
import { Tilt } from './ui/tilt'

// letters spring up and untilt, like steam settling
const letterVariants = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } } },
  item: {
    hidden: { y: '110%', rotate: 12, opacity: 0 },
    visible: { y: 0, rotate: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 18 } },
  },
}

type LayerProps = {
  children: ReactNode
  depth: number
  scroll: MotionValue<number>
  px: MotionValue<number>
  py: MotionValue<number>
  className: string
  delay: number
  ready: boolean
}

// a photo floating at its own depth: deeper layers drift further with the pointer and the scroll
function Layer({ children, depth, scroll, px, py, className, delay, ready }: LayerProps) {
  const reduce = useReducedMotion()
  // stacked under the text on small screens, so they drift far less there
  const wide = useMediaQuery('(min-width: 1024px)')
  const scrollY = useTransform(scroll, [0, 1], [0, (wide ? -220 : -60) * depth])
  const x = useTransform(px, (v) => v * 28 * depth)
  const yPointer = useTransform(py, (v) => v * 22 * depth)
  const y = useTransform([scrollY, yPointer], ([a, b]: number[]) => a + b)

  return (
    <motion.div
      className={`absolute ${className}`}
      style={reduce ? undefined : { x, y }}
      initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 1, ease: ease.out, delay }}
    >
      <Tilt rotationFactor={reduce ? 0 : 8} className="size-full">
        {children}
      </Tilt>
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  // re-evaluated every minute, in Portland time
  const status = useCafeClock() ? openStatus() : null
  // the entrance starts as the intro curtain lifts
  const { ready } = useIntroReady()
  const enter = { opacity: 1, y: 0 }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section
      id="top"
      ref={ref}
      data-sky={skies.dawn}
      style={{ '--sky': skies.dawn } as CSSProperties}
      onPointerMove={onPointerMove}
      className="relative flex min-h-svh flex-col overflow-hidden pt-32"
    >
      <div className="container-page grid flex-1 items-center gap-12 pb-10 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          {ready ? (
            <TextEffect
              as="h1"
              per="char"
              variants={letterVariants}
              className="display text-[clamp(3.75rem,10vw,9.5rem)]"
              segmentWrapperClassName="overflow-hidden inline-block pb-[0.08em] -mb-[0.08em]"
            >
              We open with the sun.
            </TextEffect>
          ) : (
            // holds the headline's place (and text) until the letters spring in
            <h1 className="display text-[clamp(3.75rem,10vw,9.5rem)]" style={{ opacity: 0 }}>
              We open with the sun.
            </h1>
          )}

          <motion.p
            className="mt-8 max-w-md text-xl text-ink-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? enter : undefined}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.7 }}
          >
            Croissants at 6:30, doors at 7, and coffee we roasted ourselves on Tuesday. A downtown Portland café
            that runs on daylight.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? enter : undefined}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.85 }}
          >
            <Magnetic intensity={0.35} range={110}>
              <RollLink href="#menu" className="rounded-full bg-sun px-8 py-4 text-lg font-bold text-ink shadow-[0_12px_30px_-10px_var(--color-sun)] transition-colors hover:bg-ink hover:text-cream">
                See the menu
              </RollLink>
            </Magnetic>
            <RollLink href="#day" className="rounded-full border border-ink/20 px-7 py-4 text-lg font-semibold transition-colors hover:border-ink">
              Spend a day with us
            </RollLink>
          </motion.div>
        </div>

        <div className="relative h-[28rem] sm:h-[34rem] lg:col-span-5 lg:h-[40rem]">
          <Layer depth={0.6} scroll={scrollYProgress} px={px} py={py} delay={0.3} ready={ready} className="top-0 right-[6%] h-[85%] w-[62%]">
            <div className="relative size-full overflow-hidden rounded-t-full rounded-b-[2.5rem] shadow-2xl shadow-ink/25">
              <Image src={img('1509042239860-f550ce710b93')} alt="Latte with leaf-shaped foam art" fill preload sizes="(min-width: 1024px) 26vw, 60vw" className="object-cover" />
            </div>
          </Layer>
          <Layer depth={1.4} scroll={scrollYProgress} px={px} py={py} delay={0.5} ready={ready} className="bottom-[4%] left-0 aspect-square w-[42%]">
            <div className="relative size-full overflow-hidden rounded-full border-[6px] border-cream shadow-xl shadow-ink/25">
              <Image src={img('1555507036-ab1f4038808a')} alt="Croissants dusted with sugar" fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
            </div>
          </Layer>
          <Layer depth={2.2} scroll={scrollYProgress} px={px} py={py} delay={0.7} ready={ready} className="top-[8%] left-[2%] aspect-[3/4] w-[30%]">
            <div className="relative size-full rotate-[-6deg] overflow-hidden rounded-[1.75rem] border-[6px] border-cream shadow-xl shadow-ink/25">
              <Image src={img('1541167760496-1628856ab772')} alt="Milk being poured into a latte" fill sizes="(min-width: 1024px) 12vw, 30vw" className="object-cover" />
            </div>
          </Layer>

          {/* a spinning stamp, like the sticker on our retail bags */}
          <motion.div
            aria-hidden
            className="absolute right-0 bottom-[10%] z-10 grid size-32 place-items-center rounded-full bg-ink text-cream shadow-xl shadow-ink/30 sm:size-36"
            initial={{ scale: 0, rotate: -40 }}
            animate={ready ? { scale: 1, rotate: 0 } : undefined}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 1 }}
          >
            <SpinningText radius={5.4} fontSize={0.72} duration={18} className="font-semibold tracking-[0.2em] uppercase">
              {'roasted tuesday • baked at 4am • '}
            </SpinningText>
            <Sun className="absolute size-7 text-sun" strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>

      <div className="container-page relative z-10 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink/15 py-5 text-sm font-semibold">
        <p className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${status?.open === false ? 'bg-ink-soft' : 'bg-open'}`} aria-hidden />
          {status?.label ?? 'Open daily from 7am'} at {cafe.street}
        </p>
        <a href="#day" className="flex min-h-11 items-center gap-2">
          Scroll through our day
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
            <ChevronDown className="size-4" aria-hidden />
          </motion.span>
        </a>
      </div>
    </section>
  )
}
