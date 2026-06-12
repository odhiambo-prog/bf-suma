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

      const filtered = category && category !== 'All'
        ? PRODUCTS.filter(p => p.category === category)
        : PRODUCTS

      if (!isConfigured) {
        return filtered.map(mapToProductWithStock)
      }

      try {
        const data = category && category !== 'All'
          ? await inventoryService.getProductsByCategory(category)
          : await inventoryService.getProducts()
        
        if (Array.isArray(data)) {
          return data
        } else {
          console.warn('Inventory API returned non-array data, falling back to static products')
          return filtered.map(mapToProductWithStock)
        }
      } catch (err) {
        console.error('Inventory API Fetch Error, falling back to static products:', err)
        return filtered.map(mapToProductWithStock)
      }
    },
    staleTime: 1000 * 60 * 10,
  })
}
