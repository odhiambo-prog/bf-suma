import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, X, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  reviewer_name: z.string().min(2, 'Name must be at least 2 characters'),
  testimonial: z.string().min(20, 'Review must be at least 20 characters').max(500, 'Review must be under 500 characters'),
  product_used: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ReviewSubmitFormProps {
  onClose: () => void
}

const inputClass =
  'w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-300 focus:outline-none focus:ring-2 focus:ring-jade-500/40 focus:border-jade-400'
const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-muted-700 mb-2'

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
        // eslint-disable-next-line react-hooks/purity
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
      <div className="fixed inset-0 z-modal flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="relative w-full max-w-lg bg-surface-card shadow-float-lg rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border border-surface-border flex items-center justify-center hover:bg-surface-subtle transition-colors rounded-full"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-muted-500" />
        </button>

        <h2 className="font-display text-xl text-ink mb-1">Share Your Experience</h2>
        <p className="text-xs text-muted-500 mb-8">Tell us about your BF SUMA journey.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={labelClass}>
              Your Name <span className="text-danger-500">*</span>
            </label>
            <input
              {...register('reviewer_name')}
              className={cn(
                inputClass,
                errors.reviewer_name && 'border-danger-400 focus:border-danger-400 focus:ring-danger-500/40'
              )}
              placeholder="e.g. Jane W."
            />
            {errors.reviewer_name && (
              <p className="text-danger-500 text-[11px] mt-1">{errors.reviewer_name.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
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
                    className={`w-6 h-6 ${i <= rating ? 'text-amber-500 fill-amber-500' : 'text-muted-200'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Your Review <span className="text-danger-500">*</span>
            </label>
            <textarea
              {...register('testimonial')}
              rows={4}
              className={cn(
                inputClass,
                errors.testimonial && 'border-danger-400 focus:border-danger-400 focus:ring-danger-500/40'
              )}
              placeholder="Share your experience with our products..."
            />
            {errors.testimonial && (
              <p className="text-danger-500 text-[11px] mt-1">{errors.testimonial.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Product Used <span className="text-muted-400">(optional)</span>
            </label>
            <input
              {...register('product_used')}
              className={inputClass}
              placeholder="e.g. NMN Coffee"
            />
          </div>

          <div>
            <label className={labelClass}>
              Your Photo <span className="text-muted-400">(optional)</span>
            </label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-surface-border cursor-pointer hover:border-jade-400 transition-colors rounded-xl">
              <Upload className="w-4 h-4 text-muted-400" />
              <span className="text-xs text-muted-500">
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

          <Button type="submit" variant="citrus" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
