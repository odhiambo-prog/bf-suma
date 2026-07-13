import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string
  loading?: boolean
  empty?: ReactNode
  actions?: (row: T) => ReactNode
  onRowClick?: (row: T) => void
}

export function DataTable<T>({ columns, data, rowKey, loading, empty, actions, onRowClick }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-surface-subtle animate-pulse" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return <>{empty}</>
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-subtle/60">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-500',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-500">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-surface-border last:border-0 transition-colors hover:bg-surface-subtle/70',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map(col => (
                  <td key={col.key} className={cn('px-4 py-3 text-ink', col.className, col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')}>
                    {col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
