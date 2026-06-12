import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SHOP_CONFIG } from '@/config/shop.config'

const fallbackFAQs = [
  { id: '1', question: 'What is BF SUMA?', answer: 'BF SUMA is a global health and wellness company that provides premium, science-backed nutritional supplements. Our products are formulated using high-quality natural ingredients to support various aspects of health and well-being.', category: 'General', sort_order: 0, is_published: true },
  { id: '2', question: 'Are the products safe?', answer: 'Yes, all BF SUMA products are manufactured in GMP-certified facilities and undergo rigorous quality testing. We use natural ingredients and provide clear dosage instructions on all our products.', category: 'Products', sort_order: 1, is_published: true },
  { id: '3', question: 'How do I know which product is right for me?', answer: 'We recommend visiting our Wellness Center for a comprehensive health screening. Our health specialists will analyze your results and recommend products tailored to your specific needs.', category: 'Products', sort_order: 2, is_published: true },
  { id: '4', question: 'Where can I buy the products?', answer: 'You can purchase products at our Eagle Shop located at 6th Floor, Utumishi House, Mamlaka Road, Nairobi. You can also contact us via WhatsApp at +254 (0)716626037 for orders and delivery options.', category: 'General', sort_order: 3, is_published: true },
  { id: '5', question: 'What is the distributor program?', answer: 'The Eagle Distributor Program allows you to earn commissions by promoting BF SUMA products. You get access to training resources, product samples, and a supportive community of health entrepreneurs.', category: 'Membership', sort_order: 4, is_published: true },
  { id: '6', question: 'Do you ship outside Nairobi?', answer: 'Yes, we offer delivery services to various locations across Kenya. Shipping costs and delivery times vary depending on your location. Contact us for specific arrangements.', category: 'General', sort_order: 5, is_published: true },
  { id: '7', question: 'Are the products certified?', answer: 'Yes, our products meet international quality standards. They are manufactured in GMP-certified facilities and have received necessary certifications from relevant health authorities.', category: 'Products', sort_order: 6, is_published: true },
  { id: '8', question: 'How do I contact support?', answer: 'You can reach us by phone at +254 (0)716626037, email at info@eagleshop.co.ke, or visit our shop at Utumishi House, Mamlaka Road, Nairobi during business hours.', category: 'General', sort_order: 7, is_published: true },
  { id: '9', question: 'What is the return policy?', answer: 'We accept returns of unopened products within 14 days of purchase with a valid receipt. Opened products can only be returned if there is a manufacturing defect. Please contact us for assistance.', category: 'General', sort_order: 8, is_published: true },
  { id: '10', question: 'Do you offer wholesale pricing?', answer: 'Yes, we offer wholesale and bulk purchase discounts for distributors and businesses. Contact our sales team for customized pricing based on your order volume.', category: 'Membership', sort_order: 9, is_published: true },
]

export function useFAQ(category?: string) {
  const isConfigured = Boolean(SHOP_CONFIG.supabase.url && SHOP_CONFIG.supabase.anonKey)

  return useQuery({
    queryKey: ['faq', category],
    queryFn: async () => {
      if (!isConfigured) {
        let filtered = [...fallbackFAQs]
        if (category) filtered = filtered.filter(f => f.category === category)
        return filtered
      }

      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('sort_order')

      if (category) query = query.eq('category', category)

      const { data, error } = await query
      if (error) throw error
      return data?.length ? data : fallbackFAQs
    },
  })
}
