export interface Review {
  id: string
  reviewer_name: string
  testimonial: string
  product_used?: string
  photo_url?: string
  rating: number
  is_approved: boolean
  created_at: string
}
