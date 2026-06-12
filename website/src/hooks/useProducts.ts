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
      const mapToProductWithStock = (p: any): ProductWithStock => ({
        code: p.prod_code || p.code || '',
        name: p.prod_name || p.name || '',
        category: p.category_name || p.category || 'General',
        description: p.description || '',
        imageUrl: p.image_url || p.imageUrl || '',
        stock: Array.isArray(p.stock) ? p.stock : []
      })

      const fallbackFiltered = category && category !== 'All'
        ? PRODUCTS.filter(p => p.category === category)
        : PRODUCTS

      if (!isConfigured) {
        return fallbackFiltered.map(mapToProductWithStock)
      }

      try {
        const response: any = category && category !== 'All'
          ? await inventoryService.getProductsByCategory(category)
          : await inventoryService.getProducts()
        
        // Handle paginated response { results: [] } or direct array []
        const rawProducts = response?.results || (Array.isArray(response) ? response : null)

        if (rawProducts && Array.isArray(rawProducts)) {
          if (rawProducts.length > 0) console.log('Sample raw product from API:', rawProducts[0]);
          return rawProducts.map(mapToProductWithStock)
        } else {
          console.warn('Inventory API returned unexpected format. Received:', response)
          return fallbackFiltered.map(mapToProductWithStock)
        }
      } catch (err) {
        console.error('Inventory API Fetch Error, falling back to static products:', err)
        return fallbackFiltered.map(mapToProductWithStock)
      }
    },
    staleTime: 1000 * 60 * 10,
  })
}
