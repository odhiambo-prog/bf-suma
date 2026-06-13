import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, X, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const schema = z.object({
  reviewer_name: z.string().min(2, 'Name must be at least 2 characters'),
  testimonial: z.string().min(20, 'Review must be at least 20 characters').max(500, 'Review must be under 500 characters'),
  product_used: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ReviewSubmitFormProps {
  onClose: () => void
}

export default function ReviewSubmitForm({ onClose }: ReviewSubmitFormProps) {
  const [rating, setRating] = useState(5)
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      let photoUrl = ''

      if (photo) {
        const ext = photo.name.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('review-photos')
          .upload(filename, photo, { contentType: photo.type })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('review-photos')
            .getPublicUrl(filename)
          photoUrl = publicUrl
        }
      }

      const { error } = await supabase.from('reviews').insert({
        reviewer_name: data.reviewer_name,
        testimonial: data.testimonial,
        product_used: data.product_used || null,
        photo_url: photoUrl || null,
        rating,
        is_approved: true,
      })

      if (error) throw error

      toast.success('Thank you! Your review has been posted.')
      onClose()
    } catch {
      toast.error('Something went wrong. Please try again.')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="relative w-full max-w-lg bg-white shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border border-surface-border flex items-center justify-center hover:bg-surface-subtle transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>

        <h2 className="font-display text-xl text-slate-900 mb-1">Share Your Experience</h2>
        <p className="text-xs text-slate-500 mb-8">Tell us about your BF SUMA journey.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('reviewer_name')}
              className={cn(
                'w-full px-4 py-3 border bg-white text-sm transition-colors',
                errors.reviewer_name ? 'border-red-400' : 'border-surface-border focus:border-jade-500'
              )}
              placeholder="e.g. Jane W."
            />
            {errors.reviewer_name && (
              <p className="text-red-500 text-[11px] mt-1">{errors.reviewer_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  className="p-1"
                  aria-label={`Rate ${i} stars`}
                >
                  <Star
                    className={`w-6 h-6 ${i <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('testimonial')}
              rows={4}
              className={cn(
                'w-full px-4 py-3 border bg-white text-sm transition-colors resize-none',
                errors.testimonial ? 'border-red-400' : 'border-surface-border focus:border-jade-500'
              )}
              placeholder="Share your experience with our products..."
            />
            {errors.testimonial && (
              <p className="text-red-500 text-[11px] mt-1">{errors.testimonial.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Product Used <span className="text-slate-400">(optional)</span>
            </label>
            <input
              {...register('product_used')}
              className="w-full px-4 py-3 border border-surface-border bg-white text-sm transition-colors focus:border-jade-500"
              placeholder="e.g. NMN Coffee"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Your Photo <span className="text-slate-400">(optional)</span>
            </label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-surface-border cursor-pointer hover:border-jade-400 transition-colors">
              <Upload className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">
                {photo ? photo.name : 'Upload a photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => setPhoto(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-jade-600 hover:bg-jade-700 text-white px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
