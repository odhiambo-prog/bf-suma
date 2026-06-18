import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SHOP_CONFIG } from '@/config/shop.config'
import { useHeroCarousel } from '@/hooks/useHeroCarousel'

export default function HeroSection() {
  const { data: slides = [], isLoading } = useHeroCarousel()
  const safeSlides = Array.isArray(slides) ? slides : []
  const heroImages = safeSlides.map(s => s.image_url)

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const total = heroImages.length

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % total)
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [paused, total])

  const goTo = (i: number) => setIndex(i)

  if (isLoading || total === 0) {
    return (
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-slate-900 animate-pulse" />
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-jade-300 mb-6">
              {SHOP_CONFIG.tagline}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] mb-5 text-balance">
              BF SUMA Nairobi{' '}
              <span className="text-jade-400">Eagle Shop</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-10 max-w-md">
              Beyond supplements, we are a wellness hub. Located at the heart of Nairobi, our Eagle Shop provides professional health services to support your journey.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 bg-jade-600 hover:bg-jade-700 text-white px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-slate-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? 'scale(1)' : 'scale(1.1)',
              transitionProperty: 'opacity, transform',
              zIndex: i === index ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10" />
      </div>

      <div className="absolute top-1/3 -left-32 w-72 h-72 bg-jade-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-56 h-56 bg-cobalt-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-jade-300 mb-6">
            {SHOP_CONFIG.tagline}
          </p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] mb-5 text-balance">
            BF SUMA Nairobi{' '}
            <span className="text-jade-400">Eagle Shop</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed mb-10 max-w-md">
            Beyond supplements, we are a wellness hub. Located at the heart of Nairobi, our Eagle Shop provides professional health services to support your journey.
          </p>

          <Link
            to="/about"
            className="inline-flex items-center justify-center gap-2 bg-jade-600 hover:bg-jade-700 text-white px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all"
          >
            Learn More
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="p-3 -m-3"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className={`block transition-all duration-500 rounded-full ${
              i === index
                ? 'w-8 h-1.5 bg-jade-400'
                : 'w-1.5 h-1.5 bg-white/40'
            }`} />
          </button>
        ))}
      </div>
    </section>
  )
}
