import { type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselProps {
  slides: ReactNode[]
  autoPlay?: boolean
  showArrows?: boolean
  showDots?: boolean
  className?: string
}

export default function Carousel({ slides, autoPlay, showArrows, showDots, className }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    autoPlay ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []
  )

  const canScrollPrev = emblaApi?.canScrollPrev()
  const canScrollNext = emblaApi?.canScrollNext()

  return (
    <div className={cn('relative group', className)}>
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 border border-surface-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 hover:bg-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 border border-surface-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 hover:bg-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="group/dot"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div className="w-6 h-[2px] bg-slate-200 group-hover/dot:bg-jade-400 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
