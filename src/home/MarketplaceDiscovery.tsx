import { useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { MarketplaceHeader } from './components/MarketplaceHeader'
import { SearchBar } from './components/SearchBar'
import { CategoryFilters } from './components/CategoryFilters'
import { ListingsGrid } from './components/ListingsGrid'
import { MapView } from './components/MapView'
import { AiInsightToast } from './components/AiInsightToast'
import { mockListings } from './mockListings'
import { useSavedListings } from './hooks/useSavedListings'
import type { MaterialCategory } from './types'
import './home.css'

type ViewMode = 'list' | 'map'

function parsePrice(price: string): number {
  const match = price.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : Infinity
}

export function MarketplaceDiscovery() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [query, setQuery] = useState('')
  const [radiusKm, setRadiusKm] = useState(50)
  const [category, setCategory] = useState<MaterialCategory>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'distance' | 'price'>('distance')
  const [toastVisible, setToastVisible] = useState(true)
  const { savedIds, toggleSave } = useSavedListings()

  const filteredListings = useMemo(() => {
    const q = query.trim().toLowerCase()
    const results = mockListings.filter((listing) => {
      const matchesCategory = category === 'all' || listing.category === category
      const matchesRadius = listing.distanceKm <= radiusKm
      const matchesQuery =
        !q ||
        listing.title.toLowerCase().includes(q) ||
        listing.company.toLowerCase().includes(q) ||
        listing.tag.toLowerCase().includes(q) ||
        listing.location.toLowerCase().includes(q)
      const matchesVerified = !verifiedOnly || listing.aiVerified
      return matchesCategory && matchesRadius && matchesQuery && matchesVerified
    })

    return [...results].sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm
      return parsePrice(a.price) - parsePrice(b.price)
    })
  }, [query, radiusKm, category, verifiedOnly, sortBy])

  function handleAiInsight() {
    setQuery('HDPE')
    setCategory('plastics')
    setToastVisible(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="home-app">
      <Sidebar />

      <div className="home-main">
        <div className="home-content">
          <MarketplaceHeader viewMode={viewMode} onViewModeChange={setViewMode} />
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            radiusKm={radiusKm}
            onRadiusChange={setRadiusKm}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((v) => !v)}
            verifiedOnly={verifiedOnly}
            onVerifiedOnlyChange={setVerifiedOnly}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
          <CategoryFilters selected={category} onSelect={setCategory} />

          {viewMode === 'list' ? (
            <ListingsGrid
              listings={filteredListings}
              savedIds={savedIds}
              onToggleSave={toggleSave}
            />
          ) : (
            <MapView listings={filteredListings} />
          )}
        </div>
      </div>

      <AiInsightToast onClick={handleAiInsight} visible={toastVisible} />
    </div>
  )
}
