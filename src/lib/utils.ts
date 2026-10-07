import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// the class-merging helper shadcn-style components (Motion Primitives, 21st.dev) expect at @/lib/utils
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
