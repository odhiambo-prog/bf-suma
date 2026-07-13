import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabGroupProps {
  tabs: string[]
  activeTab: string
  onChange: (tab: string) => void
  className?: string
  /** Namespace for the shared-layout pill so multiple groups don't collide. */
  id?: string
}

export default function TabGroup({ tabs, activeTab, onChange, className, id }: TabGroupProps) {
  return (
    <div className={cn('inline-flex flex-wrap justify-center gap-1.5 p-1.5 bg-surface-subtle rounded-full border border-surface-border', className)}>
      {tabs.map(tab => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              'relative px-5 py-2.5 text-xs font-semibold rounded-full transition-colors duration-300',
              isActive ? 'text-white' : 'text-muted-500 hover:text-ink'
            )}
          >
            {isActive && (
              <motion.span
                layoutId={id ? id + '-tab-pill' : 'tab-pill'}
                className="absolute inset-0 bg-jade-600 rounded-full shadow-[0_8px_20px_-8px_rgba(5,150,105,0.7)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        )
      })}
    </div>
  )
}
