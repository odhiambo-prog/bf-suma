import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { EventMedia } from '@/types/event.types'
import MediaLightbox from './MediaLightbox'

interface MediaCarouselProps {
  media: EventMedia[]
  variant?: 'card' | 'detail'
  autoPlay?: boolean
  interval?: number
  onItemClick?: () => void
  className?: string
}

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
}

export default function MediaCarousel({
  media,
  variant = 'detail',
  autoPlay = true,
  interval = 5000,
  onItemClick,
  className,
}: MediaCarouselProps) {
  const items = media || []
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const goTo = useCallback((i: number) => {
    setDirection(i > index ? 1 : -1)
    setIndex(i)
    setPlayingId(null)
  }, [index])

  const goNext = useCallback(() => goTo((index + 1) % items.length), [index, items.length, goTo])
  const goPrev = useCallback(() => goTo((index - 1 + items.length) % items.length), [index, items.length, goTo])

  useEffect(() => {
    if (!autoPlay || paused || playingId !== null || items.length <= 1) return
    timerRef.current = setInterval(goNext, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoPlay, paused, playingId, items.length, interval, goNext])

  useEffect(() => {
    setIndex(0)
    setPlayingId(null)
  }, [items.length])

  if (items.length === 0) return null

  const current = items[index]
  const isCompact = variant === 'card'
  const imageItems = items.filter(m => m.media_type === 'image')

  function openLightbox(i: number) {
    setLightboxIndex(i)
    setLightboxOpen(true)
  }

  return (
    <>
      <div
        className={`relative overflow-hidden bg-slate-100 group ${className || ''}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={isCompact ? 'aspect-[16/9]' : 'aspect-video'}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current.id + (playingId === current.id ? '-playing' : '')}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              {playingId === current.id ? (
                renderPlayer(current)
              ) : (
                renderThumbnail(current, () => {
                  if (onItemClick) {
                    onItemClick()
                  } else if (current.media_type === 'image') {
                    const imgIdx = imageItems.findIndex(m => m.id === current.id)
                    openLightbox(imgIdx >= 0 ? imgIdx : 0)
                  } else {
                    setPlayingId(current.id)
                  }
                })
              )}
            </motion.div>
          </AnimatePresence>

          {current.caption && (
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent px-4 pb-3 pt-8 pointer-events-none">
              <p className="text-xs text-white/90 text-balance">{current.caption}</p>
            </div>
          )}

          {items.length > 1 && (
            <>
              <div className="absolute bottom-3 right-3 z-10 bg-black/50 text-white text-[10px] font-semibold px-2 py-1 rounded select-none">
                {index + 1} / {items.length}
              </div>

              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="flex gap-1.5 p-2 overflow-x-auto bg-slate-50 border-t border-surface-border">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                className={`flex-shrink-0 relative overflow-hidden rounded border-2 transition-all ${
                  i === index
                    ? 'border-jade-500 ring-1 ring-jade-500 opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                } ${isCompact ? 'w-9 h-9' : 'w-12 h-12'}`}
              >
                {renderThumbStrip(item)}
                {i === index && (
                  <div className="absolute inset-0 border border-white/20 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && imageItems.length > 0 && (
        <MediaLightbox
          media={imageItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}

function renderThumbnail(item: EventMedia, onClick: () => void) {
  const isVideo = item.media_type === 'video'
  const isYoutube = item.media_type === 'youtube'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-full relative cursor-pointer text-left"
    >
      {isYoutube ? (
        <img
          src={getYouTubeThumbnail(item.url)}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : isVideo ? (
        <video
          src={item.url}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
        />
      ) : (
        <img
          src={item.url}
          alt={item.caption || ''}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {(isVideo || isYoutube) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
            <Play className="w-5 h-5 text-slate-800 ml-0.5" />
          </div>
        </div>
      )}
    </button>
  )
}

function renderPlayer(item: EventMedia) {
  if (item.media_type === 'video') {
    return (
      <video
        src={item.url}
        controls
        autoPlay
        className="w-full h-full object-contain bg-black"
      />
    )
  }
  if (item.media_type === 'youtube') {
    const id = getYouTubeId(item.url)
    if (!id) return renderThumbnail(item, () => {})
    return (
      <div className="w-full h-full">
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    )
  }
  return null
}

function renderThumbStrip(item: EventMedia) {
  if (item.media_type === 'youtube') {
    return (
      <img
        src={getYouTubeThumbnail(item.url)}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
    )
  }
  if (item.media_type === 'video') {
    return (
      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
        <Play className="w-3 h-3 text-slate-500 ml-0.5" />
      </div>
    )
  }
  return (
    <img
      src={item.url}
      alt=""
      className="w-full h-full object-cover"
      loading="lazy"
    />
  )
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

function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}
