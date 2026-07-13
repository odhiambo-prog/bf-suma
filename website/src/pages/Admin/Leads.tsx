import { useState } from 'react'
import { CheckCircle2, Clock, MessageSquare, Phone } from 'lucide-react'
import { useLeads, useUpdateLeadStatus } from '@/hooks/useLeads'
import type { Lead } from '@/hooks/useLeads'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { toast } from '@/components/admin/ui/Toaster'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { EmptyState } from '@/components/admin/ui/EmptyState'

export default function AdminLeads() {
  const { data: leads, isLoading } = useLeads()
  const updateStatus = useUpdateLeadStatus()
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted'>('all')

  const safeLeads = Array.isArray(leads) ? leads : []
  const filtered = filter === 'all' ? safeLeads : safeLeads.filter(l => l.status === filter)
  const newCount = safeLeads.filter(l => l.status === 'new').length

  function setStatus(id: string, status: 'new' | 'contacted') {
    updateStatus.mutate(
      { id, status },
      { onSuccess: () => toast.success(status === 'contacted' ? 'Marked as contacted' : 'Marked as new') },
    )
  }

  const columns: Column<Lead>[] = [
    { key: 'name', header: 'Name', render: row => <span className="font-medium text-ink">{row.name}</span> },
    {
      key: 'phone',
      header: 'Phone',
      render: row => (
        <a href={`tel:${row.phone}`} className="text-sm text-muted-600 hover:text-jade-700 transition-colors font-mono">
          <Phone className="w-3 h-3 inline mr-1" />{row.phone}
        </a>
      ),
    },
    { key: 'location', header: 'Location', render: row => <span className="text-muted-600">{row.location}</span> },
    { key: 'message', header: 'Message', render: row => <span className="text-muted-600 max-w-[220px] truncate block">{row.message || '—'}</span> },
    {
      key: 'created_at',
      header: 'Date',
      render: row => (
        <span className="text-muted-400 text-xs whitespace-nowrap">
          {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: row => (
        <Badge
          variant={row.status === 'new' ? 'amber' : 'jade'}
          label={row.status === 'new' ? 'New' : 'Contacted'}
        />
      ),
    },
  ]

  const filters: Array<'all' | 'new' | 'contacted'> = ['all', 'new', 'contacted']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink font-display">Leads</h1>
          <p className="text-sm text-muted-600 mt-0.5">
            {newCount > 0
              ? <span className="text-jade-700 font-semibold">{newCount} new</span>
              : 'All'} lead{newCount !== 1 ? 's' : ''} from website visitors.
          </p>
        </div>
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors',
                filter === f
                  ? 'bg-jade-600 text-white'
                  : 'bg-surface-subtle text-muted-600 hover:bg-muted-200',
              )}
            >
              {f} {f === 'new' ? `(${newCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={row => row.id}
        loading={isLoading}
        empty={
          <EmptyState
            icon={<MessageSquare className="w-5 h-5" />}
            title="No leads yet"
            description="Visitor inquiries from the website will appear here."
          />
        }
        actions={row => (
          <>
            <button
              onClick={() => setStatus(row.id, 'new')}
              disabled={updateStatus.isPending}
              aria-label="Mark new"
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors',
                row.status === 'new' ? 'bg-amber-50 text-amber-700' : 'text-muted-400 hover:text-amber-700 hover:bg-amber-50',
              )}
            >
              <Clock className="w-3 h-3" /> New
            </button>
            <button
              onClick={() => setStatus(row.id, 'contacted')}
              disabled={updateStatus.isPending}
              aria-label="Mark contacted"
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors',
                row.status === 'contacted' ? 'bg-jade-50 text-jade-700' : 'text-muted-400 hover:text-jade-700 hover:bg-jade-50',
              )}
            >
              <CheckCircle2 className="w-3 h-3" /> Contacted
            </button>
          </>
        )}
      />
    </div>
  )
}
