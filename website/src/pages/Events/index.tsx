import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import TabGroup from '@/components/ui/TabGroup'
import SectionHeader from '@/components/ui/SectionHeader'
import EventCard from './EventCard'
import EventDetail from './EventDetail'
import { useEvents } from '@/hooks/useEvents'
import { SHOP_CONFIG } from '@/config/shop.config'

const tabs = ['All', 'Upcoming', 'Ongoing', 'Past']

export default function Events() {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const { data: events = [], isLoading } = useEvents(
    activeTab === 'All' ? undefined : (activeTab.toLowerCase() as any)
  )

  return (
    <div className="pt-28 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 pb-28">
        <SectionHeader
          title="Events & Workshops"
          subtitle="Join us for wellness events, training sessions, and community gatherings."
          eyebrow="Stay Connected"
        />

        <div className="mb-12 overflow-hidden rounded-lg">
          <img
            src="https://res.cloudinary.com/do35thu9z/image/upload/v1781341107/cover_kedobg.webp"
            alt="Events cover"
            className="w-full h-auto block"
          />
        </div>

        <div className="flex justify-center mb-12">
          <TabGroup
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-64 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {events.map(event => (
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
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-slate-500">No {activeTab.toLowerCase()} events at this time.</p>
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

      <EventDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}
