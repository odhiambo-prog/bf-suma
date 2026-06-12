export interface Product {
  code: string
  name: string
  category: string
}

export interface StockLevel {
  branchId: string
  branchName: string
  quantity: number
  inStock: boolean
}

export interface ProductWithStock extends Product {
  description?: string
  imageUrl?: string
  stock: StockLevel[]
}
