import { useState, useEffect } from 'react'
import { Check, X, Trash2, Star, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Review } from '@/types/review.types'
import Badge from '@/components/ui/Badge'
import { toast } from '@/components/admin/ui/Toaster'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { EmptyState } from '@/components/admin/ui/EmptyState'
import { cn } from '@/lib/utils'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (data) setReviews(data as Review[])
    setLoading(false)
  }

  async function toggleApproval(id: string, current: boolean) {
    await supabase.from('reviews').update({ is_approved: !current }).eq('id', id)
    toast.success(current ? 'Review rejected' : 'Review approved')
    refresh()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await supabase.from('reviews').delete().eq('id', deleteId)
    setDeleteId(null)
    toast.success('Review deleted')
    refresh()
  }

  const columns: Column<Review>[] = [
    {
      key: 'reviewer_name',
      header: 'Reviewer',
      render: row => (
        <div className="flex items-center gap-3">
          {row.photo_url ? (
            <img src={row.photo_url} alt="" className="w-9 h-9 rounded-full object-cover border border-surface-border" />
          ) : (
            <div className="w-9 h-9 bg-jade-50 rounded-full flex items-center justify-center text-xs font-bold text-jade-700">
              {row.reviewer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{row.reviewer_name}</p>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={cn('w-3 h-3', i <= row.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-200')} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'testimonial',
      header: 'Testimonial',
      render: row => <span className="text-muted-600 line-clamp-2">{row.testimonial}</span>,
    },
    {
      key: 'is_approved',
      header: 'Status',
      render: row => row.is_approved
        ? <Badge variant="jade" label="Approved" />
        : <Badge variant="amber" label="Pending" />,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink font-display">Reviews</h1>
        <p className="text-sm text-muted-600 mt-0.5">Approve or reject customer reviews.</p>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        rowKey={row => row.id}
        loading={loading}
        empty={
          <EmptyState
            icon={<MessageSquare className="w-5 h-5" />}
            title="No reviews yet"
            description="Customer reviews will appear here for moderation."
          />
        }
        actions={row => (
          <>
            <button
              onClick={() => toggleApproval(row.id, row.is_approved)}
              aria-label={row.is_approved ? 'Reject' : 'Approve'}
              className={cn(
                'p-2 rounded-lg transition-colors',
                row.is_approved
                  ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                  : 'text-jade-600 hover:text-jade-700 hover:bg-jade-50',
              )}
            >
              {row.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </button>
            <button onClick={() => setDeleteId(row.id)} aria-label="Delete" className="p-2 rounded-lg text-muted-400 hover:text-danger-600 hover:bg-danger-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete review?"
        description="This permanently removes the customer review. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
