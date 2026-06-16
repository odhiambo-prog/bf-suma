import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, Loader2, Sparkles, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '@/constants'
import { useProducts } from '@/hooks/useProducts'
import type { ProductWithStock } from '@/services/inventory.service'
import SEOHead from '@/components/seo/SEOHead'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CategoryFilter from './CategoryFilter'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      duration: 0.4,
    },
  },
} as const;

interface ProductsSectionProps {
  preview?: boolean
}

export default function ProductsSection({ preview }: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null)

  const { data: products = [], isLoading } = useProducts(selectedCategory)

  const safeProducts = Array.isArray(products) ? products : []
  const displayProducts = preview ? safeProducts.slice(0, 4) : safeProducts

  return (
    <>
      <SEOHead
        title="Premium Health Supplements — BF SUMA Eagle Shop Nairobi"
        description="Browse our full catalog of science-backed health supplements in Nairobi. From immune boosters and bone & joint care to anti-aging and digestive health. Quality products at our Eagle Shop."
      />
      <section className="py-16 md:py-28 bg-surface-subtle relative overflow-hidden" id="products-preview">
      <div className="absolute top-0 right-0 w-96 h-96 bg-jade-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cobalt-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {preview && (
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 right-6 z-10 hidden md:block"
          >
            <div className="bg-white/90 border border-jade-200 p-4 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-jade-100 flex items-center justify-center">
                  <Leaf className="w-4.5 h-4.5 text-jade-700" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-jade-900">100% Pure.</p>
                  <p className="text-sm font-semibold text-jade-900">Naturally Organic</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
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

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 bg-white px-5 py-3 border border-surface-border"
          >
            <ShoppingBag className="w-4 h-4 text-jade-600" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-slate-700 font-mono">
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                preview ? `${displayProducts.length} / ${products.length}` : `${products.length}`
              )}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CategoryFilter
            categories={['All', ...CATEGORIES]}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-surface-border h-80 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12"
          >
            <AnimatePresence mode="popLayout">
              {displayProducts.map((product) => (
                <motion.div
                  key={product.code}
                  variants={cardVariants}
                  layout
                >
                  <ProductCard
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {preview && !isLoading && products.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border-2 border-jade-500 text-jade-600 hover:bg-jade-600 hover:text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
              View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      </section>
    </>
    )
  }
