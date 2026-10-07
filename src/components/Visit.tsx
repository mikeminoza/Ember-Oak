'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { type CSSProperties, type FormEvent, type ReactNode, useState } from 'react'
import { cafe, formatHour, hours, skies } from '@/lib/data'
import { spring } from '@/lib/motion'
import { useCafeClock } from '@/lib/useCafeClock'
import { useMounted } from '@/lib/useMounted'
import { Magnetic } from './ui/magnetic'
import { InViewHeading } from './InViewHeading'

type Errors = Partial<Record<'name' | 'email' | 'date', string>>

const weekOrder = [1, 2, 3, 4, 5, 6, 0]
const times = [8, 9, 10, 11, 12, 13, 14, 15]

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 font-medium text-error">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-base transition-colors focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun aria-[invalid=true]:border-error'

function BookingForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [booked, setBooked] = useState<{ name: string; when: string } | null>(null)
  const today = useMounted() ? new Date().toLocaleDateString('en-CA') : undefined

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name')).trim()
    const date = String(data.get('date'))
    const next: Errors = {}
    if (!name) next.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(String(data.get('email')))) next.email = 'Enter an email address like you@example.com.'
    if (!date) next.date = 'Choose a date.'
    setErrors(next)
    if (Object.keys(next).length) return
    const dayLabel = new Date(`${date}T12:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    setBooked({ name: name.split(' ')[0], when: `${dayLabel} at ${formatHour(Number(data.get('time')))}` })
  }

  return (
    <div className="rounded-[2.5rem] border border-line bg-oat p-7 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {booked ? (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring.press}
            className="flex min-h-[26rem] flex-col items-start justify-center"
          >
            <motion.span
              className="grid size-16 place-items-center rounded-full bg-sun"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...spring.press, delay: 0.1 }}
              aria-hidden
            >
              <Check className="size-8" strokeWidth={3} />
            </motion.span>
            <p className="display mt-6 text-5xl">Table booked</p>
            <p className="mt-4 text-lg">
              Thanks, {booked.name}. We’ll hold it for you on {booked.when} and send a confirmation email.
            </p>
            <button onClick={() => setBooked(null)} className="mt-8 min-h-11 font-semibold underline decoration-2 underline-offset-4">
              Book another table
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" exit={{ opacity: 0, scale: 0.97 }} onSubmit={onSubmit} noValidate className="grid gap-5">
            <h3 className="display text-4xl">Book a table</h3>
            <Field id="name" label="Name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" className={inputClass} aria-invalid={!!errors.name} aria-describedby={errors.name && 'name-error'} />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input id="email" name="email" type="email" inputMode="email" autoComplete="email" className={inputClass} aria-invalid={!!errors.email} aria-describedby={errors.email && 'email-error'} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="date" label="Date" error={errors.date}>
                <input id="date" name="date" type="date" min={today} className={inputClass} aria-invalid={!!errors.date} aria-describedby={errors.date && 'date-error'} />
              </Field>
              <Field id="time" label="Time">
                <select id="time" name="time" className={inputClass} defaultValue="10">
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {formatHour(t)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="guests" label="Guests">
                <select id="guests" name="guests" className={inputClass} defaultValue="2">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Magnetic intensity={0.2} range={60}>
              <button type="submit" className="mt-1 min-h-14 w-full rounded-full bg-ink px-6 text-lg font-bold text-cream transition-colors hover:bg-sun hover:text-ink">
                Book table
              </button>
            </Magnetic>
            <p className="text-ink-soft">Walk-ins are always welcome. For 7 or more people, call us.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Visit() {
  const todayIndex = useCafeClock()?.day ?? -1
  return (
    <section
      id="visit"
      data-sky={skies.dusk}
      style={{ '--sky': skies.dusk } as CSSProperties}
      className="relative overflow-hidden pt-32 pb-24"
    >
      <div className="container-page relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <InViewHeading text="See you at sunrise." preset="blur" className="display text-[clamp(3.5rem,8vw,7.5rem)]" />

          <address className="mt-10 text-2xl leading-snug font-semibold not-italic">
            <a href={cafe.mapsHref} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
              {cafe.street}
              <br />
              {cafe.city}
            </a>
            <br />
            <a href={cafe.phoneHref} className="mt-1 inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              {cafe.phone}
            </a>
          </address>

          <table className="mt-10 w-full max-w-md text-lg">
            <caption className="sr-only">Opening hours</caption>
            <tbody>
              {weekOrder.map((i) => {
                const h = hours[i]
                const isToday = i === todayIndex
                return (
                  <tr key={h.day} className={`border-b border-line ${isToday ? 'font-bold' : ''}`}>
                    <th scope="row" className="py-2.5 text-left font-[inherit]">
                      {h.day}
                      {isToday && <span className="ml-2 rounded-full bg-sun px-2 py-0.5 text-xs text-ink">Today</span>}
                    </th>
                    <td className="py-2.5 text-right">
                      {formatHour(h.open)} to {formatHour(h.close)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <iframe
            title={`Map showing ${cafe.name} at ${cafe.street}`}
            src="https://www.openstreetmap.org/export/embed.html?bbox=-122.6815%2C45.5164%2C-122.6715%2C45.5214&layer=mapnik&marker=45.5189%2C-122.6765"
            className="mt-10 h-60 w-full max-w-md rounded-[2rem] border border-line grayscale-[.6]"
            loading="lazy"
          />
        </div>

        <div className="lg:col-span-6 lg:pt-40">
          <BookingForm />
        </div>
      </div>
    </section>
  )
}
