export type EventStatus = 'upcoming' | 'ongoing' | 'past'

export interface EventMedia {
  id: string
  event_id: string
  media_type: 'image' | 'video' | 'youtube'
  url: string
  thumbnail_url?: string
  caption?: string
  sort_order: number
}

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_end_date?: string
  location_name: string
  location_address: string
  maps_link?: string
  status: EventStatus
  youtube_url?: string
  is_published: boolean
  event_media: EventMedia[]
}
