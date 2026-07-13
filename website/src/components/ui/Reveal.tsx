import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { revealUp, revealScale, fade, stagger } from '@/lib/motion'

interface RevealProps extends HTMLMotionProps<'div'> {
  variant?: 'up' | 'scale' | 'fade' | 'none'
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article'
}

export default function Reveal({
  variant = 'up',
  delay = 0,
  as = 'div',
  className,
  children,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = (as === 'li' ? motion.li : as === 'section' ? motion.section : as === 'article' ? motion.article : motion.div) as React.ElementType
  const variants =
    variant === 'scale' ? revealScale(!!reduce, delay)
      : variant === 'fade' ? fade(!!reduce, delay)
        : variant === 'none' ? (reduce ? { hidden: {}, visible: {} } : { hidden: {}, visible: {} })
          : revealUp(!!reduce, delay)

  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function RevealGroup({ className, children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const floatingSurfaceClass =
  'rounded-3xl bg-surface-card shadow-float border border-surface-border/60'

interface FloatingSurfaceProps extends HTMLMotionProps<'div'> {
  lift?: boolean
  children: React.ReactNode
}

export function FloatingSurface({ lift = true, className, children, ...props }: FloatingSurfaceProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      whileHover={lift && !reduce ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(floatingSurfaceClass, className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
