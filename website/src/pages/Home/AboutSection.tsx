import { SHOP_CONFIG } from '@/config/shop.config'
import SectionIntro from '@/components/ui/SectionIntro'
import Reveal, { FloatingSurface, floatingSurfaceClass } from '@/components/ui/Reveal'

const stats = [
  { value: '50+', label: 'Products', accent: 'text-jade-600' },
  { value: '10k+', label: 'Customers', accent: 'text-citrus-600' },
  { value: '4.9', label: 'Rating', accent: 'text-jade-600' },
]

export default function AboutSection() {
  return (
    <section className="py-16 md:py-28 relative overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#D1FAE5_0%,_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#FEDDC2_0%,_transparent_55%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal variant="scale" className="w-full">
            <div className={`relative aspect-video overflow-hidden ${floatingSurfaceClass}`}>
              <iframe
                src="https://www.youtube.com/embed/TkFIWRr2sN8?modestbranding=1&rel=0"
                title="BF SUMA Eagle Shop"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </Reveal>

          <div>
            <SectionIntro
              variant="withTag"
              tag="Our Story"
              title="Elevate Your Vitality with Nature's Best"
              subtitle={SHOP_CONFIG.heroSubtitle}
              align="left"
              className="text-left"
            />

            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <FloatingSurface
                  key={stat.label}
                  className="p-5 text-center"
                >
                  <p className={`text-2xl font-bold font-mono ${stat.accent}`}>{stat.value}</p>
                  <p className="text-[10px] text-muted-500 uppercase tracking-widest mt-1.5">
                    {stat.label}
                  </p>
                </FloatingSurface>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
