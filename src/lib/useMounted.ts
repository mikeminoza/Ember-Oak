'use client'

import { useSyncExternalStore } from 'react'

const noop = () => () => {}

// false during SSR and hydration, true afterwards — for anything that depends on the visitor's clock
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false)
}
