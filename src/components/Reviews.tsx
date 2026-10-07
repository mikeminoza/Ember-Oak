'use client'

import { animate, motion, type MotionValue, type PanInfo, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { ArrowLeft, ArrowRight, Pause, Play, Star } from 'lucide-react'
import { type CSSProperties, type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { reviews, skies } from '@/lib/data'
import { spring } from '@/lib/motion'
import { hasFinePointer } from '@/lib/pointer'
import { NumberTicker } from './ui/number-ticker'
import { Tilt } from './ui/tilt'

const AUTOPLAY_SECONDS = 6

// where each card sits relative to the active one: a fanned hand of cards
function placement(offset: number) {
  const abs = Math.abs(offset)
  if (abs === 0) return { x: '0%', scale: 1, rotate: 0, opacity: 1, zIndex: 30 }
  if (abs === 1) return { x: `${offset * 58}%`, scale: 0.84, rotate: offset * 6, opacity: 0.85, zIndex: 20 }
  if (abs === 2) return { x: `${offset * 100}%`, scale: 0.7, rotate: offset * 10, opacity: 0.4, zIndex: 10 }
  return { x: `${Math.sign(offset) * 130}%`, scale: 0.6, rotate: offset * 12, opacity: 0, zIndex: 0 }
}

// shortest signed distance around the loop, so the last card sits to the left of the first
function loopOffset(i: number, active: number, count: number) {
  let d = i - active
  if (d > count / 2) d -= count
  if (d < -count / 2) d += count
  return d
}

// ring on the play/pause button that fills until the next review
function ProgressRing({ progress }: { progress: MotionValue<number> }) {
  const dash = useTransform(progress, (p) => `${p * 100} 100`)
  return (
    <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
      <circle cx="18" cy="18" r="16" pathLength={100} fill="none" className="stroke-ink/15" strokeWidth="2.5" />
      <motion.circle cx="18" cy="18" r="16" pathLength={100} fill="none" className="stroke-sun-deep" strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: dash }} />
    </svg>
  )
}

export function Reviews() {
  const reduce = useReducedMotion()
  const count = reviews.length
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  // hover and keyboard focus pause rotation without changing the play/pause choice
  const [held, setHeld] = useState(false)
  const progress = useMotionValue(0)
  const region = useRef<HTMLDivElement>(null)
  const onScreen = useInView(region, { margin: '-20% 0px' })
  const rotating = playing && !held && !reduce && onScreen

  const wrap = (i: number) => ((i % count) + count) % count
  const go = (i: number) => setActive(wrap(i))
  // step from the latest index so rapid clicks all count
  const next = () => setActive((a) => wrap(a + 1))
  const prev = () => setActive((a) => wrap(a - 1))

  useEffect(() => {
    progress.set(0)
    if (!rotating) return
    const controls = animate(progress, 1, {
      duration: AUTOPLAY_SECONDS,
      ease: 'linear',
      onComplete: () => setActive((a) => (a + 1) % count),
    })
    return () => controls.stop()
  }, [active, rotating, progress, count])

  function onDragEnd(_: unknown, info: PanInfo) {
    const swipe = info.offset.x + info.velocity.x * 0.2
    if (swipe < -60) next()
    else if (swipe > 60) prev()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  const button =
    'grid size-14 place-items-center rounded-full bg-ink text-cream transition-colors hover:bg-sun hover:text-ink'

  return (
    <section id="reviews" data-sky={skies.golden} style={{ '--sky': skies.golden } as CSSProperties} className="overflow-hidden py-28 lg:py-36">
      <div className="container-page">
        <h2 className="display max-w-4xl text-[clamp(3.25rem,7vw,6.5rem)]">
          <span className="sr-only">4.9 stars from 1,200 neighbors</span>
          <span aria-hidden>
            <NumberTicker value={4.9} decimalPlaces={1} /> stars from <NumberTicker value={1200} delay={0.2} /> neighbors
          </span>
        </h2>
      </div>

      <div
        ref={region}
        role="region"
        aria-roledescription="carousel"
        aria-label="Reviews"
        className="mt-16"
        // pause for a real mouse hovering or keyboard focus; a tap on a phone shouldn't stop rotation for good
        onMouseEnter={() => hasFinePointer() && setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={(e) => e.target.matches(':focus-visible') && setHeld(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false)
        }}
      >
        {/* the stage: swipe, drag, or use the arrow keys once it has focus */}
        <div className="relative">
          <motion.div
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-live={rotating ? 'off' : 'polite'}
            className="relative mx-auto h-[24rem] w-[min(30rem,82vw)] cursor-grab touch-pan-y rounded-[2rem] active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
          >
            {reviews.map((r, i) => {
              const offset = loopOffset(i, active, count)
              const isActive = offset === 0
              const place = placement(offset)
              return (
                <motion.div
                  key={r.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={!isActive}
                  className="absolute inset-0"
                  initial={false}
                  animate={place}
                  style={{ zIndex: place.zIndex }}
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }}
                  onClick={() => !isActive && go(i)}
                >
                  <Tilt rotationFactor={isActive && !reduce ? 8 : 0} className="size-full">
                    <figure className="flex size-full flex-col rounded-[2rem] border border-line bg-paper p-7 shadow-xl shadow-ink/10 select-none sm:p-9">
                      <div className="flex gap-1 text-sun-deep" role="img" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }, (_, s) => (
                          <Star key={s} className="size-5 fill-current" aria-hidden />
                        ))}
                      </div>
                      <blockquote className="mt-5 flex-1 text-xl leading-snug font-medium sm:mt-6 sm:text-2xl">“{r.quote}”</blockquote>
                      <figcaption className="font-semibold sm:text-lg">
                        {r.name} <span className="font-normal text-ink-soft">on {r.source}</span>
                      </figcaption>
                    </figure>
                  </Tilt>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <div className="container-page mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-6">
          <motion.button type="button" whileTap={{ scale: 0.9 }} transition={spring.press} onClick={prev} aria-label="Previous review" className={button}>
            <ArrowLeft className="size-5" aria-hidden />
          </motion.button>

          {/* dots get their own row on small phones */}
          <div className="order-first flex w-full items-center justify-center gap-2 sm:order-none sm:w-auto">
            {reviews.map((r, i) => (
              <button
                key={r.name}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show review ${i + 1} of ${count}`}
                aria-current={i === active}
                className="grid h-11 place-items-center px-1"
              >
                <motion.span
                  className="block h-2.5 rounded-full bg-ink"
                  animate={{ width: i === active ? 32 : 10, opacity: i === active ? 1 : 0.3 }}
                  transition={spring.indicator}
                />
              </button>
            ))}
          </div>

          <motion.button type="button" whileTap={{ scale: 0.9 }} transition={spring.press} onClick={next} aria-label="Next review" className={button}>
            <ArrowRight className="size-5" aria-hidden />
          </motion.button>

          {!reduce && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause rotating reviews' : 'Play rotating reviews'}
              className="relative grid size-14 place-items-center rounded-full border border-line bg-paper transition-colors hover:bg-oat"
            >
              <ProgressRing progress={progress} />
              {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
