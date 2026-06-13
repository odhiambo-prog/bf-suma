import { motion } from 'framer-motion'
import Carousel from '@/components/ui/Carousel'
import { Link } from 'react-router-dom'
import { SHOP_CONFIG } from '@/config/shop.config'

const heroImages = [
  '/images/herosection/1.jpeg',
  '/images/herosection/2.jpeg',
  '/images/herosection/3.jpeg',
  '/images/herosection/4.jpeg',
  '/images/herosection/5.jpeg',
  '/images/herosection/6.jpeg',
  '/images/herosection/7.jpeg',
  '/images/herosection/9.jpeg',
  '/images/herosection/10.jpeg',
]

export default function HeroSection() {
  const carouselSlides = heroImages.map(src => (
    <div className="relative w-full h-full min-h-[100dvh]">
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  ))

  return (
    <section className="relative h-screen flex overflow-hidden">
      <div className="w-full lg:w-1/2 relative flex items-center bg-slate-900 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-jade-950" />
        <div className="absolute top-1/3 -right-32 w-64 h-64 bg-jade-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-48 h-48 bg-cobalt-600/10 rounded-full blur-3xl" />

        <div className="max-w-xl mx-auto px-8 md:px-12 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-jade-300 mb-6">
              {SHOP_CONFIG.tagline}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] mb-5 text-balance">
              BFSUMA Nairobi{' '}
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
      </div>

      <div className="hidden lg:block w-1/2 relative bg-slate-900">
        <Carousel
          slides={carouselSlides}
          autoPlay
          showArrows={false}
          showDots={false}
          className="absolute inset-0"
        />
      </div>

      <div className="lg:hidden absolute inset-0">
        <Carousel
          slides={carouselSlides}
          autoPlay
          showArrows={false}
          showDots={false}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-slate-900/40" />
      </div>
    </section>
  )
}
