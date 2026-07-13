import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { SHOP_CONFIG } from '@/config/shop.config'
import { useHeroCarousel } from '@/hooks/useHeroCarousel'
import { wordReveal, stagger } from '@/lib/motion'
import { ButtonLink } from '@/components/ui/Button'

const HEADLINE = ['BF', 'SUMA', 'Nairobi', 'Eagle', 'Shop']

export default function HeroSection() {
  const reduce = useReducedMotion() ?? false
  const { data: slides = [], isLoading } = useHeroCarousel()
  const safeSlides = Array.isArray(slides) ? slides : []
  const heroImages = safeSlides.map((s) => s.image_url)

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const total = heroImages.length

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total)
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [paused, total])

  const goTo = (i: number) => setIndex(i)

  const sectionRef = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 18 })
  const sy = useSpring(my, { stiffness: 50, damping: 18 })
  const glow = useMotionTemplate`radial-gradient(560px circle at ${sx}px ${sy}px, rgba(249,115,22,0.18), transparent 42%)`

  const handlePointerMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  if (isLoading || total === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative min-h-[100dvh] flex items-center overflow-hidden bg-ink"
        onMouseMove={handlePointerMove}
      >
        <div className="absolute inset-0 bg-ink animate-pulse" />
        {!reduce && (
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-70"
            style={{ background: glow }}
          />
        )}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-citrus-300 mb-6">
              {SHOP_CONFIG.tagline}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] mb-5 text-balance">
              BF SUMA Nairobi{' '}
              <span className="text-jade-400">Eagle Shop</span>
            </h1>
            <p className="text-sm text-white/70 leading-relaxed mb-10 max-w-md">
              Beyond supplements, we are a wellness hub. Located at the heart of Nairobi, our Eagle Shop provides professional health services to support your journey.
            </p>
            <ButtonLink to="/about" variant="primary" size="lg">
              Learn More
            </ButtonLink>
          </motion.div>
        </div>
        <ScrollCue reduce={reduce} />
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={handlePointerMove}
    >
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="BF SUMA Eagle Shop hero banner showcasing premium health supplements"
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

      {!reduce && (
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{ background: glow }}
        />
      )}

      <motion.div
        className={reduce ? '' : 'animate-spin-slow'}
        style={{ animationDuration: '26s' }}
      >
        <div className="absolute top-1/4 -left-24 w-72 h-72 rounded-full bg-citrus-500/15 blur-3xl pointer-events-none" />
      </motion.div>
      <motion.div
        className={reduce ? '' : 'animate-spin-slow'}
        style={{ animationDuration: '32s', animationDirection: 'reverse' }}
      >
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-jade-500/20 blur-3xl pointer-events-none" />
      </motion.div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-citrus-300 mb-6"
          >
            {SHOP_CONFIG.tagline}
          </motion.p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] mb-5 text-balance">
            <motion.span
              className="inline-block"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {HEADLINE.map((word, i) => (
                <motion.span
                  key={word}
                  variants={wordReveal(reduce)}
                  className={`inline-block mr-[0.25em] ${i >= 3 ? 'text-jade-300' : 'text-white'}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          </h1>

          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm text-white/70 leading-relaxed mb-10 max-w-md"
          >
            Beyond supplements, we are a wellness hub. Located at the heart of Nairobi, our Eagle Shop provides professional health services to support your journey.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <ButtonLink to="/about" variant="primary" size="lg">
              Learn More
            </ButtonLink>
          </motion.div>
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
                ? 'w-8 h-1.5 bg-citrus-400'
                : 'w-1.5 h-1.5 bg-white/40'
            }`} />
          </button>
        ))}
      </div>

      <ScrollCue reduce={reduce} />
    </section>
  )
}

function ScrollCue({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      className="absolute bottom-8 right-6 z-20 hidden sm:flex flex-col items-center gap-2 text-white/50"
      initial={reduce ? { opacity: 0 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <span className="text-[10px] font-semibold tracking-[0.18em] uppercase">Scroll</span>
      <motion.span
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown className="w-4 h-4" />
      </motion.span>
    </motion.div>
  )
}
