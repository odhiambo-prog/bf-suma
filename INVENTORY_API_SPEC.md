# BF SUMA Inventory API Specification

This document defines the REST API contract required by the BF SUMA Eagleshop website to display real-time product information and stock levels.

## 1. Connection Details
- **Base URL:** Defined in `.env` as `VITE_INVENTORY_BASE_URL`
- **Authentication:** Bearer Token via `Authorization` header (`VITE_INVENTORY_API_KEY`)
- **Content Type:** `application/json`

## 2. Required Endpoints

### GET `/products`
Returns the full catalog of products available for the shop.

**Response Schema:** `Array<ProductWithStock>`

```json
[
  {
    "code": "AP013C",
    "name": "Pure & Broken Ganoderma Spores",
    "category": "Immune Booster",
    "description": "High-quality ganoderma spores for immune support...",
    "imageUrl": "https://cdn.example.com/images/ap013c.jpg",
    "stock": [
      {
        "branchId": "branch-1",
        "branchName": "Eagle Shop - Utumishi",
        "quantity": 24,
        "inStock": true
      }
    ]
  }
]
```

---

### GET `/products/:code`
Returns details for a specific product identified by its code.

**Response Schema:** `ProductWithStock`

---

### GET `/products?category={categoryName}`
Returns products filtered by category. The `categoryName` will match the categories defined in the website (e.g., "Immune Booster", "Bone & Joint Care").

**Response Schema:** `Array<ProductWithStock>`

---

### GET `/branches`
Returns a list of all active branches managed by the inventory system.

**Response Schema:**
```json
[
  {
    "id": "branch-1",
    "name": "Eagle Shop - Utumishi"
  }
]
```

---

### GET `/stock?branch={branchId}`
Returns stock levels for all products at a specific branch.

**Response Schema:** `Array<StockLevel>`

---

## 3. Data Type Definitions (TypeScript Reference)

```typescript
export interface StockLevel {
  branchId: string;
  branchName: string;
  quantity: number;
  inStock: boolean;
}

export interface ProductWithStock {
  code: string;           // Unique identifier (e.g., "AP013C")
  name: string;           // Display name
  category: string;       // Matches website category names
  description?: string;   // Optional markdown or plain text
  imageUrl?: string;      // Optional public URL to product image
  stock: StockLevel[];    // Array of availability per branch
}
```

## 4. Critical Requirements
1. **CORS:** The inventory server **must** allow Cross-Origin Resource Sharing (CORS) for the website's domain (e.g., your Vercel URL).
2. **Category Matching:** The `category` string returned by the API must match one of the categories defined in `src/constants.ts` (e.g., "Immune Booster", "Anti-Aging").
3. **Image URLs:** Images should be hosted on a public CDN or a publicly accessible URL.
