import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SHOP_CONFIG } from '@/config/shop.config'

export interface HeroSlide {
  id: string
  image_url: string
  caption?: string
  link_url?: string
  sort_order: number
  is_active: boolean
}

const fallbackSlides: HeroSlide[] = [
  { id: '1', image_url: '/images/herosection/1.jpeg', caption: '', sort_order: 0, is_active: true },
  { id: '2', image_url: '/images/herosection/2.jpeg', caption: '', sort_order: 1, is_active: true },
  { id: '3', image_url: '/images/herosection/3.jpeg', caption: '', sort_order: 2, is_active: true },
  { id: '4', image_url: '/images/herosection/4.jpeg', caption: '', sort_order: 3, is_active: true },
  { id: '5', image_url: '/images/herosection/5.jpeg', caption: '', sort_order: 4, is_active: true },
  { id: '6', image_url: '/images/herosection/6.jpeg', caption: '', sort_order: 5, is_active: true },
  { id: '7', image_url: '/images/herosection/7.jpeg', caption: '', sort_order: 6, is_active: true },
  { id: '9', image_url: '/images/herosection/9.jpeg', caption: '', sort_order: 7, is_active: true },
  { id: '10', image_url: '/images/herosection/10.jpeg', caption: '', sort_order: 8, is_active: true },
]

export function useHeroCarousel() {
  const isConfigured = Boolean(SHOP_CONFIG.supabase.url && SHOP_CONFIG.supabase.anonKey)

  return useQuery({
    queryKey: ['hero-carousel'],
    queryFn: async () => {
      if (!isConfigured) return fallbackSlides

      const { data, error } = await supabase
        .from('hero_carousel')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      return (data?.length ? data : fallbackSlides) as HeroSlide[]
    },
    staleTime: 1000 * 60 * 30,
  })
}
