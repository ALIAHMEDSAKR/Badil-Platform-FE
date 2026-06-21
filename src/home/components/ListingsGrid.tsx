import { ListingCard } from './ListingCard'
import type { Listing } from '../types'

interface ListingsGridProps {
  listings: Listing[]
  savedIds: Set<string>
  onToggleSave: (id: string) => void
}

export function ListingsGrid({ listings, savedIds, onToggleSave }: ListingsGridProps) {
  if (listings.length === 0) {
    return (
      <div className="home-grid home-grid--empty">
        No materials match your search. Try adjusting filters or radius.
      </div>
    )
  }

  return (
    <div className="home-grid">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          saved={savedIds.has(listing.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  )
}
