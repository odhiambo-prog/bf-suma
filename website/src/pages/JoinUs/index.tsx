import { ArrowRight } from 'lucide-react'
import SectionIntro from '@/components/ui/SectionIntro'
import { buttonVariants } from '@/components/ui/Button'
import Reveal, { FloatingSurface } from '@/components/ui/Reveal'
import SEOHead from '@/components/seo/SEOHead'
import MediaCarousel from '@/components/ui/MediaCarousel'
import YouTubeEmbed from '@/components/ui/YouTubeEmbed'
import { trackCTAClick } from '@/hooks/useAnalytics'
import { SHOP_CONFIG } from '@/config/shop.config'
import { useCompanyEvents } from '@/hooks/useCompanyEvents'
import type { EventMedia } from '@/types/event.types'
import type { CompanyEventMedia } from '@/types/join-us.types'
import { cn } from '@/lib/utils'

const benefits = [
  { image: '/images/benefits/commission.jpg', title: 'Earn Commissions', desc: 'Competitive commission structure on every sale you make.' },
  { image: '/images/benefits/exclusive-training.jpg', title: 'Exclusive Training', desc: 'Access to comprehensive training materials and workshops.' },
  { image: '/images/benefits/global-network.jpg', title: 'Global Network', desc: 'Be part of an international community of health entrepreneurs.' },
  { image: '/images/benefits/performance-bonuses.jpg', title: 'Performance Bonuses', desc: 'Monthly and quarterly bonuses for top performers.' },
  { image: '/images/benefits/free-sample.png', title: 'Free Product Samples', desc: 'Receive complimentary product samples for personal use.' },
  { image: '/images/benefits/health-coaching.jpeg', title: 'Health Coaching', desc: 'Personal health coaching support from our experts.' },
]

const accents = ['jade', 'citrus'] as const

export default function JoinUs() {
  const { data: companyEvents = [] } = useCompanyEvents()

  return (
      <div className="min-h-screen bg-surface">
      <SEOHead
        title="Become a BF SUMA Distributor — Eagle Distributor Program Nairobi"
        description="Join the BF SUMA Eagle Distributor Network and turn your passion for health into a rewarding business. Earn commissions, get exclusive training, and be part of a global community."
      />

      <section className="relative pt-28 md:pt-32 pb-10 md:pb-12 bg-gradient-to-br from-jade-700 via-jade-800 to-ink overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-citrus-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-jade-500/20 blur-3xl pointer-events-none" />
        <div className="max-w-xl mx-auto px-6 text-center relative z-10">
          <h1 className="font-display text-3xl md:text-4xl text-white mb-4 text-balance">
            Join the{' '}
            <span className="text-citrus-300">Distributor</span>
            {' '}Network
          </h1>
          <p className="text-sm text-jade-100 max-w-lg mx-auto">
            Turn your passion for health into a rewarding business opportunity.
          </p>
        </div>
      </section>

      <section className="pt-0 pb-8 md:pb-12 bg-surface">
        <img
          src="/images/start_business.png"
          alt="Start Your Business"
          className="w-full h-auto block"
          loading="lazy"
        />
      </section>

      <section className="py-8 bg-surface">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <a
            href={SHOP_CONFIG.distributorProgram.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('register-now-top')}
            className={buttonVariants({ variant: 'citrus' })}
          >
            Register Now <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-surface via-white to-jade-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <SectionIntro
            title="Program Overview"
            subtitle="The Eagle Distributor Program is designed for entrepreneurs, health enthusiasts, and anyone seeking financial independence through wellness."
            align="center"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
            <div className="space-y-4 text-sm text-muted-500 leading-relaxed">
              <p>BF SUMA's distributor program offers you the opportunity to build a thriving business while making a positive impact on people's health.</p>
              <p>As a distributor, you'll have access to premium products, comprehensive training, and a supportive community of like-minded entrepreneurs.</p>
              <p className="text-xs font-semibold text-muted-700 mt-8 mb-3 uppercase tracking-wider">Who is this for?</p>
              <ul className="space-y-3">
                {['Entrepreneurs looking for a new opportunity', 'Health and wellness enthusiasts', 'Those seeking passive income streams', 'Network marketing professionals'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-muted-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-jade-500 flex-shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <FloatingSurface lift className="rounded-3xl overflow-hidden">
              <YouTubeEmbed url="https://www.youtube.com/watch?v=A-KwlHViiCw" title="Program Overview" />
            </FloatingSurface>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <SectionIntro title="Benefits & Perks" subtitle="What you get when you join the Eagle Distributor Network." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, i) => (
              <Reveal key={i} delay={(i % 3) * 0.05}>
                <FloatingSurface lift className="group overflow-hidden flex flex-col h-full hover:shadow-glow-citrus transition-shadow duration-500">
                  <div className="relative h-52 overflow-hidden bg-surface-subtle">
                    <div
                      className="absolute inset-0 scale-110 blur-2xl bg-center bg-cover transition-transform duration-700 group-hover:scale-125"
                      style={{ backgroundImage: `url(${benefit.image})` }}
                    />
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="relative z-10 w-full h-full object-contain p-4"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.28),transparent_70%)]" />
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-sm font-semibold text-ink mb-2">{benefit.title}</h3>
                    <p className="text-xs text-muted-500 leading-relaxed">{benefit.desc}</p>
                  </div>
                </FloatingSurface>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {companyEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <SectionIntro title="Our Success Stories" subtitle="Company events and gatherings that showcase the power of the BF SUMA community." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
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
                const accent = accents[i % accents.length]
                return (
                  <Reveal key={event.id} className={cn(isLastOdd && 'md:col-span-2')}>
                    <FloatingSurface
                      lift
                      className={cn(
                        'group overflow-hidden flex flex-col h-full',
                        accent === 'jade' ? 'ring-1 ring-jade-200' : 'ring-1 ring-citrus-200'
                      )}
                    >
                      <MediaCarousel
                        media={media}
                        variant="card"
                        className="w-full"
                      />
                      <div className="p-6 flex-1">
                        <h4 className="text-sm font-semibold text-ink mb-2">{event.title}</h4>
                        <p className="text-xs text-muted-500 line-clamp-3">{event.description}</p>
                      </div>
                    </FloatingSurface>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-surface-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <SectionIntro title="Tools You Need" subtitle="Everything you need to succeed as a distributor." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-12">
            <FloatingSurface lift className="rounded-3xl overflow-hidden">
              <YouTubeEmbed url="https://www.youtube.com/watch?v=8ZDFHreU4bQ" title="Tools You Need" />
            </FloatingSurface>
            <div className="space-y-4 text-sm text-muted-500 leading-relaxed">
              <p>To start your business and aim for success, you would need to find the right market and products, acquire the necessary skills, and have an excellent platform and efficient system support. BF Suma has it all prepared for you.</p>
              <p>With more people becoming aware of its benefits, the health product industry is growing daily. BF Suma equips superb quality health supplements with a strong R&amp;D.</p>
              <p>By becoming a BF Suma Distributor, you may enter different training courses locally or overseas to develop the skills you need to be a thriving business owner. From the necessary sales &amp; marketing plans to business planning, leadership, presentation skills, team building, event organization techniques, and more.</p>
              <p>We're a big family, and we've always got your back! You have support from your network, the local office, training, R&amp;D, quality assurance teams, and cutting-edge back-end IT systems for your company's development.</p>
              <a
                href="/distributor-agreement.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-jade-600 hover:text-jade-700 text-xs font-semibold transition-all mt-4"
              >
                Read Distributor Agreement →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <img
          src="/images/calltoaction.webp"
          alt="Join BF SUMA Eagle Distributor Program"
          className="w-full h-auto block"
          loading="lazy"
        />
      </section>

      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-1/3 h-full bg-jade-600/5 -skew-x-12 -translate-x-1/2" />
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-citrus-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center relative z-10">
          <h2 className="font-display text-4xl text-white mb-6 text-balance">
            Ready to Start Your Journey?
          </h2>
          <p className="text-sm text-jade-100 mb-10">
            Join hundreds of successful distributors and build your future with BF SUMA.
          </p>
          <a
            href={SHOP_CONFIG.distributorProgram.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('register-now-bottom')}
            className="inline-flex items-center gap-2 bg-jade-600 hover:bg-jade-700 text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            Register Now <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  )
}
