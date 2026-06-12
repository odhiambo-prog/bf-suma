import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, TrendingUp, BookOpen, Users, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import ProductsSection from '@/pages/Products'
import SectionHeader from '@/components/ui/SectionHeader'
import Accordion from '@/components/ui/Accordion'
import Badge from '@/components/ui/Badge'
import { useEvents } from '@/hooks/useEvents'
import { useReviews } from '@/hooks/useReviews'
import { useFAQ } from '@/hooks/useFAQ'

const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

function EventsPreview() {
  const { data: events = [], isLoading } = useEvents()
  const safeEvents = Array.isArray(events) ? events : []
  const preview = safeEvents.slice(0, 3)

  return (
    <section className="py-28 bg-surface-subtle" id="events-preview">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Events & Workshops"
          subtitle="Join us for wellness events, training sessions, and community gatherings."
          eyebrow="Stay Connected"
        />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-64 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {preview.map(event => (
              <motion.div
                key={event.id}
                variants={fadeUp}
                className="bg-white border border-surface-border hover:border-jade-200 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-14 h-14 border border-surface-border flex flex-col items-center justify-center bg-surface-subtle">
                      <span className="text-lg font-bold text-jade-700 font-mono leading-none">
                        {new Date(event.event_date).getDate().toString().padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                        {new Date(event.event_date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge
                        variant={event.status === 'upcoming' ? 'blue' : event.status === 'ongoing' ? 'green' : 'gray'}
                        label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      />
                      <h3 className="text-sm font-semibold text-slate-900 mt-3 line-clamp-1">{event.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{event.location_name}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        <div className="text-center mt-12">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            View All Events <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ReviewsPreview() {
  const { data: reviews = [], isLoading } = useReviews()
  const safeReviews = Array.isArray(reviews) ? reviews : []
  const preview = safeReviews.slice(0, 3)

  return (
    <section className="py-28 bg-white" id="reviews-preview">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Real reviews from real people who have transformed their health with BF SUMA."
          eyebrow="Testimonials"
        />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface-subtle h-48 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {preview.map(review => {
              const initials = review.reviewer_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
              return (
                <motion.div
                  key={review.id}
                  variants={fadeUp}
                  className="border border-surface-border bg-white p-6"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-jade-50 flex items-center justify-center text-jade-700 font-bold text-xs font-mono">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{review.reviewer_name}</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">{review.testimonial}</p>
                  {review.product_used && (
                    <p className="text-[10px] text-slate-400 mt-4 pt-4 border-t border-surface-border">
                      Product: <span className="font-medium text-slate-600">{review.product_used}</span>
                    </p>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
        <div className="text-center mt-12">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            View All Reviews <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function FAQPreview() {
  const { data: faqs = [], isLoading } = useFAQ()
  const safeFaqs = Array.isArray(faqs) ? faqs : []
  const preview = safeFaqs.slice(0, 5)
  const items = preview.map(f => ({ question: f.question, answer: f.answer }))

  return (
    <section className="py-28 bg-surface-subtle" id="faq-preview">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Quick answers to common questions about our products and services."
          eyebrow="Got Questions?"
        />
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white h-14 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <Accordion items={items} />
        )}
        <div className="text-center mt-12">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            View All FAQs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const previewBenefits = [
  { icon: TrendingUp, title: 'Earn Commissions', desc: 'Competitive commission structure on every sale you make.' },
  { icon: BookOpen, title: 'Exclusive Training', desc: 'Access to comprehensive training materials and workshops.' },
  { icon: Users, title: 'Global Network', desc: 'Be part of an international community of health entrepreneurs.' },
]

function JoinUsPreview() {
  return (
    <section className="py-28 bg-white" id="join-preview">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Become a Distributor"
          subtitle="Turn your passion for health into a rewarding business opportunity."
          eyebrow="Join the Network"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {previewBenefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="border border-surface-border bg-white p-8"
              >
                <Icon className="w-8 h-8 text-jade-600 mb-6" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
        <div className="text-center">
          <Link
            to="/join-us"
            className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            Explore the Program <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductsSection preview />
      <EventsPreview />
      <ReviewsPreview />
      <FAQPreview />
      <JoinUsPreview />
    </>
  )
}
