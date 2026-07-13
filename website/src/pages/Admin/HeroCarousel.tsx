import { useState, useEffect } from 'react'
import { Plus, Trash2, Upload, X, Eye, EyeOff, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { toast } from '@/components/admin/ui/Toaster'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { SlideOver } from '@/components/admin/ui/SlideOver'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Field, Input, Switch } from '@/components/admin/ui/FormField'
import { EmptyState } from '@/components/admin/ui/EmptyState'

interface Slide {
  id: string; image_url: string; caption?: string; link_url?: string; sort_order: number; is_active: boolean
}

const emptyForm = { image_urls: [] as string[], caption: '', link_url: '', is_active: true }

export default function AdminHeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    const { data } = await supabase.from('hero_carousel').select('*').order('sort_order')
    if (data) setSlides(data as Slide[])
    setLoading(false)
  }

  function openNew() {
    setForm({ ...emptyForm })
    setUploadError('')
    setOpen(true)
  }

  async function handleSave(e?: { preventDefault: () => void }) {
    e?.preventDefault()
    if (form.image_urls.length === 0) return
    setSaving(true)
    const nextOrder = slides.length
    const inserts = form.image_urls.map((url, i) => ({
      image_url: url,
      caption: form.caption,
      link_url: form.link_url,
      is_active: form.is_active,
      sort_order: nextOrder + i,
    }))
    await supabase.from('hero_carousel').insert(inserts)
    setSaving(false)
    setOpen(false)
    setForm({ ...emptyForm })
    toast.success(form.image_urls.length > 1 ? `${form.image_urls.length} slides added` : 'Slide added')
    refresh()
  }

  async function move(idx: number, dir: -1 | 1) {
    const target = idx + dir
    if (target < 0 || target >= slides.length) return
    const a = slides[idx]
    const b = slides[target]
    await supabase.from('hero_carousel').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('hero_carousel').update({ sort_order: a.sort_order }).eq('id', b.id)
    refresh()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await supabase.from('hero_carousel').delete().eq('id', deleteId)
    setDeleteId(null)
    toast.success('Slide deleted')
    refresh()
  }

  async function handleToggleActive(id: string, current: boolean) {
    await supabase.from('hero_carousel').update({ is_active: !current }).eq('id', id)
    toast.success(!current ? 'Slide activated' : 'Slide deactivated')
    refresh()
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

  const columns: Column<Slide>[] = [
    {
      key: 'image_url',
      header: 'Preview',
      render: row => <img src={row.image_url} alt={row.caption || ''} className="h-12 w-20 object-cover rounded-lg border border-surface-border" />,
    },
    {
      key: 'caption',
      header: 'Caption',
      render: row => <span className="text-muted-600">{row.caption || '—'}</span>,
    },
    {
      key: 'link_url',
      header: 'Link',
      render: row => <span className="text-muted-400 text-xs truncate max-w-[160px] block">{row.link_url || '—'}</span>,
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
          <h1 className="text-xl font-semibold text-ink font-display">Hero Carousel</h1>
          <p className="text-sm text-muted-600 mt-0.5">Manage homepage carousel slides.</p>
        </div>
        <Button onClick={openNew} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={slides}
        rowKey={row => row.id}
        loading={loading}
        empty={
          <EmptyState
            icon={<ImageIcon className="w-5 h-5" />}
            title="No slides yet"
            description="Add your first hero image for the homepage carousel."
            action={<Button onClick={openNew} variant="primary" size="sm"><Plus className="w-3.5 h-3.5" /> Add Slide</Button>}
          />
        }
        actions={row => {
          const idx = slides.findIndex(s => s.id === row.id)
          return (
            <>
              <button onClick={() => move(idx, -1)} aria-label="Move up" disabled={idx === 0} className="p-2 rounded-lg text-muted-400 hover:text-jade-600 hover:bg-jade-50 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button onClick={() => move(idx, 1)} aria-label="Move down" disabled={idx === slides.length - 1} className="p-2 rounded-lg text-muted-400 hover:text-jade-600 hover:bg-jade-50 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button onClick={() => handleToggleActive(row.id, row.is_active)} aria-label={row.is_active ? 'Deactivate' : 'Activate'} className="p-2 rounded-lg text-muted-400 hover:text-citrus-600 hover:bg-citrus-50 transition-colors">
                {row.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => setDeleteId(row.id)} aria-label="Delete" className="p-2 rounded-lg text-muted-400 hover:text-danger-600 hover:bg-danger-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )
        }}
      />

      <SlideOver
        open={open}
        onClose={() => { setOpen(false); setForm({ ...emptyForm }) }}
        title="New Slide"
        description="Upload one or more hero images."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => { setOpen(false); setForm({ ...emptyForm }) }}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving || form.image_urls.length === 0}>
              {saving ? 'Saving...' : form.image_urls.length > 1 ? `Add ${form.image_urls.length} Slides` : 'Add Slide'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Images" hint={form.image_urls.length > 0 ? `${form.image_urls.length} selected` : undefined}>
            {form.image_urls.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.image_urls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="h-20 w-28 object-cover rounded-lg border border-surface-border" />
                    <button type="button" onClick={() => setForm({ ...form, image_urls: form.image_urls.filter((_, j) => j !== i) })}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-danger-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {uploadError && (
              <p className="text-[11px] text-danger-700 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2 mb-3">{uploadError}</p>
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-muted-300 rounded-xl cursor-pointer hover:border-jade-400 transition-colors">
              <Upload className="w-5 h-5 text-muted-400" />
              <span className="text-sm text-muted-600">
                {uploading ? uploadProgress || 'Uploading...' : form.image_urls.length > 0 ? 'Add more images' : 'Click to upload images'}
              </span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </Field>
          <Field label="Caption (optional)" htmlFor="caption">
            <Input id="caption" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} />
          </Field>
          <Field label="Link URL (optional)" htmlFor="link_url">
            <Input id="link_url" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} />
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
        title="Delete slide?"
        description="This permanently removes the slide from the carousel. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
