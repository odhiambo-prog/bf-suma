import { useState, useEffect } from 'react'
import { Plus, Trash2, Upload, X, GripVertical } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Slide {
  id: string; image_url: string; caption?: string; link_url?: string; sort_order: number; is_active: boolean
}

export default function AdminHeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [form, setForm] = useState({ image_urls: [] as string[], caption: '', link_url: '', is_active: true })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('hero_carousel').select('*').order('sort_order')
    if (data) setSlides(data)
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (form.image_urls.length === 0) return
    const nextOrder = slides.length
    const inserts = form.image_urls.map((url, i) => ({
      image_url: url,
      caption: form.caption,
      link_url: form.link_url,
      is_active: form.is_active,
      sort_order: nextOrder + i,
    }))
    await supabase.from('hero_carousel').insert(inserts)
    setShowForm(false); setForm({ image_urls: [], caption: '', link_url: '', is_active: true })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this slide?')) return
    await supabase.from('hero_carousel').delete().eq('id', id)
    load()
  }

  async function handleToggleActive(id: string, current: boolean) {
    await supabase.from('hero_carousel').update({ is_active: !current }).eq('id', id)
    load()
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    setUploadError('')

    const uploaded: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Uploading ${i + 1} of ${files.length}...`)
      const ext = file.name.split('.').pop()
      const filename = `hero-${Date.now()}-${i}.${ext}`
      const { error } = await supabase.storage.from('hero-carousel').upload(filename, file, { contentType: file.type })
      if (error) {
        console.error('Supabase upload error:', error)
        setUploadError(error.message || 'Upload failed. Make sure the storage bucket exists.')
      } else {
        const { data: { publicUrl } } = supabase.storage.from('hero-carousel').getPublicUrl(filename)
        uploaded.push(publicUrl)
      }
    }

    if (uploaded.length > 0) {
      setForm({ ...form, image_urls: [...form.image_urls, ...uploaded] })
    }
    setUploading(false)
    setUploadProgress('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Hero Carousel</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage homepage carousel slides.</p>
        </div>
        <button onClick={() => { setForm({ image_urls: [], caption: '', link_url: '', is_active: true }); setShowForm(true) }}
          className="flex items-center gap-2 bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h2 className="text-base font-semibold text-slate-900 mb-6">New Slide</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Images {form.image_urls.length > 0 && <span className="text-jade-600">({form.image_urls.length} selected)</span>}
                </label>
                {form.image_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.image_urls.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="h-20 w-28 object-cover rounded-lg border border-slate-200" />
                        <button type="button" onClick={() => setForm({...form, image_urls: form.image_urls.filter((_, j) => j !== i)})}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {uploadError && (
                  <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">{uploadError}</p>
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-jade-400 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    {uploading ? uploadProgress || 'Uploading...' : form.image_urls.length > 0 ? 'Add more images' : 'Click to upload images'}
                  </span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Caption (optional)</label>
                <input value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Link URL (optional)</label>
                <input value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded border-slate-300 text-jade-600 focus:ring-jade-500" />
                <span className="text-sm text-slate-600">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={form.image_urls.length === 0} className="bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-6 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-50">
                  {form.image_urls.length > 1 ? `Add ${form.image_urls.length} Slides` : 'Add Slide'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-slate-300 text-slate-600 rounded-lg px-6 py-2.5 text-xs font-semibold tracking-wider uppercase hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white h-24 animate-pulse rounded-xl border border-slate-200" />)}</div>
      ) : slides.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200"><p className="text-sm text-slate-500">No slides yet. Add your first hero image.</p></div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, i) => (
            <div key={slide.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="flex-shrink-0 text-slate-300 cursor-grab"><GripVertical className="w-4 h-4" /></div>
              <img src={slide.image_url} alt={slide.caption || ''} className="w-20 h-14 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-mono">Slide {i + 1}</p>
                <p className="text-sm font-medium text-slate-900 truncate">{slide.caption || 'No caption'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => handleToggleActive(slide.id, slide.is_active)}
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      slide.is_active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {slide.is_active ? 'Active' : 'Inactive'}
                  </button>
                  {slide.link_url && <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{slide.link_url}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(slide.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
