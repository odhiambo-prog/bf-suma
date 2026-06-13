import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Branch {
  id: string; name: string; address: string; maps_embed_url?: string
  maps_link?: string; phone?: string; email?: string; is_active: boolean; sort_order: number
}

export default function AdminBranches() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', maps_embed_url: '', maps_link: '', phone: '', email: '', is_active: true, sort_order: 0 })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('branches').select('*').order('sort_order')
    if (data) setBranches(data)
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await supabase.from('branches').update(form).eq('id', editing.id)
    } else {
      await supabase.from('branches').insert(form)
    }
    setShowForm(false); setEditing(null); setForm({ name: '', address: '', maps_embed_url: '', maps_link: '', phone: '', email: '', is_active: true, sort_order: 0 })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this branch?')) return
    await supabase.from('branches').delete().eq('id', id)
    load()
  }

  function openEdit(branch: Branch) {
    setForm({ name: branch.name, address: branch.address, maps_embed_url: branch.maps_embed_url || '', maps_link: branch.maps_link || '', phone: branch.phone || '', email: branch.email || '', is_active: branch.is_active, sort_order: branch.sort_order })
    setEditing(branch); setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Branches</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage shop locations and contact details.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', address: '', maps_embed_url: '', maps_link: '', phone: '', email: '', is_active: true, sort_order: 0 }); setShowForm(true) }}
          className="flex items-center gap-2 bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Branch
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl p-8">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h2 className="text-base font-semibold text-slate-900 mb-6">{editing ? 'Edit Branch' : 'New Branch'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Branch Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Address</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Google Maps Embed URL</label>
                  <input value={form.maps_embed_url} onChange={e => setForm({...form, maps_embed_url: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" placeholder="<iframe src=..." />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Maps Link</label>
                  <input value={form.maps_link} onChange={e => setForm({...form, maps_link: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded border-slate-300 text-jade-600 focus:ring-jade-500" />
                <span className="text-sm text-slate-600">Active</span>
              </label>
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
      ) : branches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200"><p className="text-sm text-slate-500">No branches yet.</p></div>
      ) : (
        <div className="space-y-3">
          {branches.map(branch => (
            <div key={branch.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-slate-900">{branch.name}</h3>
                  {!branch.is_active && <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Inactive</span>}
                </div>
                <p className="text-xs text-slate-500 truncate">{branch.address}</p>
                {(branch.phone || branch.email) && (
                  <p className="text-[11px] text-slate-400 mt-1">{branch.phone}{branch.phone && branch.email && ' · '}{branch.email}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(branch)} className="p-2 text-slate-400 hover:text-jade-600 hover:bg-jade-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(branch.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
