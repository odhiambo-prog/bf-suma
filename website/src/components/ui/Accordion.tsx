import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      )
    } else {
      setOpenIndexes(prev =>
        prev.includes(index) ? [] : [index]
      )
    }
  }

  return (
    <div className="divide-y divide-surface-border border-y border-surface-border">
      {items.map((item, i) => {
        const isOpen = openIndexes.includes(i)
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className={cn(
                'w-full flex items-center justify-between py-5 text-left group rounded-xl transition-colors',
                isOpen ? 'px-4 bg-jade-50/40' : 'px-0 hover:px-4 hover:bg-surface-subtle',
              )}
            >
              <span className={cn(
                'text-sm font-semibold transition-colors pr-4',
                isOpen ? 'text-jade-800' : 'text-ink group-hover:text-jade-700'
              )}>
                {item.question}
              </span>
              <span className={cn(
                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors',
                isOpen ? 'bg-jade-600 text-white' : 'bg-surface-subtle text-muted-400 group-hover:text-jade-600',
              )}>
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform duration-300',
                  isOpen && 'rotate-180',
                )} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-muted-600 leading-relaxed pb-6 pr-12 pl-4">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
