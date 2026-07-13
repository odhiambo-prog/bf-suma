import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onChange: (category: string) => void
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-full">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'px-4 py-2.5 text-xs font-semibold tracking-wide rounded-full transition-colors',
            selected === cat
              ? 'bg-jade-600 text-white'
              : 'bg-white text-muted-600 border border-surface-border hover:border-jade-300 hover:text-jade-700'
          )}
        >
          {cat === 'All' ? 'All Products' : cat}
        </button>
      ))}
    </div>
  )
}
