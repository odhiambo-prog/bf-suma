import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '@/constants'
import { useProducts } from '@/hooks/useProducts'
import type { ProductWithStock } from '@/services/inventory.service'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CategoryFilter from './CategoryFilter'

interface ProductsSectionProps {
  preview?: boolean
}

export default function ProductsSection({ preview }: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null)

  const { data: products = [], isLoading } = useProducts(selectedCategory)

  const displayProducts = preview ? products.slice(0, 5) : products

  return (
    <section className="py-28 bg-surface-subtle" id="products-preview">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-cobalt-600 mb-4">
              Our Collection
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-slate-900 mb-4 text-balance">
              Premium Supplement Catalog
            </h2>
            <p className="text-sm text-slate-500">
              Browse our wide range of products categorized by health benefits.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 border border-surface-border">
            <ShoppingBag className="w-4 h-4 text-jade-600" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-slate-700 font-mono">
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                preview ? `${displayProducts.length} / ${products.length}` : `${products.length}`
              )}
            </span>
          </div>
        </div>

        <CategoryFilter
          categories={['All', ...CATEGORIES]}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-surface-border h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12"
          >
            <AnimatePresence mode="popLayout">
              {displayProducts.map(product => (
                <ProductCard
                  key={product.code}
                  product={product}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {preview && !isLoading && products.length > 5 && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
            >
              View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  )
}
