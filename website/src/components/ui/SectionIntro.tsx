import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { expo } from '@/lib/motion'

type Variant = 'default' | 'withTag' | 'sideLabel'

interface SectionIntroProps {
  title: string
  subtitle?: string
  /** Used sparingly (<=3 sections site-wide). Renders a small citrus pill, not a cobalt eyebrow. */
  tag?: string
  /** Deprecated eyebrow tell — only for the rare intentional section. */
  eyebrow?: string
  align?: 'center' | 'left'
  variant?: Variant
  className?: string
  as?: 'h1' | 'h2'
}

export default function SectionIntro({
  title,
  subtitle,
  tag,
  eyebrow,
  align = 'center',
  variant = 'default',
  className,
  as = 'h2',
}: SectionIntroProps) {
  const reduce = useReducedMotion()
  const Title = as === 'h1' ? motion.h1 : motion.h2
  const centered = align === 'center'

  const underline = !reduce ? (
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: expo, delay: 0.1 }}
      className="block h-[3px] w-12 rounded-full bg-citrus-500 origin-left mt-5"
    />
  ) : (
    <span className="block h-[3px] w-12 rounded-full bg-citrus-500 mt-5" />
  )

  if (variant === 'sideLabel') {
    return (
      <div className={cn('flex flex-col gap-4', centered && 'items-center text-center', className)}>
        {(tag || eyebrow) && (
          <span className={cn(
            'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] rounded-full border',
            centered ? 'self-center' : 'self-start',
            tag ? 'bg-citrus-50 text-citrus-700 border-citrus-200' : 'bg-jade-50 text-jade-700 border-jade-200',
          )}>
            {tag || eyebrow}
          </span>
        )}
        <Title
          className="font-display text-3xl sm:text-4xl text-ink leading-[1.15] text-balance"
        >
          {title}
        </Title>
        {underline}
        {subtitle && (
          <p className="text-sm text-muted-500 leading-relaxed max-w-lg text-balance">{subtitle}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'max-w-2xl',
      centered && 'mx-auto text-center',
      className,
    )}>
      {tag && (
        <motion.span
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            'inline-flex items-center px-3 py-1 mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] rounded-full border border-citrus-200 bg-citrus-50 text-citrus-700',
          )}
        >
          {tag}
        </motion.span>
      )}
      {eyebrow && !tag && (
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-citrus-600 mb-4">
          {eyebrow}
        </p>
      )}
        <Title
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: expo }}
        className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-ink leading-[1.12] text-balance"
      >
          {title}
        </Title>
      {centered ? <div className="flex justify-center">{underline}</div> : underline}
      {subtitle && (
        <p className={cn(
          'text-sm text-muted-500 leading-relaxed mt-6 max-w-lg text-balance',
          centered && 'mx-auto',
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
