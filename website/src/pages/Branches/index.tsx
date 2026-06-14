import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import BranchCard from '@/components/ui/BranchCard'
import { useBranches } from '@/hooks/useBranches'

export default function Branches() {
  const { data: branches = [] } = useBranches()

  return (
    <div className="min-h-screen bg-surface">
      <section className="pt-28 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Our Branches"
            subtitle="Visit us at any of our locations across Nairobi."
          />
        </div>
      </section>

      <section className="py-16 bg-surface-subtle">
        <div className="max-w-7xl mx-auto px-6">
          {branches.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-slate-500">No branches listed yet.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {branches.map(branch => (
                <motion.div
                  key={branch.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                  }}
                >
                  <BranchCard
                    name={branch.name}
                    address={branch.address}
                    maps_embed_url={branch.maps_embed_url}
                    maps_link={branch.maps_link}
                    phone={branch.phone}
                    email={branch.email}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
