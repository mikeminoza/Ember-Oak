// shared motion tokens so every animation on the page speaks the same language
export const ease = {
  // quick start, long soft landing: text and entrances
  out: [0.22, 1, 0.36, 1],
} as const

export const duration = {
  fast: 0.15, // state swaps (tabs, form)
  base: 0.35, // menus, list items
} as const

export const spring = {
  press: { type: 'spring', stiffness: 500, damping: 30 },
  indicator: { type: 'spring', stiffness: 500, damping: 38 },
} as const

export const stagger = 0.06
