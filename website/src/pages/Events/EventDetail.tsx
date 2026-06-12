import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, ExternalLink, Clock } from 'lucide-react'
import { format } from 'date-fns'
import Badge from '@/components/ui/Badge'
import YouTubeEmbed from '@/components/ui/YouTubeEmbed'
import type { EventStatus } from '@/types/event.types'

interface EventDetailProps {
  event: {
    title: string
    description: string
    event_date: string
    event_end_date?: string
    location_name: string
    location_address: string
    maps_link?: string
    status: EventStatus
    youtube_url?: string
    event_media: { media_type: string; url: string }[]
  } | null
  onClose: () => void
}

const badgeVariant = {
  upcoming: 'blue' as const,
  ongoing: 'green' as const,
  past: 'gray' as const,
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null

  const startDate = format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')
  const startTime = format(new Date(event.event_date), 'h:mm a')

  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white border border-surface-border flex items-center justify-center hover:bg-surface-subtle transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            {event.youtube_url ? (
              <div className="w-full border-b border-surface-border">
                <YouTubeEmbed url={event.youtube_url} title={event.title} />
              </div>
            ) : (
              <div className="h-48 bg-surface-subtle flex items-center justify-center border-b border-surface-border">
                <Calendar className="w-10 h-10 text-slate-300" strokeWidth={1} />
              </div>
            )}

            <div className="p-8 space-y-8">
              <div>
                <Badge variant={badgeVariant[event.status]} label={event.status.charAt(0).toUpperCase() + event.status.slice(1)} />
                <h2 className="font-display text-2xl text-slate-900 mt-4">
                  {event.title}
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-slate-600">
                  <Calendar className="w-4 h-4 text-jade-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p>{startDate}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{startTime}</span>
                      {event.event_end_date && (
                        <span> — {format(new Date(event.event_end_date), 'h:mm a')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-4 h-4 text-jade-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{event.location_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{event.location_address}</p>
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mb-4">About This Event</h3>
                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
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
