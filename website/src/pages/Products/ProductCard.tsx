import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Eye, ShoppingBag, ShieldCheck, Activity, Heart, Baby, Sparkles, Leaf, Award, UserPlus, type LucideIcon } from 'lucide-react'
import type { ProductWithStock } from '@/services/inventory.service'
import { trackProductView } from '@/hooks/useAnalytics'

const categoryIcons: Record<string, LucideIcon> = {
  'Immune Boosters': ShieldCheck,
  'Bone & Joint Care': Activity,
  'Cardiovascular Health': Heart,
  'Smart Kids': Baby,
  'Anti-Aging': Sparkles,
  'Digestive Health': Leaf,
  'Better life': Award,
  'Registration': UserPlus,
}

interface ProductCardProps {
  product: ProductWithStock
  onViewDetails: (product: ProductWithStock) => void
}

const TILT = 10

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const Icon = categoryIcons[product.category] ?? ShoppingBag
  const reduce = useReducedMotion()
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })

  const tiltRef = useRef<HTMLDivElement>(null)

  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover || reduce || !tiltRef.current) return
    const rect = tiltRef.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(nx * TILT)
    rx.set(-ny * TILT)
  }

  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  const open = () => {
    trackProductView(product.code, product.name)
    onViewDetails(product)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }

  return (
    <motion.article
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={onKeyDown}
      className="group relative flex flex-col items-center text-center cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
    >
      <div
        ref={tiltRef}
        className="relative w-full [perspective:1000px]"
        onMouseMove={tilt}
        onMouseLeave={reset}
      >
        <motion.div
          style={{ rotateX: srx, rotateY: sry }}
          className="relative [transform-style:preserve-3d] will-change-transform"
        >
          {product.imageUrl ? (
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              whileHover={reduce ? undefined : { y: -10 }}
              className="w-full aspect-square object-cover rounded-2xl shadow-float"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-square bg-surface-subtle rounded-2xl shadow-float flex items-center justify-center">
              <Icon className="w-16 h-16 text-muted-200" strokeWidth={1} />
            </div>
          )}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-[50%] bg-jade-900/20 blur-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-1.5 pointer-events-none"
          >
            <Eye className="w-3 h-3 text-jade-600" strokeWidth={2} />
            <span className="text-[10px] font-semibold text-jade-700 uppercase tracking-wider">Quick View</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-7 space-y-2">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-jade-700">
          {product.category}
        </p>
        <h3 className="text-base font-semibold text-ink leading-snug line-clamp-2">
          {product.name}
        </h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-jade-600">
          View Details <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </span>
      </div>
    </motion.article>
  )
}
