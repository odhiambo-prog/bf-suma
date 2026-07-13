import type { Variants, Transition } from 'framer-motion'

/**
 * Motion system — "Evolve the Green Current"
 * Calm, premium, no bounce/elastic. Honors prefers-reduced-motion.
 */

export const expo = [0.16, 1, 0.3, 1] as const
export const quint = [0.22, 1, 0.36, 1] as const
export const citrusEase = [0.22, 1, 0.36, 1] as const

export const springSoft: Transition = { type: 'spring', stiffness: 260, damping: 24 }
export const springSnap: Transition = { type: 'spring', stiffness: 400, damping: 30 }
export const springLift: Transition = { type: 'spring', stiffness: 300, damping: 22 }

/** Reduced-motion fallback: keep opacity, drop transforms. */
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export function revealUp(reduce: boolean, delay = 0): Variants {
  if (reduce) return reducedFade
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: expo, delay },
    },
  }
}

export function revealScale(reduce: boolean, delay = 0): Variants {
  if (reduce) return reducedFade
  return {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.55, ease: expo, delay },
    },
  }
}

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export function fade(reduce: boolean, delay = 0): Variants {
  if (reduce) return reducedFade
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: expo, delay } },
  }
}

/** Per-word reveal for hero headlines. */
export function wordReveal(reduce: boolean, delay = 0): Variants {
  if (reduce) return reducedFade
  return {
    hidden: { opacity: 0, y: '0.4em' },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: expo, delay },
    },
  }
}

export const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}
