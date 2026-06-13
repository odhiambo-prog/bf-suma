import { useState, useEffect } from 'react'
import { Check, X, Trash2, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Review {
  id: string; reviewer_name: string; testimonial: string; product_used?: string
  rating: number; photo_url?: string; is_approved: boolean; created_at: string
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (data) setReviews(data)
    setLoading(false)
  }

  async function toggleApproval(id: string, current: boolean) {
    await supabase.from('reviews').update({ is_approved: !current }).eq('id', id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return
    await supabase.from('reviews').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Reviews</h1>
        <p className="text-sm text-slate-500 mt-0.5">Approve or reject customer reviews.</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white h-24 animate-pulse rounded-xl border border-slate-200" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200"><p className="text-sm text-slate-500">No reviews yet.</p></div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {review.photo_url ? (
                      <img src={review.photo_url} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 bg-jade-50 rounded-full flex items-center justify-center text-xs font-bold text-jade-700">
                        {review.reviewer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{review.reviewer_name}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <span className={`ml-auto inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
                      review.is_approved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3">{review.testimonial}</p>
                  {review.product_used && (
                    <p className="text-xs text-slate-400 mt-2">Product: <span className="font-medium text-slate-600">{review.product_used}</span></p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleApproval(review.id, review.is_approved)}
                    className={`p-2 rounded-lg transition-colors ${review.is_approved ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}>
                    {review.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
