import { useState } from 'react'
import { CheckCircle2, Clock, MessageSquare } from 'lucide-react'
import { useLeads, useUpdateLeadStatus } from '@/hooks/useLeads'
import type { Lead } from '@/hooks/useLeads'

export default function AdminLeads() {
  const { data: leads = [], isLoading } = useLeads()
  const updateStatus = useUpdateLeadStatus()
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted'>('all')

  const safeLeads = Array.isArray(leads) ? leads : []
  const filtered = filter === 'all' ? safeLeads : safeLeads.filter(l => l.status === filter)
  const newCount = safeLeads.filter(l => l.status === 'new').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {newCount > 0 ? (
              <span className="text-jade-600 font-semibold">{newCount} new</span>
            ) : 'All'} lead{newCount !== 1 ? 's' : ''} from website visitors.
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'contacted'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                filter === f
                  ? 'bg-jade-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f} {f === 'new' ? `(${newCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white h-16 animate-pulse rounded-xl border border-slate-200" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-4" strokeWidth={1} />
          <p className="text-sm text-slate-500">No leads yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Phone</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Message</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((lead: Lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">{lead.name}</td>
                    <td className="px-5 py-4">
                      <a href={`tel:${lead.phone}`} className="text-sm text-slate-600 hover:text-jade-600 transition-colors font-mono">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{lead.location}</td>
                    <td className="px-5 py-4 text-sm text-slate-500 max-w-[200px] truncate">{lead.message || '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5 w-fit">
                        <button
                          onClick={() => lead.status !== 'new' && updateStatus.mutate({ id: lead.id, status: 'new' })}
                          disabled={updateStatus.isPending}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${
                            lead.status === 'new'
                              ? 'bg-amber-50 text-amber-700 shadow-sm'
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          New
                        </button>
                        <button
                          onClick={() => lead.status !== 'contacted' && updateStatus.mutate({ id: lead.id, status: 'contacted' })}
                          disabled={updateStatus.isPending}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${
                            lead.status === 'contacted'
                              ? 'bg-green-50 text-green-700 shadow-sm'
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Contacted
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
