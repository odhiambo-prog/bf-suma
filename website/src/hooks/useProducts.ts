import { useQuery } from '@tanstack/react-query'
import { inventoryService } from '@/services/inventory.service'
import { PRODUCTS } from '@/constants'
import { SHOP_CONFIG } from '@/config/shop.config'

export function useProducts(category?: string) {
  const isConfigured = Boolean(SHOP_CONFIG.api.inventoryBaseUrl)

  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      if (!isConfigured) {
        return category && category !== 'All'
          ? PRODUCTS.filter(p => p.category === category)
          : PRODUCTS
      }
      try {
        return category && category !== 'All'
          ? await inventoryService.getProductsByCategory(category)
          : await inventoryService.getProducts()
      } catch {
        return category && category !== 'All'
          ? PRODUCTS.filter(p => p.category === category)
          : PRODUCTS
      }
    },
    staleTime: 1000 * 60 * 10,
  })
}
