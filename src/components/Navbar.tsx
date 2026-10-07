'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { formatClock, openStatus } from '@/lib/data'
import { spring } from '@/lib/motion'
import { useCafeClock } from '@/lib/useCafeClock'
import { Magnetic } from './ui/magnetic'
import { SlidingNumber } from './ui/sliding-number'

const links = [
  { href: '#day', label: 'Our day' },
  { href: '#menu', label: 'Menu' },
  { href: '#story', label: 'Story' },
  { href: '#visit', label: 'Visit' },
]

// the real time at the café, with the sun or moon for the hour and a dot for open or closed
function CafeClock() {
  const clock = useCafeClock()
  if (!clock) return <div className="hidden h-8 w-36 lg:block" aria-hidden />

  const daylight = clock.hour >= 6 && clock.hour < 18
  const status = openStatus()
  const time = formatClock(clock)

  return (
    <div
      className="hidden items-center gap-2 rounded-full bg-ink/5 px-3 py-1.5 text-sm font-semibold tabular-nums lg:flex"
      title={`${time} in Portland. ${status.label}`}
    >
      <span className="sr-only">
        It’s {time} in Portland. {status.label}.
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={daylight ? 'sun' : 'moon'}
          aria-hidden
          initial={{ rotate: -90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          exit={{ rotate: 90, scale: 0 }}
          transition={spring.press}
        >
          {daylight ? <Sun className="size-4 text-sun-deep" /> : <Moon className="size-4" />}
        </motion.span>
      </AnimatePresence>
      {/* digits roll over when the minute changes */}
      <span aria-hidden className="flex items-center">
        <SlidingNumber value={clock.hour % 12 === 0 ? 12 : clock.hour % 12} />
        <span>:</span>
        <SlidingNumber value={clock.minute} padStart />
        <span>{clock.hour >= 12 ? 'pm' : 'am'}</span>
      </span>
      <span aria-hidden className={`size-2 rounded-full ${status.open ? 'bg-open' : 'bg-ink/30'}`} />
      <span aria-hidden className="font-medium text-ink-soft">
        {status.open ? 'Open' : 'Closed'}
      </span>
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-5xl items-center gap-4 rounded-full border border-line bg-paper/85 pr-2 pl-6 shadow-[0_10px_40px_-12px_rgb(35_26_51/0.35)] backdrop-blur-xl"
      >
        <a href="#top" className="display flex min-h-11 items-center text-2xl">
          Ember &amp; Oak
        </a>

        <ul className="mx-auto hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                onMouseEnter={() => setHovered(l.href)}
                onFocus={() => setHovered(l.href)}
                onBlur={() => setHovered(null)}
                className="relative z-10 block rounded-full px-4 py-2 font-semibold"
              >
                {l.label}
              </a>
              {hovered === l.href && (
                <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-ink/8" transition={spring.indicator} />
              )}
            </li>
          ))}
        </ul>

        <CafeClock />

        <div className="ml-auto hidden md:block lg:ml-0">
          <Magnetic intensity={0.3} range={80}>
            <a href="#visit" className="block rounded-full bg-ink px-5 py-3 font-semibold text-cream transition-colors hover:bg-sun hover:text-ink">
              Book a table
            </a>
          </Magnetic>
        </div>

        <button
          type="button"
          className="ml-auto grid size-12 place-items-center rounded-full bg-ink text-cream md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="on-dark mx-auto mt-2 max-w-5xl origin-top rounded-[2rem] bg-ink p-4 text-cream md:hidden"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={spring.press}
          >
            <ul>
              {links.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="display block rounded-2xl px-4 py-3 text-4xl hover:bg-cream/10">
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="mt-2">
                <a href="#visit" onClick={() => setOpen(false)} className="block rounded-full bg-sun px-5 py-4 text-center font-semibold text-ink">
                  Book a table
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
