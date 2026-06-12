import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import Badge from '@/components/ui/Badge'
import type { EventStatus } from '@/types/event.types'

interface EventCardProps {
  title: string
  description: string
  event_date: string
  location_name: string
  status: EventStatus
  onViewDetails: () => void
}

const badgeVariant = {
  upcoming: 'blue' as const,
  ongoing: 'green' as const,
  past: 'gray' as const,
}

export default function EventCard({
  title,
  description,
  event_date,
  location_name,
  status,
  onViewDetails,
}: EventCardProps) {
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
      className="bg-white border border-surface-border hover:border-jade-200 transition-colors group"
    >
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 border border-surface-border flex flex-col items-center justify-center bg-surface-subtle">
            <span className="text-lg font-bold text-jade-700 font-mono leading-none">{day}</span>
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">{month}</span>
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant={badgeVariant[status]} label={status.charAt(0).toUpperCase() + status.slice(1)} />
            <h3 className="text-sm font-semibold text-slate-900 mt-3 group-hover:text-jade-700 transition-colors line-clamp-1">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{location_name}</span>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <button
          onClick={onViewDetails}
          className="text-[11px] font-semibold text-jade-600 flex items-center gap-1 hover:gap-2 transition-all pt-1 uppercase tracking-wider"
        >
          View Details <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
