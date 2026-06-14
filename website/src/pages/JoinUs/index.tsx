import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, BookOpen, Users, Award, Gift, HeartHandshake } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import MediaCarousel from '@/components/ui/MediaCarousel'
import { SHOP_CONFIG } from '@/config/shop.config'
import { useCompanyEvents } from '@/hooks/useCompanyEvents'
import type { EventMedia } from '@/types/event.types'
import type { CompanyEventMedia } from '@/types/join-us.types'

const benefits = [
  { icon: TrendingUp, title: 'Earn Commissions', desc: 'Competitive commission structure on every sale you make.' },
  { icon: BookOpen, title: 'Exclusive Training', desc: 'Access to comprehensive training materials and workshops.' },
  { icon: Users, title: 'Global Network', desc: 'Be part of an international community of health entrepreneurs.' },
  { icon: Award, title: 'Performance Bonuses', desc: 'Monthly and quarterly bonuses for top performers.' },
  { icon: Gift, title: 'Free Product Samples', desc: 'Receive complimentary product samples for personal use.' },
  { icon: HeartHandshake, title: 'Health Coaching', desc: 'Personal health coaching support from our experts.' },
]

const resources = [
  { title: 'Product Catalog', desc: 'Complete product catalog with descriptions and pricing.', link: '#' },
  { title: 'Training Materials', desc: 'Access our library of training videos and guides.', link: '#' },
  { title: 'WhatsApp Community', desc: 'Join our distributor WhatsApp group for support.', link: '#' },
  { title: 'Support Contact', desc: 'Get help from our distributor support team.', link: '#' },
]

export default function JoinUs() {
  const { data: companyEvents = [] } = useCompanyEvents()

  return (
    <div className="pt-28 min-h-screen bg-surface">
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-slate-900 mb-4 text-balance">
            Join the{' '}
            <span className="text-jade-600">Distributor</span>
            {' '}Network
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Turn your passion for health into a rewarding business opportunity.
          </p>
        </div>
      </section>

      <section>
        <img
          src="/images/start_business.png"
          alt="Start Your Business"
          className="w-full h-auto block"
        />
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <a
            href={SHOP_CONFIG.distributorProgram.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            Register Now <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Program Overview"
            subtitle="The Eagle Distributor Program is designed for entrepreneurs, health enthusiasts, and anyone seeking financial independence through wellness."
            align="left"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-12">
            <div className="space-y-4 text-sm text-slate-500 leading-relaxed">
              <p>BF SUMA's distributor program offers you the opportunity to build a thriving business while making a positive impact on people's health.</p>
              <p>As a distributor, you'll have access to premium products, comprehensive training, and a supportive community of like-minded entrepreneurs.</p>
              <ul className="space-y-3 mt-8">
                {['Entrepreneurs looking for a new opportunity', 'Health and wellness enthusiasts', 'Those seeking passive income streams', 'Network marketing professionals'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-jade-500 flex-shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-surface-border">
              <img src="/images/WhatsApp Image 2026-06-09 at 14.09.14 (3).jpeg" alt="Training Hub" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 bg-surface-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Benefits & Perks" subtitle="What you get when you join the Eagle Distributor Network." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="bg-white border border-surface-border p-8"
                >
                  <Icon className="w-8 h-8 text-jade-600 mb-6" strokeWidth={1.5} />
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {companyEvents.length > 0 && (
        <section className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader title="Our Success Stories" subtitle="Company events and gatherings that showcase the power of the BF SUMA community." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyEvents.map((event, i) => {
                const isLastOdd = companyEvents.length % 2 !== 0 && i === companyEvents.length - 1
                const media: EventMedia[] = (event.company_event_media || []).map((m: CompanyEventMedia) => ({
                  id: m.id,
                  event_id: event.id,
                  media_type: m.media_type,
                  url: m.url,
                  caption: m.caption,
                  sort_order: m.sort_order,
                }))
                if (event.youtube_url) {
                  media.push({
                    id: `${event.id}-youtube`,
                    event_id: event.id,
                    media_type: 'youtube',
                    url: event.youtube_url,
                    sort_order: media.length,
                  })
                }
                return (
                  <div key={event.id} className={`bg-white border border-surface-border overflow-hidden ${isLastOdd ? 'md:col-span-2' : ''}`}>
                    <MediaCarousel media={media} variant="card" className={isLastOdd ? 'max-h-[280px]' : ''} />
                    <div className="p-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">{event.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-3">{event.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-28 bg-surface-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Tools & Resources" subtitle="Everything you need to succeed as a distributor." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {resources.map((resource, i) => (
              <motion.a
                key={i}
                href={resource.link}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="bg-white border border-surface-border p-6 hover:border-jade-200 transition-colors"
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-xs text-slate-500">{resource.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <img
          src="/images/calltoaction.webp"
          alt=""
          className="w-full h-auto block"
        />
      </section>

      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-1/3 h-full bg-jade-600/5 -skew-x-12 -translate-x-1/2" />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center relative z-10">
          <h2 className="font-display text-4xl text-white mb-6 text-balance">
            Ready to Start Your Journey?
          </h2>
          <p className="text-sm text-slate-400 mb-10">
            Join hundreds of successful distributors and build your future with BF SUMA.
          </p>
          <a
            href={SHOP_CONFIG.distributorProgram.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-jade-600 hover:bg-jade-700 text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            Register Now <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  )
}
