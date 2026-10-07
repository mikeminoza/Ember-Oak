import type { ReactNode } from 'react'

type RollLinkProps = {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

// on hover the label slides up and an identical copy rolls in from below; the mask is one line tall,
// so the button's own padding never shows the outgoing label
export function RollLink({ href, children, className = '', onClick }: RollLinkProps) {
  return (
    <a href={href} onClick={onClick} className={`group/roll inline-flex ${className}`}>
      <span className="relative block overflow-hidden">
        <span className="relative block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:-translate-y-full motion-reduce:transition-none">
          {children}
          <span aria-hidden className="absolute top-full left-0 block w-full">
            {children}
          </span>
        </span>
      </span>
    </a>
  )
}
