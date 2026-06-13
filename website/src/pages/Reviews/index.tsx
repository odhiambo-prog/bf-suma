import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Calendar, ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ReviewCard from './ReviewCard'
import ReviewSubmitForm from './ReviewSubmitForm'
import { useReviews } from '@/hooks/useReviews'
import { SHOP_CONFIG } from '@/config/shop.config'

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 bg-gradient-to-br from-jade-700 to-jade-900 rounded-2xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cobalt-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <Calendar className="w-8 h-8 text-jade-200 mx-auto mb-5" strokeWidth={1.5} />
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-4">
              Ready to Transform Your Health?
            </h2>
            <p className="text-sm text-jade-100 max-w-lg mx-auto mb-8 leading-relaxed">
              Our wellness experts are here to guide you on your journey to optimal well-being. Book a personalized consultation today and take the first step toward a healthier you.
            </p>
            <a
              href={`https://wa.me/${SHOP_CONFIG.contact.whatsapp.replace('+', '')}?text=Hi, I'd like to book a wellness consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-jade-700 hover:bg-jade-50 px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all rounded-lg"
            >
              Book a Consultation <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && <ReviewSubmitForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
