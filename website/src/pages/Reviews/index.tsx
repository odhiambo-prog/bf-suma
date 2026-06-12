import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ReviewCard from './ReviewCard'
import ReviewSubmitForm from './ReviewSubmitForm'
import { useReviews } from '@/hooks/useReviews'

export default function Reviews() {
  const [showForm, setShowForm] = useState(false)
  const { data: reviews = [], isLoading } = useReviews()

  return (
    <div className="pt-28 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 pb-28">
        <div className="mb-16">
          <SectionHeader
            title="What Our Customers Say"
            subtitle="Real reviews from real people who have transformed their health with BF SUMA."
            eyebrow="Testimonials"
            align="center"
          />
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-5 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Share Your Experience
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface-subtle h-48 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {reviews.map(review => (
                <ReviewCard key={review.id} {...review} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-slate-500">No reviews yet. Be the first to share!</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && <ReviewSubmitForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
