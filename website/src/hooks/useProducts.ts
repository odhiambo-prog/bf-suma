import { useQuery } from '@tanstack/react-query'
import { inventoryService } from '@/services/inventory.service'
import type { ProductWithStock } from '@/services/inventory.service'
import { PRODUCTS } from '@/constants'
import { SHOP_CONFIG } from '@/config/shop.config'

export function useProducts(category?: string) {
  const isConfigured = Boolean(SHOP_CONFIG.api.inventoryBaseUrl)

  return useQuery<ProductWithStock[]>({
    queryKey: ['products', category],
    queryFn: async () => {
      const mapToProductWithStock = (p: typeof PRODUCTS[0]): ProductWithStock => ({
        ...p,
        stock: []
      })

      if (!isConfigured) {
        const filtered = category && category !== 'All'
          ? PRODUCTS.filter(p => p.category === category)
          : PRODUCTS
        return filtered.map(mapToProductWithStock)
      }
      try {
        return category && category !== 'All'
          ? await inventoryService.getProductsByCategory(category)
          : await inventoryService.getProducts()
      } catch {
        const filtered = category && category !== 'All'
          ? PRODUCTS.filter(p => p.category === category)
          : PRODUCTS
        return filtered.map(mapToProductWithStock)
      }
    },
    staleTime: 1000 * 60 * 10,
  })
}
