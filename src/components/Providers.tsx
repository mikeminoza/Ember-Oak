'use client'

import { ReactLenis } from 'lenis/react'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { createContext, type ReactNode, useContext, useState } from 'react'

// true once the intro curtain has lifted, so the hero can start its entrance on cue
const IntroContext = createContext<{ ready: boolean; setReady: (v: boolean) => void }>({ ready: true, setReady: () => {} })
export const useIntroReady = () => useContext(IntroContext)

export function Providers({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)

  return (
    // honors prefers-reduced-motion for every animation on the page
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={{ ready, setReady }}>
        {/* inertia scrolling on mouse and trackpad; touch keeps native scrolling. Lenis stays mounted either
            way (swapping it out would remount the page) and simply stops smoothing for reduced motion */}
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduce, anchors: { offset: -90, immediate: !!reduce } }}>
          {children}
        </ReactLenis>
      </IntroContext.Provider>
    </MotionConfig>
  )
}
