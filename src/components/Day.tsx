'use client'

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { day, formatHour, img, skies } from '@/lib/data'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { InViewHeading } from './InViewHeading'

type Moment = (typeof day)[number]

function MomentCard({ m, i }: { m: Moment; i: number }) {
  return (
    <article className={`w-[min(26rem,80vw)] shrink-0 ${i % 2 ? 'lg:translate-y-10' : ''}`}>
      <p className="display text-6xl text-sun-deep sm:text-7xl">
        <time dateTime={`${String(Math.floor(m.time)).padStart(2, '0')}:${m.time % 1 ? '30' : '00'}`}>{formatHour(m.time)}</time>
      </p>
      <div className="relative mt-4 h-[min(34vh,17rem)] overflow-hidden rounded-t-[10rem] rounded-b-[2rem] shadow-xl shadow-ink/20">
        <Image src={img(m.image)} alt="" fill sizes="(min-width: 1024px) 26rem, 82vw" className="object-cover" />
      </div>
      <h3 className="display mt-5 text-3xl sm:text-4xl">{m.title}</h3>
      <p className="mt-2 max-w-sm text-lg text-ink-soft">{m.text}</p>
    </article>
  )
}

function Heading() {
  return (
    <div className="container-page">
      <InViewHeading text="One day at Ember & Oak" className="display text-[clamp(2.75rem,5vw,4.75rem)]" />
    </div>
  )
}

// desktop: the section pins and vertical scroll slides the day sideways
function PinnedDay() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [now, setNow] = useState(day[0].time)

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const first = day[0].time
  const last = day[day.length - 1].time
  useMotionValueEvent(scrollYProgress, 'change', (p) => setNow(first + Math.round(p * (last - first) * 4) / 4))

  return (
    <section
      id="day"
      ref={section}
      data-sky={skies.morning}
      style={{ '--sky': skies.morning, height: `calc(100vh + ${distance}px)` } as CSSProperties}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden pt-20">
        <Heading />
        <motion.div ref={track} style={{ x }} className="flex w-max gap-16 pb-10 pr-[10vw] pl-[max(1.25rem,calc((100vw-80rem)/2+2rem))]">
          {day.map((m, i) => (
            <MomentCard key={m.title} m={m} i={i} />
          ))}
        </motion.div>
        <div className="container-page flex items-center gap-5" aria-hidden>
          <span className="display w-24 text-2xl tabular-nums">{formatHour(now)}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
            <motion.div className="h-full rounded-full bg-sun" style={{ width: progress }} />
          </div>
          <span className="text-sm font-semibold">{formatHour(last)}</span>
        </div>
      </div>
    </section>
  )
}

// phones and reduced motion: a swipeable row with its own progress bar and clock
function SwipeDay() {
  const row = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollXProgress } = useScroll({ container: row })
  const progress = useTransform(scrollXProgress, [0, 1], ['8%', '100%'])
  const [now, setNow] = useState(day[0].time)
  const first = day[0].time
  const last = day[day.length - 1].time
  useMotionValueEvent(scrollXProgress, 'change', (p) => setNow(first + Math.round(p * (last - first) * 4) / 4))

  return (
    <section id="day" data-sky={skies.morning} style={{ '--sky': skies.morning } as CSSProperties} className="py-24">
      <Heading />
      <p className="container-page mt-3 text-ink-soft">Swipe through the day.</p>
      <motion.div
        ref={row}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto overscroll-x-contain px-5 pb-4 sm:scroll-px-8 sm:px-8"
        tabIndex={0}
        aria-label="Moments through the day"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
      >
        {day.map((m, i) => (
          <motion.div
            key={m.title}
            className="shrink-0 snap-start last:snap-end"
            variants={{ hidden: { opacity: 0, x: reduce ? 0 : 40 }, show: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <MomentCard m={m} i={i} />
          </motion.div>
        ))}
      </motion.div>
      <div className="container-page mt-4 flex items-center gap-4" aria-hidden>
        <span className="display w-20 text-xl tabular-nums">{formatHour(now)}</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
          <motion.div className="h-full rounded-full bg-sun" style={{ width: progress }} />
        </div>
      </div>
    </section>
  )
}

export function Day() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const reduce = useReducedMotion()
  return desktop && !reduce ? <PinnedDay /> : <SwipeDay />
}
