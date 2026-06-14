import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  align?: 'center' | 'left'
}

export default function SectionHeader({ title, subtitle, eyebrow, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={cn(
      'max-w-2xl mb-10 md:mb-16',
      align === 'center' && 'mx-auto text-center'
    )}>
      {eyebrow && (
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-cobalt-600 mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl text-slate-900 leading-tight text-balance">
        {title}
      </h2>
      <div className={cn('pharma-stripe mt-5', align === 'center' && 'mx-auto')} />
      {subtitle && (
        <p className={cn('text-sm text-slate-500 leading-relaxed mt-6 max-w-lg text-balance', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
