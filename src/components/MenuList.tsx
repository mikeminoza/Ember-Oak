'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import Image from 'next/image'
import { type CSSProperties, type KeyboardEvent, type PointerEvent, useState } from 'react'
import { img, menu, skies } from '@/lib/data'
import { duration, ease, spring, stagger } from '@/lib/motion'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { InViewHeading } from './InViewHeading'

const categories = Object.keys(menu)
// ids can't contain spaces, or aria-labelledby reads 'Not coffee' as two ids
const tabId = (c: string) => `tab-${c.toLowerCase().replace(/\s+/g, '-')}`

export function MenuList() {
  const [active, setActive] = useState(categories[0])
  function select(c: string, focus = false) {
    setActive(c)
    if (focus) document.getElementById(tabId(c))?.focus()
  }

  // arrow keys, Home and End move between tabs, as screen reader users expect
  function onTabKeyDown(e: KeyboardEvent) {
    const i = categories.indexOf(active)
    const to =
      e.key === 'ArrowRight' ? (i + 1) % categories.length
      : e.key === 'ArrowLeft' ? (i - 1 + categories.length) % categories.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? categories.length - 1
      : -1
    if (to < 0) return
    e.preventDefault()
    select(categories[to], true)
  }
  const [preview, setPreview] = useState<string | null>(null)
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduce = useReducedMotion()

  // the preview trails the cursor on a soft spring
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 24 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 24 })

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <section id="menu" data-sky={skies.noon} style={{ '--sky': skies.noon } as CSSProperties} className="py-28 lg:py-36">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <InViewHeading text="What we pour" className="display text-[clamp(3.25rem,7vw,6.5rem)]" />
            <p className="mt-4 max-w-md text-lg text-ink-soft">
              Oat, almond or whole milk at no extra cost. Ask at the counter about gluten-free bakes.
            </p>
          </div>

          {/* an even 2x2 grid on phones so every option is visible; one pill row from tablets up */}
          <div className="w-full sm:w-auto">
            <div
              role="tablist"
              aria-label="Menu sections"
              onKeyDown={onTabKeyDown}
              className="grid grid-cols-2 gap-1 rounded-[1.75rem] border border-line bg-oat p-1.5 sm:flex sm:rounded-full"
            >
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  id={tabId(c)}
                  aria-selected={active === c}
                  aria-controls="menu-panel"
                  tabIndex={active === c ? 0 : -1}
                  onClick={() => select(c)}
                  className="relative min-h-12 rounded-full px-5 font-semibold whitespace-nowrap sm:min-h-11"
                >
                  {active === c && <motion.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-ink" transition={spring.indicator} />}
                  <span className={`relative transition-colors ${active === c ? 'text-cream' : ''}`}>{c}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          id="menu-panel"
          role="tabpanel"
          aria-labelledby={tabId(active)}
          className="relative mt-14"
          onPointerMove={canHover ? onPointerMove : undefined}
          onPointerLeave={() => setPreview(null)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={active}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: stagger } },
                exit: { opacity: 0, transition: { duration: duration.fast } },
              }}
              className="border-t-2 border-ink"
            >
              {menu[active].map((item) => (
                <motion.li
                  key={item.name}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: duration.base, ease: ease.out }}
                  onPointerEnter={() => setPreview(item.image ?? null)}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 border-b-2 border-ink py-6 sm:grid-cols-[1.2fr_1fr_auto]"
                >
                  {!canHover && item.image ? (
                    <span className="relative row-span-2 size-14 overflow-hidden rounded-full sm:hidden">
                      <Image src={img(item.image)} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                  ) : (
                    <span className="row-span-2 sm:hidden" />
                  )}
                  <h3 className="display text-3xl transition-transform duration-300 group-hover:translate-x-3 motion-reduce:transform-none sm:col-start-1 sm:row-start-1 sm:text-5xl">
                    {item.name}
                  </h3>
                  <p className="col-start-2 text-ink-soft sm:col-start-2 sm:row-start-1">{item.description}</p>
                  <p className="display col-start-3 row-span-2 row-start-1 text-3xl sm:row-span-1 sm:text-4xl">{item.price}</p>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>

          {canHover && (
            <motion.div aria-hidden className="pointer-events-none absolute top-0 left-0 z-20" style={{ x, y }}>
              <AnimatePresence>
                {preview && (
                  <motion.div
                    key={preview}
                    className="absolute -top-28 -left-24 h-56 w-48 overflow-hidden rounded-t-full rounded-b-3xl shadow-2xl shadow-ink/30"
                    initial={{ opacity: 0, scale: reduce ? 1 : 0.6, rotate: reduce ? 0 : -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
                    transition={spring.press}
                  >
                    <Image src={img(preview)} alt="" fill sizes="192px" className="object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
