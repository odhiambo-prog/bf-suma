import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TabGroup from '@/components/ui/TabGroup'
import SectionHeader from '@/components/ui/SectionHeader'
import EventCard from './EventCard'
import EventDetail from './EventDetail'
import { useEvents } from '@/hooks/useEvents'

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
      </div>

      <EventDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}
