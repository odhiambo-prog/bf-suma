import { useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import Accordion from '@/components/ui/Accordion'
import TabGroup from '@/components/ui/TabGroup'
import { useFAQ } from '@/hooks/useFAQ'

export default function FAQ() {
  const [category, setCategory] = useState('All')
  const { data: faqs = [], isLoading } = useFAQ(
    category === 'All' ? undefined : category
  )

  const categories = ['All', ...new Set(faqs.map(f => f.category))]

  const filtered =
    category === 'All'
      ? faqs
      : faqs.filter(f => f.category === category)

  const accordionItems = filtered.map(f => ({
    question: f.question,
    answer: f.answer,
  }))

  return (
    <div className="pt-28 min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-6 pb-28">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our products, services, and distributor program."
          eyebrow="Got Questions?"
        />

        {categories.length > 1 && (
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <TabGroup
              tabs={categories}
              activeTab={category}
              onChange={setCategory}
            />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white h-14 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <Accordion items={accordionItems} />
        )}
      </div>
    </div>
  )
}
