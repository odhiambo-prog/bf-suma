import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatTileProps {
  label: string
  value: ReactNode
  icon: ReactNode
  to?: string
  hint?: string
  accent?: 'jade' | 'citrus' | 'neutral'
}

const accents = {
  jade: 'bg-jade-50 text-jade-600',
  citrus: 'bg-citrus-50 text-citrus-600',
  neutral: 'bg-surface-subtle text-muted-500',
}

export function StatTile({ label, value, icon, to, hint, accent = 'jade' }: StatTileProps) {
  const inner = (
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-surface-border bg-surface-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-float">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', accents[accent])}>
        {icon}
      </div>
      <div className="mt-6">
        <p className="text-2xl font-bold font-mono text-ink">{value}</p>
        <p className="mt-1 text-xs font-medium text-muted-600">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-muted-400">{hint}</p>}
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 rounded-2xl">
        {inner}
      </Link>
    )
  }
  return inner
}
