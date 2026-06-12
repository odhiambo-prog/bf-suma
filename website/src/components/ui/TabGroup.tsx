import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabGroupProps {
  tabs: string[]
  activeTab: string
  onChange: (tab: string) => void
}

export default function TabGroup({ tabs, activeTab, onChange }: TabGroupProps) {
  return (
    <div className="inline-flex border border-surface-border divide-x divide-surface-border">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'relative px-5 py-3 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors',
            activeTab === tab
              ? 'text-jade-700 bg-jade-50'
              : 'text-slate-500 hover:text-slate-800 bg-white'
          )}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="tab-bg"
              className="absolute inset-0 bg-jade-50"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  )
}
