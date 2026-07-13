import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import Badge from '@/components/ui/Badge'
import MediaCarousel from '@/components/ui/MediaCarousel'
import type { Event, EventStatus } from '@/types/event.types'

interface EventCardProps {
  title: string
  description: string
  event_date: string
  location_name: string
  status: EventStatus
  event_media: Event['event_media']
  onViewDetails?: () => void
}

const badgeVariant: Record<EventStatus, 'jade' | 'citrus' | 'amber'> = {
  upcoming: 'jade',
  ongoing: 'citrus',
  past: 'amber',
}

export default function EventCard({
  title,
  description,
  event_date,
  location_name,
  status,
  event_media,
  onViewDetails,
}: EventCardProps) {
  const reduce = useReducedMotion()
  const date = new Date(event_date)
  const day = format(date, 'dd')
  const month = format(date, 'MMM')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group rounded-3xl bg-surface-card shadow-float border border-surface-border/60 hover:border-jade-200 transition-colors flex flex-col"
    >
      {event_media && event_media.length > 0 && (
        <div className="border-b border-surface-border overflow-hidden rounded-t-3xl">
          <div className="group-hover:[&_img]:scale-105 [&_img]:transition-transform [&_img]:duration-700">
            <MediaCarousel media={event_media} variant="card" onItemClick={onViewDetails} />
          </div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-14 h-14 border border-surface-border flex flex-col items-center justify-center bg-surface-subtle rounded-xl">
            <span className="text-lg font-bold text-jade-700 font-mono leading-none">{day}</span>
            <span className="text-[9px] font-semibold text-muted-400 uppercase tracking-wider">{month}</span>
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant={badgeVariant[status]} label={status.charAt(0).toUpperCase() + status.slice(1)} />
            <h3 className="text-sm font-semibold text-ink mt-2 group-hover:text-jade-700 transition-colors line-clamp-1">
              {title}
            </h3>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-500">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{location_name}</span>
          </div>
        </div>

        <p className="text-xs text-muted-500 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="mt-auto text-[11px] font-semibold text-jade-600 flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-wider"
          >
            View Details <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
