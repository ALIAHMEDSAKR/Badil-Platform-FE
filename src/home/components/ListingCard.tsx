import { Link } from 'react-router-dom'
import { Bookmark, BadgeCheck, Sparkles } from 'lucide-react'
import type { Listing } from '../types'

interface ListingCardProps {
  listing: Listing
  saved: boolean
  onToggleSave: (id: string) => void
}

export function ListingCard({ listing, saved, onToggleSave }: ListingCardProps) {
  const initials = listing.company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <article className="home-card">
      <div className="home-card__image-wrap">
        <Link to={`/listing/${listing.id}`} className="home-card__image-link">
          <img
            src={listing.image}
            alt={listing.title}
            className="home-card__image"
            loading="lazy"
          />
        </Link>
        {listing.aiVerified && (
          <span className="home-card__verified">
            <BadgeCheck size={12} aria-hidden />
            AI Verified
          </span>
        )}
        <button
          type="button"
          className={`home-card__bookmark${saved ? ' home-card__bookmark--saved' : ''}`}
          onClick={() => onToggleSave(listing.id)}
          aria-label={saved ? 'Remove bookmark' : 'Bookmark listing'}
          aria-pressed={saved}
        >
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="home-card__body">
        <Link to={`/listing/${listing.id}`} className="home-card__title-link">
          <h2 className="home-card__title">{listing.title}</h2>
        </Link>

        <div className="home-card__meta">
          <span className={`home-card__tag home-card__tag--${listing.tagColor}`}>
            {listing.tag}
          </span>
          <span className="home-card__distance">• {listing.distanceKm}km away</span>
        </div>

        <div className="home-card__stats">
          <div className="home-card__stat">
            <div className="home-card__stat-label">Quantity</div>
            <div className="home-card__stat-value">{listing.quantity}</div>
          </div>
          <div className="home-card__stat">
            <div className="home-card__stat-label">Est. Price</div>
            <div className="home-card__stat-value">
              <Sparkles size={11} color="#4fd1c5" aria-hidden />
              {listing.price}
            </div>
          </div>
        </div>

        <div className="home-card__footer">
          <div className="home-card__company">
            <span className="home-card__company-avatar" aria-hidden>
              {initials}
            </span>
            {listing.company}
          </div>
          <Link to={`/listing/${listing.id}`} className="home-card__details">
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
