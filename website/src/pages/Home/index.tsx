import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import ProductsSection from '@/pages/Products'
import SectionHeader from '@/components/ui/SectionHeader'
import Accordion from '@/components/ui/Accordion'
import EventCard from '@/pages/Events/EventCard'
import EventDetail from '@/pages/Events/EventDetail'
import { useEvents } from '@/hooks/useEvents'
import { useReviews } from '@/hooks/useReviews'
import { useFAQ } from '@/hooks/useFAQ'
import { SHOP_CONFIG } from '@/config/shop.config'

const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

function EventsPreview() {
  const { data: events = [], isLoading } = useEvents()
  const safeEvents = Array.isArray(events) ? events : []
  const preview = safeEvents.slice(0, 3)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

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
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {preview.map(event => (
              <EventCard
                key={event.id}
                title={event.title}
                description={event.description}
                event_date={event.event_date}
                location_name={event.location_name}
                status={event.status}
                event_media={event.event_media || []}
                onViewDetails={() => setSelectedEvent(event)}
              />
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

      <EventDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  )
}

function ReviewsPreview() {
  const { data: reviews = [], isLoading } = useReviews()
  const safeReviews = Array.isArray(reviews) ? reviews : []
  const preview = safeReviews.slice(0, 8)
  const x = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      setContentWidth(containerRef.current.scrollWidth / 2)
    }
  }, [preview])

  useAnimationFrame(() => {
    if (isHovering || !contentWidth) return
    const current = x.get()
    if (current <= -contentWidth) {
      x.set(0)
    } else {
      x.set(current - 0.35)
    }
  })

  const starRow = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
        />
      ))}
    </div>
  )

  const card = (review: any) => (
    <div
      key={review.id}
      className="w-[340px] shrink-0 border border-surface-border bg-white p-6 select-none"
    >
      <div className="flex items-center gap-4 mb-5">
        {review.photo_url ? (
          <img src={review.photo_url} alt={review.reviewer_name} className="w-12 h-12 object-cover border border-surface-border shrink-0" />
        ) : (
          <div className="w-12 h-12 bg-jade-50 flex items-center justify-center text-jade-700 font-bold text-xs font-mono shrink-0">
            {review.reviewer_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{review.reviewer_name}</p>
          <div className="mt-1">{starRow(review.rating)}</div>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">{review.testimonial}</p>
      {review.product_used && (
        <p className="text-[10px] text-slate-400 mt-4 pt-4 border-t border-surface-border">
          Product: <span className="font-medium text-slate-600 truncate">{review.product_used}</span>
        </p>
      )}
    </div>
  )

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
          <div
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <motion.div
              drag="x"
              dragElastic={0.05}
              dragConstraints={{ left: -(contentWidth || 0), right: 0 }}
              style={{ x }}
              onDragStart={() => setIsHovering(true)}
              onDragEnd={() => setIsHovering(false)}
              className="flex gap-6 w-max"
            >
              {[...preview, ...preview].map((review, i) => (
                <div key={`${review.id}-${i}`}>{card(review)}</div>
              ))}
            </motion.div>
          </div>
        )}
        <div className="text-center mt-12">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            View All Reviews <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="text-center mt-8">
          <a
            href={`https://wa.me/${SHOP_CONFIG.contact.whatsapp.replace('+', '')}?text=Hi, I'd like to book a wellness consultation.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-jade-600 hover:bg-jade-700 text-white px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            Book a Consultation <ArrowRight className="w-3.5 h-3.5" />
          </a>
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
  { image: '/images/benefits/commission.jpg', title: 'Earn Commissions', desc: 'Competitive commission structure on every sale you make.' },
  { image: '/images/benefits/exclusive-training.jpg', title: 'Exclusive Training', desc: 'Access to comprehensive training materials and workshops.' },
  { image: '/images/benefits/global-network.jpg', title: 'Global Network', desc: 'Be part of an international community of health entrepreneurs.' },
  { image: '/images/benefits/performance-bonuses.jpg', title: 'Performance Bonuses', desc: 'Monthly and quarterly bonuses for top performers.' },
  { image: '/images/benefits/free-sample.png', title: 'Free Product Samples', desc: 'Receive complimentary product samples for personal use.' },
  { image: '/images/benefits/health-coaching.jpeg', title: 'Health Coaching', desc: 'Personal health coaching support from our experts.' },
]

function JoinUsPreview() {
  return (
    <section className="py-28 bg-surface-subtle" id="join-preview">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Become a Distributor"
          subtitle="Turn your passion for health into a rewarding business opportunity."
          eyebrow="Join the Network"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {previewBenefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="bg-white border border-surface-border overflow-hidden flex flex-col"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <div
                  className="absolute inset-0 scale-150 blur-2xl bg-center bg-cover"
                  style={{ backgroundImage: `url(${benefit.image})` }}
                />
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className="relative z-10 w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/join-us"
            className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            Join Us <ArrowRight className="w-3.5 h-3.5" />
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
