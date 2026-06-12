import { motion } from 'framer-motion'
import { ArrowUpRight, Activity, Coffee, Award } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

const items = [
  {
    title: 'Wellness Center',
    desc: 'Professional full-body screenings and personalized health consultations.',
    icon: Activity,
    img: '/images/WhatsApp Image 2026-06-09 at 14.09.11.jpeg',
  },
  {
    title: 'Eagle Bistro',
    desc: 'Enjoy our signature Cordyceps and Reishi functional coffees in a relaxing space.',
    icon: Coffee,
    img: '/images/WhatsApp Image 2026-06-09 at 14.09.13.jpeg',
  },
  {
    title: 'Training Hub',
    desc: 'Daily training sessions for distributors and product knowledge workshops.',
    icon: Award,
    img: '/images/WhatsApp Image 2026-06-09 at 14.09.14 (3).jpeg',
  },
]

export default function AboutSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="BFSUMA Nairobi Eagle Shop"
          subtitle="Beyond supplements, we are a wellness hub. Located at the heart of Nairobi, our Eagle Shop provides professional health services to support your journey."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group relative border border-surface-border bg-white hover:bg-surface-subtle transition-colors"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <Icon className="w-8 h-8 text-jade-600 mb-5" strokeWidth={1.5} />
                  <h3 className="font-display text-xl text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{item.desc}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-jade-600 group-hover:gap-3 transition-all">
                    Learn More <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
