import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SHOP_CONFIG } from '@/config/shop.config'
import type { EventStatus } from '@/types/event.types'

const fallbackEvents = [
  {
    id: '1',
    title: 'Wellness Screening Day',
    description: 'Comprehensive full-body health screening at our Utumishi Wellness Center. Includes blood pressure, cholesterol, glucose, and body composition analysis. Free consultation with our health specialists.',
    event_date: '2026-07-15T09:00:00Z',
    event_end_date: '2026-07-15T17:00:00Z',
    location_name: 'Eagle Wellness Center',
    location_address: '6th Floor, Utumishi House, Mamlaka Road, Nairobi',
    maps_link: 'https://maps.google.com',
    status: 'upcoming' as EventStatus,
    youtube_url: '',
    is_published: true,
    event_media: [],
  },
  {
    id: '2',
    title: 'Distributor Training Workshop',
    description: 'Monthly training session for new and existing distributors. Learn product knowledge, sales techniques, and network building strategies.',
    event_date: '2026-08-05T10:00:00Z',
    event_end_date: undefined,
    location_name: 'Training Hub, Utumishi House',
    location_address: '6th Floor, Utumishi House, Mamlaka Road, Nairobi',
    maps_link: 'https://maps.google.com',
    status: 'upcoming' as EventStatus,
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_published: true,
    event_media: [],
  },
  {
    id: '3',
    title: 'Product Launch: NMN Coffee',
    description: 'Official launch event for our new NMN Coffee product. Tasting sessions, special discounts, and health talk by our nutritionist.',
    event_date: '2026-06-01T14:00:00Z',
    event_end_date: undefined,
    location_name: 'Eagle Bistro',
    location_address: '6th Floor, Utumishi House, Mamlaka Road, Nairobi',
    maps_link: 'https://maps.google.com',
    status: 'past' as EventStatus,
    youtube_url: '',
    is_published: true,
    event_media: [],
  },
]

export function useEvents(status?: EventStatus) {
  const isConfigured = Boolean(SHOP_CONFIG.supabase.url && SHOP_CONFIG.supabase.anonKey)

  return useQuery({
    queryKey: ['events', status],
    queryFn: async () => {
      if (!isConfigured) {
        let filtered = [...fallbackEvents]
        if (status) filtered = filtered.filter(e => e.status === status)
        return filtered
      }

      let query = supabase
        .from('events')
        .select('*, event_media(*)')
        .eq('is_published', true)
        .order('event_date', { ascending: status !== 'past' })

      if (status) query = query.eq('status', status)

      const { data, error } = await query
      if (error) throw error
      return data?.length ? data : fallbackEvents
    },
  })
}
