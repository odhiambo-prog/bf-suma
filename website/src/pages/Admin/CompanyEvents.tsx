import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Upload, X, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CompanyEvent, CompanyEventMedia } from '@/types/join-us.types'
import { Button } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { toast } from '@/components/admin/ui/Toaster'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { SlideOver } from '@/components/admin/ui/SlideOver'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Field, Input, Textarea, Switch } from '@/components/admin/ui/FormField'
import { EmptyState } from '@/components/admin/ui/EmptyState'

const emptyForm = { title: '', description: '', youtube_url: '', is_published: true, sort_order: 0 }

export default function AdminCompanyEvents() {
  const [events, setEvents] = useState<CompanyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<CompanyEvent | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({ ...emptyForm })
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaCaption, setMediaCaption] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube'>('image')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    const { data } = await supabase.from('company_events').select('*, company_event_media(*)').order('sort_order')
    const list = (data as CompanyEvent[]) || []
    setEvents(list)
    setEditing(prev => (prev ? list.find(e => e.id === prev.id) ?? prev : prev))
    setLoading(false)
  }

  function resetForm() {
    setForm({ ...emptyForm })
    setMediaUrl('')
    setMediaCaption('')
    setUploadError('')
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setOpen(true)
  }

  function openEdit(event: CompanyEvent) {
    setForm({
      title: event.title, description: event.description || '',
      youtube_url: event.youtube_url || '', is_published: event.is_published, sort_order: event.sort_order,
    })
    setEditing(event)
    setOpen(true)
  }

  async function handleSave(e?: { preventDefault: () => void }) {
    e?.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('company_events').update(form).eq('id', editing.id)
        toast.success('Company event updated')
      } else {
        const { data } = await supabase.from('company_events').insert(form).select().single()
        if (data && mediaUrl) {
          await supabase.from('company_event_media').insert({ company_event_id: data.id, media_type: mediaType, url: mediaUrl, caption: mediaCaption || null })
        }
        toast.success('Company event created')
      }
    } catch {
      toast.error('Failed to save company event')
    }
    setSaving(false)
    setOpen(false)
    resetForm()
    refresh()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await supabase.from('company_events').delete().eq('id', deleteId)
    setDeleteId(null)
    toast.success('Company event deleted')
    refresh()
  }

  async function handleAddMedia(eventId: string) {
    if (!mediaUrl) return
    await supabase.from('company_event_media').insert({ company_event_id: eventId, media_type: mediaType, url: mediaUrl, caption: mediaCaption || null })
    setMediaUrl(''); setMediaCaption('')
    refresh()
  }

  async function handleDeleteMedia(mediaId: string) {
    await supabase.from('company_event_media').delete().eq('id', mediaId)
    refresh()
  }

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>, eventId: string) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('company-events').upload(filename, file, { contentType: file.type })
    if (error) {
      console.error('Supabase upload error:', error)
      setUploadError(error.message || 'Upload failed. Make sure the storage bucket exists.')
    } else {
      const { data: { publicUrl } } = supabase.storage.from('company-events').getPublicUrl(filename)
      await supabase.from('company_event_media').insert({ company_event_id: eventId, media_type: file.type.startsWith('video') ? 'video' : 'image', url: publicUrl })
      refresh()
    }
  }

  const columns: Column<CompanyEvent>[] = [
    { key: 'title', header: 'Title', render: row => <span className="font-medium text-ink">{row.title}</span> },
    {
      key: 'media',
      header: 'Media',
      render: row => <span className="text-muted-600">{row.company_event_media?.length || 0} item(s)</span>,
    },
    {
      key: 'is_published',
      header: 'Status',
      render: row => row.is_published
        ? <Badge variant="jade" label="Published" />
        : <Badge variant="amber" label="Draft" />,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink font-display">Company Events</h1>
          <p className="text-sm text-muted-600 mt-0.5">Distributor program events for the Join Us page.</p>
        </div>
        <Button onClick={openNew} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> New Event
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={events}
        rowKey={row => row.id}
        loading={loading}
        empty={
          <EmptyState
            icon={<Users className="w-5 h-5" />}
            title="No company events yet"
            description="Add distributor program events and media."
            action={<Button onClick={openNew} variant="primary" size="sm"><Plus className="w-3.5 h-3.5" /> New Event</Button>}
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
        title={editing ? 'Edit Event' : 'New Company Event'}
        description="Event details and media."
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
          <Field label="Title" htmlFor="title">
            <Input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Description" htmlFor="description">
            <Textarea id="description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Sort Order" htmlFor="sort_order">
            <Input id="sort_order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          </Field>
          <Field label="YouTube URL" htmlFor="youtube_url">
            <Input id="youtube_url" value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={form.is_published} onChange={v => setForm({ ...form, is_published: v })} />
            <span className="text-sm text-muted-600">Published</span>
          </label>

          {!editing && (
            <Field label="Media (optional)" hint="Add a media URL. You can also upload once the event is created.">
              <div className="flex gap-2">
                <select
                  value={mediaType}
                  onChange={e => setMediaType(e.target.value as typeof mediaType)}
                  className="w-32 rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-jade-500/40 focus:border-jade-400"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="youtube">YouTube</option>
                </select>
                <Input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="Media URL" />
              </div>
              <Input className="mt-2" value={mediaCaption} onChange={e => setMediaCaption(e.target.value)} placeholder="Caption (optional)" />
            </Field>
          )}

          {editing && (
            <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-4">
              {uploadError && (
                <div className="flex-1 text-[11px] text-danger-700 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2 mb-3">{uploadError}</div>
              )}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-700">Media ({editing.company_event_media?.length || 0})</p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={e => handleMediaUpload(e, editing.id)}
                  className="hidden"
                  id={`ce-upload-${editing.id}`}
                />
                <label htmlFor={`ce-upload-${editing.id}`} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-jade-700 bg-jade-50 hover:bg-jade-100 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-3 h-3" /> Upload
                </label>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="URL..." />
                <Input value={mediaCaption} onChange={e => setMediaCaption(e.target.value)} placeholder="Caption..." />
                <Button variant="citrus" size="sm" onClick={() => handleAddMedia(editing.id)} disabled={!mediaUrl}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(editing.company_event_media || []).map((m: CompanyEventMedia) => (
                  <div key={m.id} className="relative group">
                    {m.media_type === 'image' ? (
                      <img src={m.url} alt="" className="h-16 w-16 object-cover rounded-lg border border-surface-border" />
                    ) : (
                      <div className="h-16 w-16 bg-surface-subtle rounded-lg border border-surface-border flex items-center justify-center text-[10px] text-muted-500">
                        {m.media_type === 'youtube' ? 'YT' : 'Video'}
                      </div>
                    )}
                    <button onClick={() => handleDeleteMedia(m.id)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-danger-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </SlideOver>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete company event?"
        description="This permanently removes the event and its media. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
