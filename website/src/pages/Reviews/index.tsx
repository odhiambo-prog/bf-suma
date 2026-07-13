import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Calendar, ArrowRight } from 'lucide-react'
import SectionIntro from '@/components/ui/SectionIntro'
import { Button } from '@/components/ui/Button'
import SEOHead from '@/components/seo/SEOHead'
import ReviewCard from './ReviewCard'
import ReviewSubmitForm from './ReviewSubmitForm'
import { useReviews } from '@/hooks/useReviews'
import { trackFormSubmit } from '@/hooks/useAnalytics'
import { useLeadForm } from '@/hooks/useLeadForm'

export default function Reviews() {
  const [showForm, setShowForm] = useState(false)
  const { data: reviews = [], isLoading } = useReviews()
  const { openLeadForm } = useLeadForm()

  const safeReviews = Array.isArray(reviews) ? reviews : []
  const avgRating = safeReviews.length
    ? (safeReviews.reduce((sum, r) => sum + r.rating, 0) / safeReviews.length)
    : 0

  const reviewSchemas = safeReviews.length > 0 ? [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'BF SUMA Eagle Shop',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: safeReviews.length,
        bestRating: '5',
        worstRating: '1',
      },
      review: safeReviews.map(r => ({
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: '5' },
        author: { '@type': 'Person', name: r.reviewer_name },
        reviewBody: r.testimonial,
        ...(r.product_used ? { itemReviewed: { '@type': 'Product', name: r.product_used } } : {}),
      })),
    },
  ] : []

  return (
    <div className="pt-28 min-h-screen bg-surface">
      <SEOHead
        title="Customer Reviews & Testimonials — BF SUMA Eagle Shop Nairobi"
        description="Read real reviews from BF SUMA customers who transformed their health. Share your own experience with our premium supplements and wellness services in Nairobi."
        jsonLd={reviewSchemas}
      />
      <div className="max-w-7xl mx-auto px-6 pb-28">
        <div className="mb-16">
          <SectionIntro
            title="What Our Customers Say"
            subtitle="Real reviews from real people who have transformed their health with BF SUMA."
          />
          <div className="flex justify-center mt-8">
            <Button
              variant="citrus"
              onClick={() => { setShowForm(true); trackFormSubmit('review-form') }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Share Your Experience
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface-subtle h-48 animate-pulse border border-surface-border rounded-3xl" />
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
            <p className="text-sm text-muted-500">No reviews yet. Be the first to share!</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 bg-gradient-to-br from-jade-700 to-ink rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-citrus-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-jade-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <Calendar className="w-8 h-8 text-jade-200 mx-auto mb-5" strokeWidth={1.5} />
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-4">
              Ready to Transform Your Health?
            </h2>
            <p className="text-sm text-jade-100 max-w-lg mx-auto mb-8 leading-relaxed">
              Our wellness experts are here to guide you on your journey to optimal well-being. Book a personalized consultation today and take the first step toward a healthier you.
            </p>
            <button
              onClick={() => openLeadForm('Wellness consultation')}
              className="inline-flex items-center gap-2 bg-white text-jade-700 hover:bg-jade-50 px-8 py-3.5 text-xs font-semibold transition-all rounded-full"
            >
              Book a Consultation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && <ReviewSubmitForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
