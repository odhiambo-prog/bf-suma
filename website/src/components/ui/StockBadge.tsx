import { cn } from '@/lib/utils'

interface StockBadgeProps {
  branchName: string
  quantity: number
  inStock: boolean
}

export default function StockBadge({ branchName, quantity, inStock }: StockBadgeProps) {
  const status = !inStock || quantity === 0
    ? { label: 'Out of Stock', color: 'text-red-600', dot: 'bg-red-500' }
    : quantity < 5
      ? { label: `Low (${quantity})`, color: 'text-amber-600', dot: 'bg-amber-500' }
      : { label: 'In Stock', color: 'text-jade-600', dot: 'bg-jade-500' }

  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <span className="text-sm text-slate-700 font-medium">{branchName}</span>
      <span className={cn('flex items-center gap-2 text-xs font-semibold', status.color)}>
        <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
        {status.label}
      </span>
    </div>
  )
}
