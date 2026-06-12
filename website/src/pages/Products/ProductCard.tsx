import { motion } from 'framer-motion'
import { ShoppingBag, ArrowUpRight, ShieldCheck, Activity, Heart, Baby, Sparkles, Leaf, Award, UserPlus } from 'lucide-react'
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
      transition={{ duration: 0.2 }}
      className="bg-white border border-surface-border hover:border-jade-300 transition-colors cursor-pointer group"
      onClick={() => onViewDetails(product)}
    >
      <div className="aspect-square bg-surface-subtle flex items-center justify-center relative overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <Icon className="w-16 h-16 text-slate-200 group-hover:text-jade-200 transition-colors duration-300" strokeWidth={1} />
        )}
      </div>
      <div className="p-5">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-cobalt-600 mb-2">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-jade-700 transition-colors mb-4">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <span className="text-[11px] font-semibold text-jade-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
          <div className="w-7 h-7 border border-surface-border flex items-center justify-center group-hover:bg-jade-600 group-hover:border-jade-600 group-hover:text-white transition-colors">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
