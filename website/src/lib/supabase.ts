import { createClient } from '@supabase/supabase-js'
import { SHOP_CONFIG } from '@/config/shop.config'

export const supabase = createClient(
  SHOP_CONFIG.supabase.url,
  SHOP_CONFIG.supabase.anonKey
)
