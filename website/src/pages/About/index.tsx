import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'

const values = [
  { title: 'Integrity', desc: 'We uphold the highest standards of honesty and transparency in everything we do.' },
  { title: 'Quality', desc: 'Every product meets rigorous quality standards before reaching our customers.' },
  { title: 'Community', desc: 'Building a supportive network of health-conscious individuals and entrepreneurs.' },
  { title: 'Innovation', desc: 'Continuously researching and bringing the latest wellness innovations to Nairobi.' },
]

const team = [
  { name: 'Grace Akinyi', role: 'General Manager', initials: 'GA' },
  { name: 'Peter Kamau', role: 'Operations Lead', initials: 'PK' },
  { name: 'Faith Wanjiku', role: 'Wellness Consultant', initials: 'FW' },
  { name: 'James Ochieng', role: 'Distributor Relations', initials: 'JO' },
  { name: 'Sarah Nyambura', role: 'Marketing Coordinator', initials: 'SN' },
  { name: 'David Mwangi', role: 'Training & Development', initials: 'DM' },
]

export default function About() {

  return (
    <div className="min-h-screen bg-surface">
      <section className="py-28 relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(/images/aboutusbck.jpg)' }}
        />
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-surface-border bg-white/90 backdrop-blur-sm p-8"
            >
              <h3 className="font-display text-xl text-slate-900 mb-4">Our Vision</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To be Nairobi's most trusted wellness destination, transforming lives through premium nutritional supplements and holistic health services that are accessible to everyone.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-surface-border bg-white/90 backdrop-blur-sm p-8"
            >
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
          <div className="mt-12 -mx-6 sm:mx-0 mb-12">
            <img
              src="/images/about-hero.jpg"
              alt=""
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-surface-border p-8"
              >
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Meet the Team" subtitle="The people behind BF SUMA Nairobi, committed to your wellness journey." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group text-center"
              >
                <div className="relative mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-jade-400 to-cobalt-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xl md:text-2xl font-bold text-white tracking-wide">{member.initials}</span>
                  <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-jade-300 transition-colors duration-300" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{member.name}</h3>
                <p className="text-[11px] text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
