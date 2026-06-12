import { cn } from '@/lib/utils'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray'

interface BadgeProps {
  variant: BadgeVariant
  label: string
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-jade-50 text-jade-700 border-jade-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  blue: 'bg-cobalt-50 text-cobalt-700 border-cobalt-200',
  gray: 'bg-slate-100 text-slate-600 border-slate-200',
}

const dotStyles: Record<BadgeVariant, string> = {
  green: 'bg-jade-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-cobalt-500',
  gray: 'bg-slate-400',
}

export default function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase border',
      variantStyles[variant],
      className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />
      {label}
    </span>
  )
}
