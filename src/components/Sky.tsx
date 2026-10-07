'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { skies } from '@/lib/data'

type Stops = { at: number[]; colors: string[] }

// reads every [data-sky] section and returns the scroll positions where each one sits mid-screen
function useSkyStops(): Stops {
  const [stops, setStops] = useState<Stops>({ at: [0, 1], colors: [skies.dawn, skies.dawn] })

  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight
      const sections = [...document.querySelectorAll<HTMLElement>('[data-sky]')]
      const points = sections.map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY
        // the sky has fully turned once a section's top third reaches the middle of the screen
        return { at: Math.max(0, top + Math.min(el.offsetHeight, vh) / 3 - vh / 2), color: el.dataset.sky! }
      })
      if (points.length < 2) return
      // useTransform needs strictly increasing input
      const at: number[] = []
      const colors: string[] = []
      for (const p of points) {
        const last = at[at.length - 1]
        at.push(last === undefined ? p.at : Math.max(p.at, last + 1))
        colors.push(p.color)
      }
      setStops({ at, colors })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    // mobile address bars change the viewport height without resizing the body
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return stops
}

export function Sky() {
  const reduce = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const { at, colors } = useSkyStops()
  const background = useTransform(scrollY, at, colors)

  // the sun climbs across the first half of the page and sets over the second
  const sunX = useTransform(scrollYProgress, [0, 1], ['8vw', '78vw'])
  // svh, not vh, so the sun doesn't jump when a mobile address bar slides in or out
  const sunY = useTransform(scrollYProgress, [0, 0.45, 0.8, 0.92], ['62svh', '6svh', '40svh', '115svh'])
  const sunScale = useTransform(scrollYProgress, [0, 0.45, 0.9], [1, 0.8, 1.2])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ backgroundColor: background }} />
      {!reduce && (
        <motion.div
          className="absolute size-[min(34vw,26rem)] rounded-full bg-sun blur-3xl will-change-transform"
          style={{ x: sunX, y: sunY, scale: sunScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          transition={{ duration: 1.6 }}
        />
      )}
    </div>
  )
}
