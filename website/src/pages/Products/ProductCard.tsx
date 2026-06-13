import { motion } from 'framer-motion'
import { ShoppingBag, ArrowUpRight, ShieldCheck, Activity, Heart, Baby, Sparkles, Leaf, Award, UserPlus, Eye } from 'lucide-react'
import type { ProductWithStock } from '@/services/inventory.service'

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Immune Boosters': return ShieldCheck
    case 'Bone & Joint Care': return Activity
    case 'Cardiovascular Health': return Heart
    case 'Smart Kids': return Baby
    case 'Anti-Aging': return Sparkles
    case 'Digestive Health': return Leaf
    case 'Better life': return Award
    case 'Registration': return UserPlus
    default: return ShoppingBag
  }
}

interface ProductCardProps {
  product: ProductWithStock
  onViewDetails: (product: ProductWithStock) => void
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const Icon = getCategoryIcon(product.category)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{
        y: -6,
        borderColor: '#059669',
        boxShadow: '0 12px 40px -8px rgba(5, 150, 105, 0.15)',
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-surface-border cursor-pointer group"
      onClick={() => onViewDetails(product)}
    >
      <div className="aspect-square bg-surface-subtle flex items-center justify-center relative overflow-hidden">
        {product.imageUrl ? (
          <motion.img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <motion.div
            whileHover={{ scale: 1.1, color: '#059669' }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-16 h-16 text-slate-200" strokeWidth={1} />
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-t from-jade-900/30 via-transparent to-transparent pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-1.5 pointer-events-none"
        >
          <Eye className="w-3 h-3 text-jade-600" strokeWidth={2} />
          <span className="text-[10px] font-semibold text-jade-700 uppercase tracking-wider">Quick View</span>
        </motion.div>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-cobalt-600 mb-2">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-4 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <motion.span
            className="text-[11px] font-semibold text-jade-600 flex items-center gap-1"
            whileHover={{ gap: '0.5rem' }}
          >
            View Details <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.span>
          <motion.div
            whileHover={{ backgroundColor: '#059669', borderColor: '#059669', color: '#ffffff' }}
            className="w-7 h-7 border border-surface-border flex items-center justify-center transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
