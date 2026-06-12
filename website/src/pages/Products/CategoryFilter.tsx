import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onChange: (category: string) => void
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase border transition-colors',
            selected === cat
              ? 'bg-jade-800 text-white font-bold border-jade-800 ring-2 ring-jade-300'
              : 'bg-white text-slate-700 border-surface-border hover:border-jade-300 hover:text-jade-600'
          )}
        >
          {cat === 'All' ? 'All Products' : cat}
        </button>
      ))}
    </div>
  )
}
