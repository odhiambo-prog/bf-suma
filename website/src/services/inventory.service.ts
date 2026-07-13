/* eslint-disable @typescript-eslint/no-explicit-any */
import { SHOP_CONFIG } from '@/config/shop.config'

export interface StockLevel {
  branchId: string
  branchName: string
  quantity: number
  inStock: boolean
}

export interface ProductWithStock {
  code: string
  name: string
  category: string
  description?: string
  imageUrl?: string
  stock: StockLevel[]
}

const BASE = SHOP_CONFIG.api.inventoryBaseUrl
const KEY = SHOP_CONFIG.api.inventoryApiKey

async function inventoryFetch<T>(path: string): Promise<T> {
  console.log('[INVENTORY] Base URL:', BASE)
  console.log('[INVENTORY] Full URL:', `${BASE}${path}`)
  console.log('[INVENTORY] Auth header:', `Bearer ${KEY}`)
  console.log('[INVENTORY] Key length:', KEY.length)
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Inventory API error: ${res.status}`)
  return res.json()
}

export const inventoryService = {
  getProducts: () => inventoryFetch<any>('/products/'),
  getProductByCode: (code: string) => inventoryFetch<any>(`/products/${code}/`),
  getProductsByCategory: (category: string) =>
    inventoryFetch<any>(`/products/?category=${encodeURIComponent(category)}`),
  getBranches: () => inventoryFetch<{ id: string; name: string }[]>('/branches/'),
  getStockByBranch: (branchId: string) => inventoryFetch<StockLevel[]>(`/stock/?branch=${branchId}`),
}
