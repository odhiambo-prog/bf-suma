import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface CompanyEvent {
  id: string; title: string; description?: string
  youtube_url?: string; is_published: boolean; sort_order: number
  company_event_media: { id: string; media_type: string; url: string }[]
}

export default function AdminCompanyEvents() {
  const [events, setEvents] = useState<CompanyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<CompanyEvent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaCaption, setMediaCaption] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube'>('image')
  const [form, setForm] = useState({ title: '', description: '', youtube_url: '', is_published: true, sort_order: 0 })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('company_events').select('*, company_event_media(*)').order('sort_order')
    if (data) setEvents(data as CompanyEvent[])
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await supabase.from('company_events').update(form).eq('id', editing.id)
    } else {
      const { data } = await supabase.from('company_events').insert(form).select().single()
      if (data && mediaUrl) {
        await supabase.from('company_event_media').insert({ company_event_id: data.id, media_type: mediaType, url: mediaUrl, caption: mediaCaption || null })
      }
    }
    setShowForm(false); setEditing(null); setForm({ title: '', description: '', youtube_url: '', is_published: true, sort_order: 0 }); setMediaUrl(''); setMediaCaption('')
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this company event?')) return
    await supabase.from('company_events').delete().eq('id', id)
    load()
  }

  async function handleAddMedia(eventId: string) {
    if (!mediaUrl) return
    await supabase.from('company_event_media').insert({ company_event_id: eventId, media_type: mediaType, url: mediaUrl, caption: mediaCaption || null })
    setMediaUrl(''); setMediaCaption(''); load()
  }

  async function handleDeleteMedia(mediaId: string) {
    await supabase.from('company_event_media').delete().eq('id', mediaId)
    load()
  }

  const [uploadError, setUploadError] = useState('')

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
      load()
    }
  }

  function openEdit(event: CompanyEvent) {
    setForm({ title: event.title, description: event.description || '', youtube_url: event.youtube_url || '', is_published: event.is_published, sort_order: event.sort_order })
    setEditing(event); setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Company Events</h1>
          <p className="text-sm text-slate-500 mt-0.5">Distributor program events for the Join Us page.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: '', description: '', youtube_url: '', is_published: true, sort_order: 0 }); setMediaUrl(''); setShowForm(true) }}
          className="flex items-center gap-2 bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Event
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl p-8">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h2 className="text-base font-semibold text-slate-900 mb-6">{editing ? 'Edit Event' : 'New Company Event'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">YouTube URL</label>
                <input value={form.youtube_url} onChange={e => setForm({...form, youtube_url: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="rounded border-slate-300 text-jade-600 focus:ring-jade-500" />
                <span className="text-sm text-slate-600">Published</span>
              </label>
              {!editing && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">Media (optional)</label>
                  <div className="flex gap-2">
                    <select value={mediaType} onChange={e => setMediaType(e.target.value as any)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="youtube">YouTube</option>
                    </select>
                    <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" placeholder="URL" />
                  </div>
                  <input value={mediaCaption} onChange={e => setMediaCaption(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" placeholder="Caption (optional)" />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-6 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-slate-300 text-slate-600 rounded-lg px-6 py-2.5 text-xs font-semibold tracking-wider uppercase hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white h-16 animate-pulse rounded-xl border border-slate-200" />)}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200"><p className="text-sm text-slate-500">No company events yet.</p></div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {!event.is_published && <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider mb-1 block">Draft</span>}
                  <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(event)} className="p-2 text-slate-400 hover:text-jade-600 hover:bg-jade-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(event.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  {uploadError && (
                    <div className="flex-1 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{uploadError}</div>
                  )}
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Media ({event.company_event_media?.length || 0})</span>
                  <input
                    type="file" accept="image/*,video/*"
                    onChange={e => handleMediaUpload(e, event.id)}
                    className="hidden" id={`ce-upload-${event.id}`}
                  />
                  <label htmlFor={`ce-upload-${event.id}`} className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-jade-600 hover:bg-jade-50 rounded cursor-pointer">
                    <Upload className="w-3 h-3" /> Upload
                  </label>
                  <div className="flex gap-1">
                    <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="URL..." className="w-32 px-2 py-1 border border-slate-200 rounded text-[11px] outline-none focus:border-jade-500" />
                    <input value={mediaCaption} onChange={e => setMediaCaption(e.target.value)} placeholder="Caption..." className="w-24 px-2 py-1 border border-slate-200 rounded text-[11px] outline-none focus:border-jade-500" />
                    <button onClick={() => handleAddMedia(event.id)} disabled={!mediaUrl} className="px-2 py-1 bg-jade-600 text-white rounded text-[10px] font-semibold disabled:opacity-50">Add</button>
                  </div>
                </div>
                {event.company_event_media && event.company_event_media.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.company_event_media.map(m => (
                      <div key={m.id} className="relative group">
                        {m.media_type === 'image' ? (
                          <img src={m.url} alt="" className="h-16 w-16 object-cover rounded border border-slate-200" />
                        ) : (
                          <div className="h-16 w-16 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                            {m.media_type === 'youtube' ? 'YT' : 'Video'}
                          </div>
                        )}
                        <button onClick={() => handleDeleteMedia(m.id)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"><X className="w-2.5 h-2.5" /></button>
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
