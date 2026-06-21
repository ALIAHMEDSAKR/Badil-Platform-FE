import { Search, SlidersHorizontal } from 'lucide-react'

interface SearchBarProps {
  query: string
  onQueryChange: (value: string) => void
  radiusKm: number
  onRadiusChange: (value: number) => void
  showFilters: boolean
  onToggleFilters: () => void
  verifiedOnly: boolean
  onVerifiedOnlyChange: (value: boolean) => void
  sortBy: 'distance' | 'price'
  onSortByChange: (value: 'distance' | 'price') => void
}

export function SearchBar({
  query,
  onQueryChange,
  radiusKm,
  onRadiusChange,
  showFilters,
  onToggleFilters,
  verifiedOnly,
  onVerifiedOnlyChange,
  sortBy,
  onSortByChange,
}: SearchBarProps) {
  return (
    <div className="home-search-section">
      <div className="home-search-row">
        <div className="home-search">
          <Search size={18} color="#5c7674" aria-hidden />
          <input
            type="search"
            className="home-search__input"
            placeholder="Search materials, companies, or locations..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search materials"
          />
          <span className="home-search__badge">AI SEMANTIC</span>
        </div>

        <div className="home-radius">
          <span className="home-radius__label">Search Radius</span>
          <div className="home-radius__control">
            <input
              type="range"
              className="home-radius__slider"
              min={5}
              max={100}
              step={5}
              value={radiusKm}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              aria-label="Search radius in kilometers"
            />
            <span className="home-radius__value">{radiusKm} km</span>
          </div>
        </div>

        <button
          type="button"
          className={`home-filter-btn${showFilters ? ' home-filter-btn--active' : ''}`}
          aria-label="Advanced filters"
          aria-expanded={showFilters}
          onClick={onToggleFilters}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="home-advanced-filters">
          <label className="home-filter-check">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
            />
            AI Verified only
          </label>
          <div className="home-filter-sort">
            <span className="home-filter-sort__label">Sort by</span>
            <select
              className="home-filter-sort__select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'distance' | 'price')}
            >
              <option value="distance">Distance (nearest)</option>
              <option value="price">Price (lowest)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
