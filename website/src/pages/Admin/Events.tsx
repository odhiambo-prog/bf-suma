import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Upload, X, AlertCircle, Calendar, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { computeEventStatus } from '@/lib/events'
import { cn } from '@/lib/utils'
import type { Event, EventStatus } from '@/types/event.types'
import { Button } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { toast } from '@/components/admin/ui/Toaster'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { SlideOver } from '@/components/admin/ui/SlideOver'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Field, Input, Textarea, Select, Switch } from '@/components/admin/ui/FormField'
import { EmptyState } from '@/components/admin/ui/EmptyState'

const statuses: EventStatus[] = ['upcoming', 'ongoing', 'past']

function effectiveStatus(event: Event): EventStatus {
  return computeEventStatus(event)
}

function localToUTC(local: string) {
  if (!local) return null
  return new Date(local).toISOString()
}

function utcToLocal(utc: string) {
  if (!utc) return ''
  const d = new Date(utc)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const emptyForm = {
  title: '', description: '', event_date: '', event_end_date: '',
  location_name: '', location_address: '', maps_link: '', status: '',
  is_published: true,
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Event | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({ ...emptyForm })
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube'>('image')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadErrorEventId, setUploadErrorEventId] = useState('')

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    const { data } = await supabase.from('events').select('*, event_media(*)').order('event_date', { ascending: false })
    const list = (data as Event[]) || []
    setEvents(list)
    setEditing(prev => (prev ? list.find(e => e.id === prev.id) ?? prev : prev))
    setLoading(false)
  }

  function resetForm() {
    setForm({ ...emptyForm })
    setMediaUrl('')
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setOpen(true)
  }

  function openEdit(event: Event) {
    setForm({
      title: event.title, description: event.description || '',
      event_date: utcToLocal(event.event_date), event_end_date: utcToLocal(event.event_end_date || ''),
      location_name: event.location_name, location_address: event.location_address,
      maps_link: event.maps_link || '', status: event.status || '',
      is_published: event.is_published,
    })
    setEditing(event)
    setOpen(true)
  }

  async function handleSave(e?: { preventDefault: () => void }) {
    e?.preventDefault()
    setSaving(true)

    const eventData = { ...form, event_date: localToUTC(form.event_date), event_end_date: localToUTC(form.event_end_date), status: form.status || null }

    try {
      if (editing) {
        await supabase.from('events').update(eventData).eq('id', editing.id)
        toast.success('Event updated')
      } else {
        const { data } = await supabase.from('events').insert(eventData).select().single()
        if (data && mediaUrl) {
          await supabase.from('event_media').insert({ event_id: data.id, media_type: mediaType, url: mediaUrl })
        }
        toast.success('Event created')
      }
    } catch {
      toast.error('Failed to save event')
    }

    setSaving(false)
    setOpen(false)
    resetForm()
    refresh()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await supabase.from('events').delete().eq('id', deleteId)
    setDeleteId(null)
    toast.success('Event deleted')
    refresh()
  }

  async function handleDeleteMedia(mediaId: string) {
    await supabase.from('event_media').delete().eq('id', mediaId)
    refresh()
  }

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>, eventId: string) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadError('')
    setUploadErrorEventId('')
    setUploading(true)
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('event-media').upload(filename, file, { contentType: file.type })
      if (error) {
        console.error('Supabase upload error:', error)
        setUploadError(error.message || 'Upload failed. Check console for details.')
        setUploadErrorEventId(eventId)
      } else {
        const { data: { publicUrl } } = supabase.storage.from('event-media').getPublicUrl(filename)
        await supabase.from('event_media').insert({
          event_id: eventId,
          media_type: file.type.startsWith('video') ? 'video' : 'image',
          url: publicUrl,
        })
      }
    }
    setUploading(false)
    refresh()
    e.target.value = ''
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const columns: Column<Event>[] = [
    {
      key: 'title',
      header: 'Event',
      render: row => (
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex h-2 w-2 rounded-full',
            effectiveStatus(row) === 'upcoming' ? 'bg-citrus-500' : effectiveStatus(row) === 'ongoing' ? 'bg-jade-500' : 'bg-muted-400',
          )} />
          <span className="font-medium text-ink">{row.title}</span>
        </div>
      ),
    },
    { key: 'event_date', header: 'Date', render: row => <span className="text-muted-600">{formatDate(row.event_date)}</span> },
    { key: 'location_name', header: 'Location', render: row => <span className="text-muted-600">{row.location_name || '—'}</span> },
    {
      key: 'status',
      header: 'Status',
      render: row => {
        const s = effectiveStatus(row)
        const variant = s === 'upcoming' ? 'citrus' : s === 'ongoing' ? 'jade' : 'neutral'
        return <Badge variant={variant} label={s} />
      },
    },
    {
      key: 'is_published',
      header: 'Visibility',
      render: row => row.is_published
        ? <Badge variant="jade" label="Published" />
        : <Badge variant="amber" label="Draft" />,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink font-display">Events</h1>
          <p className="text-sm text-muted-600 mt-0.5">Manage events, media, and schedules.</p>
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
            icon={<Calendar className="w-5 h-5" />}
            title="No events yet"
            description="Create your first event to display on the site."
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
        title={editing ? 'Edit Event' : 'New Event'}
        description="Event details and content."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date & Time" htmlFor="event_date">
              <Input id="event_date" type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} required />
            </Field>
            <Field label="End Date & Time" htmlFor="event_end_date">
              <Input id="event_end_date" type="datetime-local" value={form.event_end_date} onChange={e => setForm({ ...form, event_end_date: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status Override" htmlFor="status">
              <Select id="status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="">-- Auto-compute --</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                <Switch checked={form.is_published} onChange={v => setForm({ ...form, is_published: v })} />
                <span className="text-sm text-muted-600">{form.is_published ? 'Visible on site' : 'Hidden'}</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Location Name" htmlFor="location_name">
              <Input id="location_name" value={form.location_name} onChange={e => setForm({ ...form, location_name: e.target.value })} />
            </Field>
            <Field label="Location Address" htmlFor="location_address">
              <Input id="location_address" value={form.location_address} onChange={e => setForm({ ...form, location_address: e.target.value })} />
            </Field>
          </div>
          <Field label="Maps Link" htmlFor="maps_link">
            <Input id="maps_link" value={form.maps_link} onChange={e => setForm({ ...form, maps_link: e.target.value })} placeholder="https://maps.google.com/..." />
          </Field>

          {!editing && (
            <Field label="Media (optional)" hint="Add a media URL or use the uploader below when editing.">
              <div className="flex gap-2">
                <Select value={mediaType} onChange={e => setMediaType(e.target.value as typeof mediaType)} className="w-32">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="youtube">YouTube</option>
                </Select>
                <Input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="Media URL" />
              </div>
            </Field>
          )}

          {editing && (
            <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-700">Media ({editing.event_media?.length || 0})</p>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={e => handleMediaUpload(e, editing.id)}
                    className="hidden"
                    id={`media-upload-${editing.id}`}
                    disabled={uploading}
                  />
                  <label htmlFor={`media-upload-${editing.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-jade-700 bg-jade-50 hover:bg-jade-100 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-3 h-3" /> {uploading ? 'Uploading...' : 'Upload'}
                  </label>
                </div>
              </div>

              {uploadError && uploadErrorEventId === editing.id && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-danger-50 border border-danger-200 rounded-lg text-[11px] text-danger-700">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {uploadError}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {editing.event_media?.map(m => (
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
                {(!editing.event_media || editing.event_media.length === 0) && (
                  <p className="text-[11px] text-muted-400 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> No media yet.</p>
                )}
              </div>
            </div>
          )}
        </form>
      </SlideOver>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete event?"
        description="This permanently removes the event and its media. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
