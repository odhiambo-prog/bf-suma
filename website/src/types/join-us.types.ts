export interface CompanyEvent {
  id: string
  title: string
  description?: string
  event_date: string
  youtube_url?: string
  is_published: boolean
  sort_order: number
  company_event_media: CompanyEventMedia[]
}

export interface CompanyEventMedia {
  id: string
  company_event_id: string
  media_type: 'image' | 'video' | 'youtube'
  url: string
  caption?: string
  sort_order: number
}
