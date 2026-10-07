"use client"

// Adapted from dillionverma/number-ticker (Magic UI) on 21st.dev: https://21st.dev/@dillionverma/components/number-ticker
// Changes: motion/react instead of framer-motion, renders the final number on the server (so it reads right
// without JavaScript) and resets to the start on mount, skips the count for reduced motion, no cn() helper.

import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { useEffect, useRef } from "react"

const format = (n: number, decimalPlaces: number) =>
  Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(n.toFixed(decimalPlaces)))

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className = "",
  decimalPlaces = 0,
}: {
  value: number
  direction?: "up" | "down"
  className?: string
  /** seconds */
  delay?: number
  decimalPlaces?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const start = direction === "down" ? value : 0
  const end = direction === "down" ? 0 : value
  const motionValue = useMotionValue(start)
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  // the server rendered the final value; rewind it so the count has somewhere to start from
  useEffect(() => {
    if (!reduce && ref.current) ref.current.textContent = format(start, decimalPlaces)
  }, [reduce, start, decimalPlaces])

  useEffect(() => {
    if (reduce || !isInView) return
    const timer = setTimeout(() => motionValue.set(end), delay * 1000)
    return () => clearTimeout(timer)
  }, [motionValue, isInView, delay, end, reduce])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = format(latest, decimalPlaces)
      }),
    [springValue, decimalPlaces],
  )

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {format(end, decimalPlaces)}
    </span>
  )
}
