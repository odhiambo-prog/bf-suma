import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { inventoryService } from '@/services/inventory.service'
import { SHOP_CONFIG } from '@/config/shop.config'

const fallbackBranches = [
  { id: '1', name: 'Eagle Shop - Utumishi' },
  { id: '2', name: 'Eagle Shop - Branch 2' },
]

export function useBranches() {
  const isSupabaseConfigured = Boolean(SHOP_CONFIG.supabase.url && SHOP_CONFIG.supabase.anonKey)
  const isInventoryConfigured = Boolean(SHOP_CONFIG.api.inventoryBaseUrl)

  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')
        if (!error && data?.length) return data
      }

      if (isInventoryConfigured) {
        try {
          return await inventoryService.getBranches()
        } catch {
          return fallbackBranches
        }
      }

      return fallbackBranches
    },
    staleTime: 1000 * 60 * 60,
  })
}
