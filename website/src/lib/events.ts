import type { EventStatus } from '@/types/event.types'

export function computeEventStatus(event: { event_date: string; event_end_date?: string | null }): EventStatus {
  const now = new Date()
  const start = new Date(event.event_date)

  if (start > now) return 'upcoming'

  if (event.event_end_date) {
    const end = new Date(event.event_end_date)
    if (end > now) return 'ongoing'
    return 'past'
  }

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endOfDay = new Date(startDay)
  endOfDay.setDate(endOfDay.getDate() + 1)
  if (now < endOfDay) return 'ongoing'

  return 'past'
}
