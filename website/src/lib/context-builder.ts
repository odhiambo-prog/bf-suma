import { SHOP_CONFIG } from '@/config/shop.config'
import type { ProductWithStock } from '@/services/inventory.service'
import type { Branch } from '@/types/branch.types'
import type { Event } from '@/types/event.types'
import type { FAQ } from '@/types/faq.types'
import type { CompanyEvent } from '@/types/join-us.types'

export interface ChatContext {
  businessInfo: {
    name: string
    address: string
    phone: string
    email: string
    distributorProgram: {
      name: string
      ctaLabel: string
      ctaLink: string
    }
  }
  lead: {
    id: string
    name: string
    phone: string
    location: string
  } | null
  products: ProductWithStock[]
  branches: Branch[]
  events: Event[]
  faqs: FAQ[]
  companyEvents: CompanyEvent[]
}

export function buildChatContext(params: {
  lead: { id: string; name: string; phone: string; location: string } | null
  products?: ProductWithStock[]
  branches?: Branch[]
  events?: Event[]
  faqs?: FAQ[]
  companyEvents?: CompanyEvent[]
}): ChatContext {
  return {
    businessInfo: {
      name: SHOP_CONFIG.name,
      address: SHOP_CONFIG.contact.address,
      phone: SHOP_CONFIG.contact.phone,
      email: SHOP_CONFIG.contact.email,
      distributorProgram: SHOP_CONFIG.distributorProgram,
    },
    lead: params.lead,
    products: params.products || [],
    branches: params.branches || [],
    events: params.events || [],
    faqs: params.faqs || [],
    companyEvents: params.companyEvents || [],
  }
}
