import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import SEOHead from '@/components/seo/SEOHead'
import BranchCard from '@/components/ui/BranchCard'
import { useBranches } from '@/hooks/useBranches'

export default function Branches() {
  const { data: branches = [] } = useBranches()
  const [search, setSearch] = useState('')

  const q = search.toLowerCase().trim()
  const filtered = q
    ? branches.filter(
        b =>
          b.name?.toLowerCase().includes(q) ||
          b.address?.toLowerCase().includes(q) ||
          b.phone?.toLowerCase().includes(q) ||
          b.email?.toLowerCase().includes(q)
      )
    : branches

  return (
    <div className="min-h-screen bg-surface">
      <SEOHead
        title="Our Locations — BF SUMA Eagle Shop Branches in Kenya"
        description="Visit BF SUMA Eagle Shop at our Nairobi locations. Find directions, contact information, and opening hours for all our branches. Premium health supplements at Utumishi House."
      />
      <section className="pt-28 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Our Branches"
            subtitle="Visit us at any of our locations across the country."
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
            <>
              <div className="relative max-w-md mx-auto mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, address, or contact..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-surface-border rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-jade-400 transition-colors"
                />
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-sm text-slate-500">No branches matching &quot;{search}&quot;</p>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {filtered.map(branch => (
                    <motion.div
                      key={branch.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
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
            </>
          )}
        </div>
      </section>
    </div>
  )
}
