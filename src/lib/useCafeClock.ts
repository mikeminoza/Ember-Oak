'use client'

import { useSyncExternalStore } from 'react'
import { cafeTime } from './data'

// ticks every second but only re-renders when the café's minute changes
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000)
  return () => window.clearInterval(id)
}

// a string snapshot stays equal within the same minute, so React skips needless renders
const snapshot = () => {
  const t = cafeTime()
  return `${t.day}:${t.hour}:${t.minute}`
}

/** The current time in Portland, or null during server render and hydration. */
export function useCafeClock() {
  const key = useSyncExternalStore(subscribe, snapshot, () => null)
  if (!key) return null
  const [day, hour, minute] = key.split(':').map(Number)
  return { day, hour, minute, time: hour + minute / 60 }
}
