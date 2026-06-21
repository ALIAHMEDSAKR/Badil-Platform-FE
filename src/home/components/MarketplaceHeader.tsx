import { List, Map } from 'lucide-react'

type ViewMode = 'list' | 'map'

interface MarketplaceHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function MarketplaceHeader({ viewMode, onViewModeChange }: MarketplaceHeaderProps) {
  return (
    <header className="home-header">
      <div>
        <h1 className="home-header__title">Marketplace Discovery</h1>
        <p className="home-header__subtitle">
          Find valuable resources from industrial partners near you.
        </p>
      </div>

      <div className="home-view-toggle" role="group" aria-label="View mode">
        <button
          type="button"
          className={`home-view-toggle__btn${viewMode === 'list' ? ' home-view-toggle__btn--active' : ''}`}
          onClick={() => onViewModeChange('list')}
          aria-pressed={viewMode === 'list'}
        >
          <List size={15} aria-hidden />
          List
        </button>
        <button
          type="button"
          className={`home-view-toggle__btn${viewMode === 'map' ? ' home-view-toggle__btn--active' : ''}`}
          onClick={() => onViewModeChange('map')}
          aria-pressed={viewMode === 'map'}
        >
          <Map size={15} aria-hidden />
          Map
        </button>
      </div>
    </header>
  )
}
