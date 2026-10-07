'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useIntroReady } from './Providers'

export const INTRO_KEY = 'eo-intro-seen'
const HOLD_MS = 1500

// sunrise curtain on the first visit of a session. The inline script in layout.tsx adds `intro-seen`
// to <html> before first paint for repeat visits and reduced motion, so the curtain never flashes.
export function Intro() {
  const { setReady } = useIntroReady()
  const [showing, setShowing] = useState(true)

  useEffect(() => {
    // already hidden by CSS for repeat visits and reduced motion; just let the hero start
    if (document.documentElement.classList.contains('intro-seen')) {
      setReady(true)
      return
    }
    const finish = () => {
      try {
        sessionStorage.setItem(INTRO_KEY, '1')
      } catch {}
      setShowing(false)
      setReady(true)
    }
    const timer = window.setTimeout(finish, HOLD_MS)
    // any click or key skips it
    window.addEventListener('pointerdown', finish, { once: true })
    window.addEventListener('keydown', finish, { once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('keydown', finish)
    }
  }, [setReady])

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          id="intro"
          aria-hidden
          className="fixed inset-0 z-[70] grid place-items-center bg-paper"
          // stops catching clicks the moment it starts lifting, even if the exit animation is paused
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', pointerEvents: 'none' }}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center">
            {/* the sun comes up over a horizon line */}
            <div className="relative h-14 w-40 overflow-hidden">
              <motion.span
                className="absolute bottom-0 left-1/2 size-16 -translate-x-1/2 rounded-full bg-sun"
                initial={{ y: '110%' }}
                animate={{ y: '45%' }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <motion.span
              className="h-px w-40 bg-ink/25"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="mt-6 overflow-hidden">
              <motion.span
                className="display block text-5xl sm:text-6xl"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              >
                Ember &amp; Oak
              </motion.span>
            </span>
            <motion.span
              className="mt-3 text-sm font-semibold text-ink-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Portland, since 2014
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
