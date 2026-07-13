/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
import { inventoryService } from '@/services/inventory.service'
import type { ProductWithStock, StockLevel } from '@/services/inventory.service'
import { PRODUCTS } from '@/constants'
import { SHOP_CONFIG } from '@/config/shop.config'

export function useProducts(category?: string) {
  const isConfigured = Boolean(SHOP_CONFIG.api.inventoryBaseUrl)

  return useQuery<ProductWithStock[]>({
    queryKey: ['products', category],
    queryFn: async () => {
      const mapToProductWithStock = (p: any): ProductWithStock => {
        return {
          code: p.prod_code || p.code || '',
          name: p.prod_name || p.name || '',
          category: p.product_line_name || p.category_name || p.category || 'General',
          description: p.description || '',
          imageUrl: p.image_url || p.imageUrl || p.image || '',
          stock: Array.isArray(p.stock) 
            ? p.stock.map((s: any): StockLevel => ({
                branchId: s.branch_id || s.branchId || '',
                branchName: s.branch_name || s.branchName || 'Unknown Branch',
                quantity: s.quantity || 0,
                inStock: s.in_stock ?? s.inStock ?? (s.quantity > 0)
              }))
            : []
        }
      }

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
        
        const rawProducts = response?.results || (Array.isArray(response) ? response : null)

        if (rawProducts && Array.isArray(rawProducts)) {
          return rawProducts.map(mapToProductWithStock)
        } else {
          return fallbackFiltered.map(mapToProductWithStock)
        }
      } catch (err) {
        console.error('Inventory API Fetch Error:', err)
        return fallbackFiltered.map(mapToProductWithStock)
      }
    },
    staleTime: 1000 * 60 * 10,
  })
}
