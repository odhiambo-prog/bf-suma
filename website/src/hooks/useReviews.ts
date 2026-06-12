import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SHOP_CONFIG } from '@/config/shop.config'

const fallbackReviews = [
  { id: '1', reviewer_name: 'Jane W.', testimonial: 'I have been using BF SUMA products for 6 months and the difference in my energy levels is remarkable. The Ganoderma spores have completely transformed my immune health. Highly recommend!', product_used: 'Pure & Broken Ganoderma Spores', rating: 5, is_approved: true },
  { id: '2', reviewer_name: 'Peter K.', testimonial: 'The NMN Coffee is a game changer. Not only does it taste great, but I feel more focused and energized throughout the day without the jitters of regular coffee.', product_used: 'NMN Coffee', rating: 5, is_approved: true },
  { id: '3', reviewer_name: 'Sarah M.', testimonial: 'I visited the Wellness Center for a full body screening and the team was incredibly professional. The personalized supplement plan they created has helped me manage my stress and sleep better.', product_used: '', rating: 5, is_approved: true },
  { id: '4', reviewer_name: 'David O.', testimonial: 'After struggling with joint pain for years, GluzoJoint has been a lifesaver. I can now move freely and enjoy my morning walks again. Thank you BFSUMA!', product_used: 'GluzoJoint-F™ Capsules', rating: 4, is_approved: true },
  { id: '5', reviewer_name: 'Grace A.', testimonial: 'The Eagle Bistro is my favorite spot in Nairobi. Their Cordyceps coffee is delicious and the ambiance is perfect for relaxing after work. A true wellness haven.', product_used: '', rating: 5, is_approved: true },
]

export function useReviews() {
  const isConfigured = Boolean(SHOP_CONFIG.supabase.url && SHOP_CONFIG.supabase.anonKey)

  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      if (!isConfigured) return fallbackReviews

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data?.length ? data : fallbackReviews
    },
    staleTime: 1000 * 60 * 5,
  })
}
