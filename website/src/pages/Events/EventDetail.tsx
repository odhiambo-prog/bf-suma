import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, ExternalLink, Clock } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { format } from 'date-fns'
import Badge from '@/components/ui/Badge'
import MediaCarousel from '@/components/ui/MediaCarousel'
import type { Event, EventStatus } from '@/types/event.types'

interface EventDetailProps {
  event: Event | null
  onClose: () => void
}

const badgeVariant: Record<EventStatus, 'jade' | 'citrus' | 'amber'> = {
  upcoming: 'jade',
  ongoing: 'citrus',
  past: 'amber',
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null

  const startDate = format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')
  const startTime = format(new Date(event.event_date), 'h:mm a') + ' EAT'

  const media = event.event_media && event.event_media.length > 0
    ? event.event_media
    : event.youtube_url
      ? [{ id: 'youtube-fallback', event_id: event.id, media_type: 'youtube' as const, url: event.youtube_url, thumbnail_url: undefined, caption: undefined, sort_order: 0 }]
      : []

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.event_date,
    ...(event.event_end_date ? { endDate: event.event_end_date } : {}),
    location: {
      '@type': 'Place',
      name: event.location_name,
      address: event.location_address || event.location_name,
    },
    organizer: { '@type': 'Organization', name: 'BF SUMA Eagle Shop' },
  }

  return (
    <AnimatePresence>
      {event && (
          <div className="fixed inset-0 z-modal flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <Helmet>
            <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>
          </Helmet>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-surface-card shadow-float-lg rounded-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-surface-card border border-surface-border flex items-center justify-center hover:bg-surface-subtle transition-colors rounded-full"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-muted-500" />
            </button>

            {media.length > 0 ? (
              <div className="border-b border-surface-border">
                <MediaCarousel media={media} variant="detail" />
              </div>
            ) : (
              <div className="h-48 bg-surface-subtle flex items-center justify-center border-b border-surface-border">
                <Calendar className="w-10 h-10 text-muted-300" strokeWidth={1} />
              </div>
            )}

            <div className="p-8 space-y-8">
              <div>
                <Badge variant={badgeVariant[event.status]} label={event.status.charAt(0).toUpperCase() + event.status.slice(1)} />
                <h2 className="font-display text-2xl text-ink mt-4">
                  {event.title}
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-muted-600">
                  <Calendar className="w-4 h-4 text-jade-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p>{startDate}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{startTime}</span>
                      {event.event_end_date && (
                        <span> — {format(new Date(event.event_end_date), 'h:mm a')} EAT</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-muted-600">
                  <MapPin className="w-4 h-4 text-jade-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-ink text-sm">{event.location_name}</p>
                    <p className="text-xs text-muted-500 mt-0.5">{event.location_address}</p>
                    {event.maps_link && (
                      <a
                        href={event.maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-jade-600 hover:underline uppercase tracking-wider"
                      >
                        Open in Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-surface-border pt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-700 mb-4">About This Event</h3>
                <p className="text-sm text-muted-500 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
