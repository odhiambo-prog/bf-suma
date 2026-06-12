import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface ReviewCardProps {
  reviewer_name: string
  testimonial: string
  product_used?: string
  rating: number
  photo_url?: string
}

export default function ReviewCard({ reviewer_name, testimonial, product_used, rating, photo_url }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = testimonial.length > 150

  const initials = reviewer_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-surface-border p-6"
    >
      <div className="flex items-center gap-4 mb-5">
        {photo_url ? (
          <img src={photo_url} alt={reviewer_name} className="w-12 h-12 object-cover border border-surface-border" />
        ) : (
          <div className="w-12 h-12 bg-jade-50 flex items-center justify-center text-jade-700 font-bold text-xs font-mono border border-surface-border">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">{reviewer_name}</p>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        {expanded || !isLong ? testimonial : `${testimonial.slice(0, 150)}...`}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-semibold text-jade-600 mt-2 uppercase tracking-wider hover:underline"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}

      {product_used && (
        <p className="text-[10px] text-slate-400 mt-4 pt-4 border-t border-surface-border">
          Product: <span className="font-medium text-slate-600">{product_used}</span>
        </p>
      )}
    </motion.div>
  )
}
