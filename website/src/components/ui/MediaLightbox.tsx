import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { EventMedia } from '@/types/event.types'

interface MediaLightboxProps {
  media: EventMedia[]
  initialIndex?: number
  onClose: () => void
}

export default function MediaLightbox({ media, initialIndex = 0, onClose }: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(0)
  const openedAt = useRef(Date.now())

  const goTo = useCallback((i: number) => {
    setDirection(i > index ? 1 : -1)
    setIndex(i)
  }, [index])

  const goNext = useCallback(() => goTo((index + 1) % media.length), [index, media.length, goTo])
  const goPrev = useCallback(() => goTo((index - 1 + media.length) % media.length), [index, media.length, goTo])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, goNext, goPrev])

  const current = media[index]
  if (!current) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center touch-manipulation select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/90"
        onClick={() => {
          // Ignore the trailing tap of a double-tap that opened the lightbox
          if (Date.now() - openedAt.current < 400) return
          onClose()
        }}
      />

      <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
        <X className="w-5 h-5 text-white" />
      </button>

      {media.length > 1 && (
        <>
          <button onClick={goPrev} className="absolute left-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={goNext} className="absolute right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}

      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current.id}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="relative z-[1] max-w-[90vw] max-h-[85vh] flex items-center justify-center"
          onClick={e => e.stopPropagation()}
        >
          {current.media_type === 'image' && (
            <img src={current.url} alt={current.caption || ''} className="max-w-full max-h-[85vh] object-contain rounded-lg touch-manipulation select-none" draggable={false} />
          )}
          {current.media_type === 'video' && (
            <video src={current.url} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
          )}
          {current.media_type === 'youtube' && (
            <div className="aspect-video w-full max-w-4xl">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(current.url)}?autoplay=1`}
                className="w-full h-full rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  , document.body)
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
