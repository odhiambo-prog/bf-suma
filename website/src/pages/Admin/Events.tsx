import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Upload, X, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Event, EventStatus } from '@/types/event.types'

const statuses: EventStatus[] = ['upcoming', 'ongoing', 'past']

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Event | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '', description: '', event_date: '', event_end_date: '',
    location_name: '', location_address: '', maps_link: '', status: 'upcoming' as EventStatus,
    is_published: true,
  })
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube'>('image')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadErrorEventId, setUploadErrorEventId] = useState('')

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    setLoading(true)
    const { data } = await supabase.from('events').select('*, event_media(*)').order('event_date', { ascending: false })
    if (data) setEvents(data as Event[])
    setLoading(false)
  }

  function resetForm() {
    setForm({ title: '', description: '', event_date: '', event_end_date: '', location_name: '', location_address: '', maps_link: '', status: 'upcoming', is_published: true })
    setMediaUrl('')
    setEditing(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    if (editing) {
      await supabase.from('events').update(form).eq('id', editing.id)
    } else {
      const { data } = await supabase.from('events').insert(form).select().single()
      if (data && mediaUrl) {
        await supabase.from('event_media').insert({ event_id: data.id, media_type: mediaType, url: mediaUrl })
      }
    }

    setSaving(false)
    setShowForm(false)
    resetForm()
    loadEvents()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    loadEvents()
  }

  async function handleAddMedia(eventId: string) {
    if (!mediaUrl) return
    setUploading(true)
    await supabase.from('event_media').insert({ event_id: eventId, media_type: mediaType, url: mediaUrl })
    setMediaUrl('')
    setUploading(false)
    loadEvents()
  }

  async function handleDeleteMedia(mediaId: string) {
    await supabase.from('event_media').delete().eq('id', mediaId)
    loadEvents()
  }

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>, eventId: string) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadError('')
    setUploadErrorEventId('')
    setUploading(true)
    let uploaded = 0
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
        uploaded++
      }
    }
    setUploading(false)
    loadEvents()
    e.target.value = ''
  }

  function openEdit(event: Event) {
    setForm({
      title: event.title, description: event.description || '',
      event_date: event.event_date.slice(0, 16), event_end_date: event.event_end_date?.slice(0, 16) || '',
      location_name: event.location_name, location_address: event.location_address,
      maps_link: event.maps_link || '', status: event.status,
      is_published: event.is_published,
    })
    setEditing(event)
    setShowForm(true)
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Events</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage events, media, and schedules.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New Event
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-slate-900 mb-6">{editing ? 'Edit Event' : 'New Event'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Start Date & Time</label>
                  <input type="datetime-local" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">End Date & Time</label>
                  <input type="datetime-local" value={form.event_end_date} onChange={e => setForm({...form, event_end_date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as EventStatus})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Published</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="rounded border-slate-300 text-jade-600 focus:ring-jade-500" />
                    <span className="text-sm text-slate-600">{form.is_published ? 'Visible on site' : 'Hidden'}</span>
                  </label>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Location Name</label>
                  <input value={form.location_name} onChange={e => setForm({...form, location_name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Location Address</label>
                  <input value={form.location_address} onChange={e => setForm({...form, location_address: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Maps Link</label>
                  <input value={form.maps_link} onChange={e => setForm({...form, maps_link: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" placeholder="https://maps.google.com/..." />
                </div>
              </div>

              {!editing && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-2">Media (optional)</label>
                  <div className="flex gap-2">
                    <select value={mediaType} onChange={e => setMediaType(e.target.value as any)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="youtube">YouTube</option>
                    </select>
                    <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" placeholder="Media URL (or upload below)" />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-6 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-slate-300 text-slate-600 rounded-lg px-6 py-2.5 text-xs font-semibold tracking-wider uppercase hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white h-16 animate-pulse rounded-xl border border-slate-200" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">No events yet. Create your first event.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
                      event.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                      event.status === 'ongoing' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {event.status}
                    </span>
                    {!event.is_published && <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Draft</span>}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(event.event_date)}{event.location_name && ` · ${event.location_name}`}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(event)} className="p-2 text-slate-400 hover:text-jade-600 hover:bg-jade-50 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                {uploadError && uploadErrorEventId === event.id && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-[11px] text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {uploadError}
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Media ({event.event_media?.length || 0})</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={e => handleMediaUpload(e, event.id)}
                      className="hidden"
                      id={`media-upload-${event.id}`}
                      disabled={uploading}
                    />
                    <label htmlFor={`media-upload-${event.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-jade-600 hover:bg-jade-50 rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-3 h-3" /> {uploading ? 'Uploading...' : 'Upload'}
                    </label>
                    <div className="flex gap-1">
                      <input
                        value={mediaUrl}
                        onChange={e => setMediaUrl(e.target.value)}
                        placeholder="Paste URL..."
                        className="w-40 px-2 py-1.5 border border-slate-200 rounded text-[11px] outline-none focus:border-jade-500"
                      />
                      <select value={mediaType} onChange={e => setMediaType(e.target.value as any)} className="px-2 py-1.5 border border-slate-200 rounded text-[11px] outline-none">
                        <option value="image">Img</option>
                        <option value="video">Vid</option>
                        <option value="youtube">YT</option>
                      </select>
                      <button onClick={() => handleAddMedia(event.id)} disabled={!mediaUrl || uploading} className="px-2 py-1.5 bg-jade-600 text-white rounded text-[10px] font-semibold disabled:opacity-50">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                {event.event_media && event.event_media.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.event_media.map(m => (
                      <div key={m.id} className="relative group">
                        {m.media_type === 'image' ? (
                          <img src={m.url} alt="" className="h-16 w-16 object-cover rounded border border-slate-200" />
                        ) : (
                          <div className="h-16 w-16 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                            {m.media_type === 'youtube' ? 'YT' : 'Video'}
                          </div>
                        )}
                        <button onClick={() => handleDeleteMedia(m.id)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
