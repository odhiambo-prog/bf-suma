import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Branch } from '@/types/branch.types'
import { Button } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { toast } from '@/components/admin/ui/Toaster'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { SlideOver } from '@/components/admin/ui/SlideOver'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Field, Input, Switch } from '@/components/admin/ui/FormField'
import { EmptyState } from '@/components/admin/ui/EmptyState'

const emptyForm = { name: '', address: '', maps_embed_url: '', maps_link: '', phone: '', email: '', is_active: true, sort_order: 0 }

export default function AdminBranches() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    const { data } = await supabase.from('branches').select('*').order('sort_order')
    if (data) setBranches(data as Branch[])
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

  function openEdit(branch: Branch) {
    setForm({
      name: branch.name, address: branch.address, maps_embed_url: branch.maps_embed_url || '',
      maps_link: branch.maps_link || '', phone: branch.phone || '', email: branch.email || '',
      is_active: branch.is_active, sort_order: branch.sort_order,
    })
    setEditing(branch)
    setOpen(true)
  }

  async function handleSave(e?: { preventDefault: () => void }) {
    e?.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('branches').update(form).eq('id', editing.id)
        toast.success('Branch updated')
      } else {
        await supabase.from('branches').insert(form)
        toast.success('Branch created')
      }
    } catch {
      toast.error('Failed to save branch')
    }
    setSaving(false)
    setOpen(false)
    resetForm()
    refresh()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await supabase.from('branches').delete().eq('id', deleteId)
    setDeleteId(null)
    toast.success('Branch deleted')
    refresh()
  }

  const columns: Column<Branch>[] = [
    { key: 'name', header: 'Branch', render: row => <span className="font-medium text-ink">{row.name}</span> },
    { key: 'address', header: 'Address', render: row => <span className="text-muted-600">{row.address || '—'}</span> },
    {
      key: 'contact',
      header: 'Contact',
      render: row => (
        <span className="text-muted-600 text-xs">
          {[row.phone, row.email].filter(Boolean).join(' · ') || '—'}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: row => row.is_active
        ? <Badge variant="jade" label="Active" />
        : <Badge variant="neutral" label="Inactive" />,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink font-display">Branches</h1>
          <p className="text-sm text-muted-600 mt-0.5">Manage shop locations and contact details.</p>
        </div>
        <Button onClick={openNew} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> New Branch
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={branches}
        rowKey={row => row.id}
        loading={loading}
        empty={
          <EmptyState
            icon={<MapPin className="w-5 h-5" />}
            title="No branches yet"
            description="Add your shop locations and contact information."
            action={<Button onClick={openNew} variant="primary" size="sm"><Plus className="w-3.5 h-3.5" /> New Branch</Button>}
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
        title={editing ? 'Edit Branch' : 'New Branch'}
        description="Location and contact details."
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
          <Field label="Branch Name" htmlFor="name">
            <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Address" htmlFor="address">
            <Input id="address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </Field>
          <Field label="Google Maps Embed URL" htmlFor="maps_embed_url">
            <Input id="maps_embed_url" value={form.maps_embed_url} onChange={e => setForm({ ...form, maps_embed_url: e.target.value })} placeholder="<iframe src=..." />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Maps Link" htmlFor="maps_link">
              <Input id="maps_link" value={form.maps_link} onChange={e => setForm({ ...form, maps_link: e.target.value })} />
            </Field>
            <Field label="Sort Order" htmlFor="sort_order">
              <Input id="sort_order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={form.is_active} onChange={v => setForm({ ...form, is_active: v })} />
            <span className="text-sm text-muted-600">Active</span>
          </label>
        </form>
      </SlideOver>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete branch?"
        description="This permanently removes the branch. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
