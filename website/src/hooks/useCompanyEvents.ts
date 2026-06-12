import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SHOP_CONFIG } from '@/config/shop.config'

const fallbackCompanyEvents = [
  {
    id: '1',
    title: 'BF SUMA Global Summit 2026',
    description: 'Annual global summit bringing together distributors and leaders from across the world. Featuring product launches, training sessions, and networking opportunities.',
    event_date: '2026-09-15T09:00:00Z',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_published: true,
    sort_order: 0,
    company_event_media: [],
  },
]

export function useCompanyEvents() {
  const isConfigured = Boolean(SHOP_CONFIG.supabase.url && SHOP_CONFIG.supabase.anonKey)

  return useQuery({
    queryKey: ['company-events'],
    queryFn: async () => {
      if (!isConfigured) return fallbackCompanyEvents

      const { data, error } = await supabase
        .from('company_events')
        .select('*, company_event_media(*)')
        .eq('is_published', true)
        .order('sort_order')

      if (error) throw error
      return data?.length ? data : fallbackCompanyEvents
    },
  })
}
