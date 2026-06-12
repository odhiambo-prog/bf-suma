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
    <div className="divide-y divide-surface-border border-t border-surface-border">
      {items.map((item, i) => {
        const isOpen = openIndexes.includes(i)
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between py-5 text-left group"
            >
              <span className={cn(
                'text-sm font-medium transition-colors pr-4',
                isOpen ? 'text-jade-700' : 'text-slate-800 group-hover:text-jade-600'
              )}>
                {item.question}
              </span>
              <ChevronDown className={cn(
                'w-4 h-4 flex-shrink-0 transition-transform duration-200',
                isOpen ? 'rotate-180 text-jade-600' : 'text-slate-400'
              )} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-slate-500 leading-relaxed pb-6 pr-12">
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
