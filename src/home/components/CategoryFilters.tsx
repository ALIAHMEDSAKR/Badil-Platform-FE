import type { MaterialCategory } from '../types'

const categories: { id: MaterialCategory; label: string }[] = [
  { id: 'all', label: 'All Materials' },
  { id: 'plastics', label: 'Plastics' },
  { id: 'chemicals', label: 'Chemicals' },
  { id: 'metals', label: 'Metals' },
  { id: 'textiles', label: 'Textiles' },
  { id: 'organic', label: 'Organic Waste' },
]

interface CategoryFiltersProps {
  selected: MaterialCategory
  onSelect: (category: MaterialCategory) => void
}

export function CategoryFilters({ selected, onSelect }: CategoryFiltersProps) {
  return (
    <div className="home-categories" role="group" aria-label="Material categories">
      {categories.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`home-category-pill${selected === id ? ' home-category-pill--active' : ''}`}
          onClick={() => onSelect(id)}
          aria-pressed={selected === id}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
