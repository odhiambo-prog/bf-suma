import { cn } from '@/lib/utils'

export type BadgeVariant = 'jade' | 'citrus' | 'danger' | 'amber' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  label: string
  icon?: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  jade: 'bg-jade-50 text-jade-700 border-jade-200',
  citrus: 'bg-citrus-50 text-citrus-700 border-citrus-200',
  danger: 'bg-danger-50 text-danger-700 border-danger-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  neutral: 'bg-muted-50 text-muted-600 border-muted-200',
}

const dotStyles: Record<BadgeVariant, string> = {
  jade: 'bg-jade-500',
  citrus: 'bg-citrus-500',
  danger: 'bg-danger-500',
  amber: 'bg-amber-500',
  neutral: 'bg-muted-400',
}

export default function Badge({ variant = 'neutral', label, icon, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase border rounded-full',
      variantStyles[variant],
      className,
    )}>
      {icon ?? <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />}
      {label}
    </span>
  )
}
