import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { FAQ } from '@/types/faq.types'
import { Button } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { toast } from '@/components/admin/ui/Toaster'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { SlideOver } from '@/components/admin/ui/SlideOver'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Field, Input, Textarea, Switch } from '@/components/admin/ui/FormField'
import { EmptyState } from '@/components/admin/ui/EmptyState'

const emptyForm = { question: '', answer: '', category: 'General', sort_order: 0, is_published: true }

export default function AdminFAQ() {
  const [items, setItems] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    const { data } = await supabase.from('faqs').select('*').order('sort_order')
    if (data) setItems(data as FAQ[])
    setLoading(false)
  }

  function resetForm() {
    setForm({ ...emptyForm })
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setOpen(true)
  }

  function openEdit(item: FAQ) {
    setForm({ question: item.question, answer: item.answer, category: item.category, sort_order: item.sort_order, is_published: item.is_published })
    setEditing(item)
    setOpen(true)
  }

  async function handleSave(e?: { preventDefault: () => void }) {
    e?.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('faqs').update(form).eq('id', editing.id)
        toast.success('FAQ updated')
      } else {
        await supabase.from('faqs').insert(form)
        toast.success('FAQ created')
      }
    } catch {
      toast.error('Failed to save FAQ')
    }
    setSaving(false)
    setOpen(false)
    resetForm()
    refresh()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await supabase.from('faqs').delete().eq('id', deleteId)
    setDeleteId(null)
    toast.success('FAQ deleted')
    refresh()
  }

  const columns: Column<FAQ>[] = [
    { key: 'question', header: 'Question', render: row => <span className="font-medium text-ink">{row.question}</span> },
    { key: 'category', header: 'Category', render: row => <span className="text-muted-600">{row.category}</span> },
    {
      key: 'is_published',
      header: 'Status',
      render: row => row.is_published
        ? <Badge variant="jade" label="Published" />
        : <Badge variant="amber" label="Hidden" />,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink font-display">FAQ</h1>
          <p className="text-sm text-muted-600 mt-0.5">Manage frequently asked questions.</p>
        </div>
        <Button onClick={openNew} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> New FAQ
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        rowKey={row => row.id}
        loading={loading}
        empty={
          <EmptyState
            icon={<HelpCircle className="w-5 h-5" />}
            title="No FAQs yet"
            description="Add answers to common questions for your customers."
            action={<Button onClick={openNew} variant="primary" size="sm"><Plus className="w-3.5 h-3.5" /> New FAQ</Button>}
          />
        }
        actions={row => (
          <>
            <button onClick={() => openEdit(row)} aria-label="Edit" className="p-2 rounded-lg text-muted-400 hover:text-jade-600 hover:bg-jade-50 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => setDeleteId(row.id)} aria-label="Delete" className="p-2 rounded-lg text-muted-400 hover:text-danger-600 hover:bg-danger-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <SlideOver
        open={open}
        onClose={() => { setOpen(false); resetForm() }}
        title={editing ? 'Edit FAQ' : 'New FAQ'}
        description="Question and answer content."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Question" htmlFor="question">
            <Input id="question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required />
          </Field>
          <Field label="Answer" htmlFor="answer">
            <Textarea id="answer" rows={4} value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} required />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category" htmlFor="category">
              <Input id="category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </Field>
            <Field label="Sort Order" htmlFor="sort_order">
              <Input id="sort_order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={form.is_published} onChange={v => setForm({ ...form, is_published: v })} />
            <span className="text-sm text-muted-600">Published</span>
          </label>
        </form>
      </SlideOver>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete FAQ?"
        description="This permanently removes the question. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
