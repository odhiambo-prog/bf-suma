import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/admin/ImageUpload'

interface TeamMember {
  id: string; name: string; photo_url?: string; sort_order: number; is_active: boolean
}

export default function AdminTeam() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', photo_url: '', sort_order: 0, is_active: true })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('team_members').select('*').order('sort_order')
    if (data) setItems(data as TeamMember[])
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await supabase.from('team_members').update(form).eq('id', editing.id)
    } else {
      await supabase.from('team_members').insert(form)
    }
    setShowForm(false); setEditing(null)
    setForm({ name: '', photo_url: '', sort_order: 0, is_active: true })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this team member?')) return
    await supabase.from('team_members').delete().eq('id', id)
    load()
  }

  function openEdit(item: TeamMember) {
    setForm({ name: item.name, photo_url: item.photo_url || '', sort_order: item.sort_order, is_active: item.is_active })
    setEditing(item)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Team</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage team members.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', photo_url: '', sort_order: 0, is_active: true }); setShowForm(true) }}
          className="flex items-center gap-2 bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Member
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl p-8">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-slate-900 mb-6">{editing ? 'Edit Member' : 'New Member'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Photo</label>
                <ImageUpload
                  key={editing?.id || 'new'}
                  bucket="team-photos"
                  initialUrl={editing?.photo_url}
                  onUpload={(url) => setForm({...form, photo_url: url})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-jade-500 outline-none" />
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
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200"><p className="text-sm text-slate-500">No team members yet.</p></div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-jade-400 to-cobalt-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <span className="text-sm font-bold text-white">{item.name.charAt(0)}</span>
                  {item.photo_url && (
                    <img
                      src={item.photo_url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                  {!item.is_active && <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Inactive</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-jade-600 hover:bg-jade-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
