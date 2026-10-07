'use client'

import { useReducedMotion } from 'motion/react'
import { Sun } from 'lucide-react'
import { farms } from '@/lib/data'
import { InfiniteSlider } from './ui/infinite-slider'

const rhythm = ['Roasted on Tuesday', 'Baked at 4am', 'Poured until 5:30', 'Six farms, one drum']

function Row({ items, className }: { items: string[]; className: string }) {
  return (
    <>
      {items.map((item) => (
        <span key={item} className={`flex items-center gap-8 whitespace-nowrap ${className}`}>
          {item}
          <Sun className="size-[0.6em] shrink-0 text-sun" strokeWidth={2.5} aria-hidden />
        </span>
      ))}
    </>
  )
}

// two ribbons crossing at the seam between dawn and morning
export function Ribbons() {
  const reduce = useReducedMotion()

  const ribbon = (items: string[], text: string, reverse: boolean) =>
    reduce ? (
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 px-6">
        <Row items={items} className={text} />
      </div>
    ) : (
      <InfiniteSlider gap={32} speed={50} speedOnHover={18} reverse={reverse}>
        <Row items={items} className={text} />
      </InfiniteSlider>
    )

  return (
    <section aria-labelledby="farms-title" className="relative z-10 -my-6 overflow-hidden py-16">
      <h2 id="farms-title" className="sr-only">
        The six farms we buy from
      </h2>
      <ul className="sr-only">
        {farms.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div aria-hidden className="relative">
        <div className="relative z-10 -mx-4 -rotate-3 bg-ink py-5 shadow-2xl shadow-ink/30">
          {ribbon(farms, 'display text-4xl text-paper sm:text-6xl', false)}
        </div>
        <div className="absolute inset-x-0 top-1/2 -mx-4 -translate-y-1/2 rotate-2 border-y border-line bg-oat py-4">
          {ribbon(rhythm, 'display text-3xl text-ink sm:text-5xl', true)}
        </div>
      </div>
    </section>
  )
}
