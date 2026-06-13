import { motion } from 'framer-motion'
import { SHOP_CONFIG } from '@/config/shop.config'

export default function AboutSection() {
  return (
    <section className="py-28 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/40 to-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#fef3c7_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#fde68a/20_0%,_transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full"
          >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/20 border border-amber-200/50 bg-amber-100">
                <iframe
                  src="https://www.youtube.com/embed/TkFIWRr2sN8?modestbranding=1&rel=0"
                  title="BF SUMA Eagle Shop"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-700 mb-5">
              Leading Pharmaceutical Company in the World
            </p>

            <h2 className="font-display text-4xl sm:text-5xl text-slate-900 leading-[1.15] mb-6 text-balance">
              Elevate Your{' '}
              <span className="text-amber-600">Vitality</span>
              {' '}with Nature's Best
            </h2>

            <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-md">
              {SHOP_CONFIG.heroSubtitle}
            </p>



            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-slate-900 font-mono">50+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Products</p>
              </div>
              <div className="w-px h-8 bg-amber-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900 font-mono">10k+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Customers</p>
              </div>
              <div className="w-px h-8 bg-amber-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900 font-mono">4.9</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
