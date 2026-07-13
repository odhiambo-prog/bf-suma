import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Loader2, Sparkles } from 'lucide-react'
import { CATEGORIES } from '@/constants'
import { useProducts } from '@/hooks/useProducts'
import type { ProductWithStock } from '@/services/inventory.service'
import SEOHead from '@/components/seo/SEOHead'
import SectionIntro from '@/components/ui/SectionIntro'
import Reveal from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
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
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-citrus-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {preview ? (
          <div className="text-center mb-10">
            <SectionIntro
              align="center"
              title="Premium Supplement Catalog"
              subtitle="Browse our wide range of products categorized by health benefits."
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-3 bg-white px-5 py-3 border border-surface-border rounded-full shadow-sm mt-6"
            >
              <ShoppingBag className="w-4 h-4 text-jade-600" strokeWidth={1.5} />
              <span className="text-xs font-semibold text-muted-700 font-mono">
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  `${displayProducts.length} / ${products.length}`
                )}
              </span>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionIntro
              align="left"
              title="Premium Supplement Catalog"
              subtitle="Browse our wide range of products categorized by health benefits."
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-white px-5 py-3 border border-surface-border rounded-full shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-jade-600" strokeWidth={1.5} />
              <span className="text-xs font-semibold text-muted-700 font-mono">
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  `${products.length}`
                )}
              </span>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center"
        >
          <CategoryFilter
            categories={['All', ...CATEGORIES]}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mt-12">
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-surface-subtle animate-pulse h-72"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mt-12"
          >
            <AnimatePresence mode="popLayout">
              {displayProducts.map((product) => (
                <Reveal key={product.code} as="div" variant="up">
                  <ProductCard
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                </Reveal>
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
            <ButtonLink
              to="/products"
              variant="citrus"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
              View Full Catalog
            </ButtonLink>
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
