import { motion } from 'framer-motion'
import { Heart, Shield, Users, Lightbulb } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import BranchCard from './BranchCard'
import { useBranches } from '@/hooks/useBranches'

const values = [
  { icon: Heart, title: 'Integrity', desc: 'We uphold the highest standards of honesty and transparency in everything we do.' },
  { icon: Shield, title: 'Quality', desc: 'Every product meets rigorous quality standards before reaching our customers.' },
  { icon: Users, title: 'Community', desc: 'Building a supportive network of health-conscious individuals and entrepreneurs.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Continuously researching and bringing the latest wellness innovations to Nairobi.' },
]

export default function About() {
  const { data: branches = [] } = useBranches()

  return (
    <div className="pt-28 min-h-screen bg-surface">
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Our Vision & Mission"
            subtitle="Empowering Nairobi to embrace wellness through premium supplements and professional health services."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-surface-border bg-white p-8"
            >
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-cobalt-600 mb-4">01</p>
              <h3 className="font-display text-xl text-slate-900 mb-4">Our Vision</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To be Nairobi's most trusted wellness destination, transforming lives through premium nutritional supplements and holistic health services that are accessible to everyone.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-surface-border bg-white p-8"
            >
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-cobalt-600 mb-4">02</p>
              <h3 className="font-display text-xl text-slate-900 mb-4">Our Mission</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To provide science-backed health solutions, personalized wellness guidance, and a supportive community that empowers individuals to take control of their health and achieve optimal vitality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-28 bg-surface-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Our Values" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-surface-border p-8"
                >
                  <Icon className="w-8 h-8 text-jade-600 mb-6" strokeWidth={1.5} />
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{value.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Our Branches" subtitle="Visit us at any of our locations across Nairobi." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map(branch => (
              <BranchCard
                key={branch.id}
                name={branch.name}
                address={branch.address}
                maps_embed_url={branch.maps_embed_url}
                maps_link={branch.maps_link}
                phone={branch.phone}
                email={branch.email}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
