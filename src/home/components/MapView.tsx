import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Listing } from '../types'

interface MapViewProps {
  listings: Listing[]
}

export function MapView({ listings }: MapViewProps) {
  if (listings.length === 0) {
    return (
      <div className="home-map-placeholder">
        No listings within your search radius. Try increasing the radius or changing filters.
      </div>
    )
  }

  return (
    <div className="home-map-view">
      <div className="home-map-view__canvas" aria-hidden>
        <div className="home-map-view__grid" />
        {listings.map((listing, i) => {
          const positions = [
            { top: '28%', left: '22%' },
            { top: '45%', left: '58%' },
            { top: '62%', left: '35%' },
            { top: '35%', left: '72%' },
            { top: '70%', left: '68%' },
            { top: '50%', left: '15%' },
          ]
          const pos = positions[i % positions.length]
          return (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="home-map-pin"
              style={{ top: pos.top, left: pos.left }}
              title={listing.title}
            >
              <MapPin size={14} aria-hidden />
              <span className="home-map-pin__label">{listing.distanceKm}km</span>
            </Link>
          )
        })}
      </div>
      <ul className="home-map-list">
        {listings.map((listing) => (
          <li key={listing.id}>
            <Link to={`/listing/${listing.id}`} className="home-map-list__item">
              <img src={listing.image} alt="" className="home-map-list__thumb" />
              <div>
                <div className="home-map-list__title">{listing.title}</div>
                <div className="home-map-list__meta">
                  {listing.location} • {listing.distanceKm}km away
                </div>
              </div>
              <span className="home-map-list__price">{listing.price}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
