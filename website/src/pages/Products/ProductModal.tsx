import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Phone, ShieldCheck } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import type { ProductWithStock } from '@/services/inventory.service'
import StockBadge from '@/components/ui/StockBadge'
import { Button } from '@/components/ui/Button'
import { useLeadForm } from '@/hooks/useLeadForm'

interface ProductModalProps {
  product: ProductWithStock | null
  onClose: () => void
}

const placeholderStock = [
  { branchName: 'Eagle Shop - Utumishi', quantity: 0, inStock: false },
  { branchName: 'Eagle Shop - Branch 2', quantity: 0, inStock: false },
]

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { openLeadForm } = useLeadForm()
  if (!product) return null

  const displayStock = product.stock && product.stock.length > 0 
    ? product.stock.map(s => ({ 
        branchName: s.branchName, 
        quantity: s.quantity, 
        inStock: s.inStock 
      }))
    : placeholderStock

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    category: product.category,
    brand: { '@type': 'Brand', name: 'BF SUMA' },
    offers: {
      '@type': 'Offer',
      availability: product.stock?.some(s => s.inStock)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'BF SUMA Eagle Shop' },
      url: `https://eagleshop.co.ke/products#${product.code}`,
    },
  }

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Helmet>
            <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
          </Helmet>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white border border-surface-border flex items-center justify-center hover:bg-surface-subtle transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-muted-500" />
            </button>

            <div className="bg-surface-subtle p-8 pb-0">
              <div className="aspect-video bg-surface-subtle flex items-center justify-center relative overflow-hidden rounded-2xl">
                {product.imageUrl ? (
                   <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                 ) : (
                  <ShieldCheck className="w-20 h-20 text-muted-200" strokeWidth={1} />
                )}
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-700 mb-3">
                  {product.category}
                </p>
                <h2 className="font-display text-2xl text-ink">
                  {product.name}
                </h2>
                {product.description && (
                   <p className="mt-4 text-sm text-muted-500 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="border border-surface-border p-6">
                <div className="flex items-center gap-3 mb-5">
                  <ShoppingBag className="w-4 h-4 text-jade-600" strokeWidth={1.5} />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-700">Branch Availability</h3>
                </div>
                <div className="divide-y divide-surface-border">
                  {displayStock.map((stock, i) => (
                    <StockBadge key={i} {...stock} />
                  ))}
                </div>
              </div>

              <Button
                onClick={() => openLeadForm(product.name)}
                variant="citrus"
                size="md"
                className="w-full"
              >
                <Phone className="w-3.5 h-3.5" />
                Inquire via WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
