import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, UserCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/admin/ImageUpload'
import type { TeamMember } from '@/types/team.types'
import { Button } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { toast } from '@/components/admin/ui/Toaster'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { SlideOver } from '@/components/admin/ui/SlideOver'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Field, Input, Switch } from '@/components/admin/ui/FormField'
import { EmptyState } from '@/components/admin/ui/EmptyState'

const emptyForm = { name: '', photo_url: '', sort_order: 0, is_active: true }

export default function AdminTeam() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    const { data } = await supabase.from('team_members').select('*').order('sort_order')
    if (data) setItems(data as TeamMember[])
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

  function openEdit(item: TeamMember) {
    setForm({ name: item.name, photo_url: item.photo_url || '', sort_order: item.sort_order, is_active: item.is_active })
    setEditing(item)
    setOpen(true)
  }

  async function handleSave(e?: { preventDefault: () => void }) {
    e?.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('team_members').update(form).eq('id', editing.id)
        toast.success('Team member updated')
      } else {
        await supabase.from('team_members').insert(form)
        toast.success('Team member created')
      }
    } catch {
      toast.error('Failed to save team member')
    }
    setSaving(false)
    setOpen(false)
    resetForm()
    refresh()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await supabase.from('team_members').delete().eq('id', deleteId)
    setDeleteId(null)
    toast.success('Team member deleted')
    refresh()
  }

  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Member',
      render: row => (
        <div className="flex items-center gap-3">
          {row.photo_url ? (
            <img src={row.photo_url} alt="" className="w-9 h-9 rounded-full object-cover border border-surface-border" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-jade-400 to-citrus-500 flex items-center justify-center text-sm font-bold text-white">
              {row.name.charAt(0)}
            </div>
          )}
          <span className="font-medium text-ink">{row.name}</span>
        </div>
      ),
    },
    { key: 'sort_order', header: 'Order', render: row => <span className="text-muted-600">{row.sort_order}</span> },
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
          <h1 className="text-xl font-semibold text-ink font-display">Team</h1>
          <p className="text-sm text-muted-600 mt-0.5">Manage team members.</p>
        </div>
        <Button onClick={openNew} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> New Member
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        rowKey={row => row.id}
        loading={loading}
        empty={
          <EmptyState
            icon={<UserCircle className="w-5 h-5" />}
            title="No team members yet"
            description="Add the people behind BF SUMA."
            action={<Button onClick={openNew} variant="primary" size="sm"><Plus className="w-3.5 h-3.5" /> New Member</Button>}
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
        title={editing ? 'Edit Member' : 'New Member'}
        description="Team member profile."
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
          <Field label="Name" htmlFor="name">
            <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Photo" hint="Upload a profile image.">
            <ImageUpload
              key={editing?.id || 'new'}
              bucket="team-photos"
              initialUrl={editing?.photo_url}
              onUpload={(url) => setForm({ ...form, photo_url: url })}
            />
          </Field>
          <Field label="Sort Order" htmlFor="sort_order">
            <Input id="sort_order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={form.is_active} onChange={v => setForm({ ...form, is_active: v })} />
            <span className="text-sm text-muted-600">Active</span>
          </label>
        </form>
      </SlideOver>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete team member?"
        description="This permanently removes the team member. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
