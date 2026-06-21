import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  BadgeCheck,
  BarChart3,
  Star,
  Truck,
  Warehouse,
  MapPin,
  ShoppingCart,
  FlaskConical,
  Lock,
  ArrowRight,
  Bookmark,
} from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { getListingById } from './mockListings'
import { useSavedListings } from './hooks/useSavedListings'
import type { Listing, SimilarListing } from './types'
import './home.css'

interface ProductDetailPageProps {
  listing: Listing
}

function SimilarCard({ item }: { item: SimilarListing }) {
  const statusClass =
    item.status === 'Verified'
      ? 'detail-similar__status--verified'
      : item.status === 'Auction'
        ? 'detail-similar__status--auction'
        : 'detail-similar__status--bulk'

  return (
    <Link to={`/listing/${item.id}`} className="detail-similar">
      <div className="detail-similar__image-wrap">
        <img src={item.image} alt={item.title} className="detail-similar__image" />
        <span className="detail-similar__purity">{item.purity}</span>
      </div>
      <div className="detail-similar__body">
        <h3 className="detail-similar__title">{item.title}</h3>
        <p className="detail-similar__location">{item.location}</p>
        <div className="detail-similar__footer">
          <span className="detail-similar__price">{item.price}</span>
          <span className={`detail-similar__status ${statusClass}`}>{item.status}</span>
        </div>
      </div>
    </Link>
  )
}

export function ProductDetailPage({ listing }: ProductDetailPageProps) {
  const navigate = useNavigate()
  const { isSaved, toggleSave } = useSavedListings()
  const [activeImage, setActiveImage] = useState(0)
  const minOrderNum = parseFloat(listing.minOrder.match(/[\d.]+/)?.[0] ?? '1') || 1
  const [selectedAmount, setSelectedAmount] = useState(minOrderNum)
  const saved = isSaved(listing.id)

  const progressPct = (selectedAmount / listing.availableAmount) * 100

  function handleEscrow() {
    navigate('/login', { state: { from: `/listing/${listing.id}`, action: 'escrow' } })
  }

  function handleSample() {
    navigate('/login', { state: { from: `/listing/${listing.id}`, action: 'sample' } })
  }

  return (
    <div className="home-app">
      <Sidebar />

      <div className="home-main">
        <div className="home-content home-content--detail">
          <nav className="detail-breadcrumb" aria-label="Breadcrumb">
            {listing.breadcrumb.map((crumb, i) => (
              <span key={crumb} className="detail-breadcrumb__segment">
                {i > 0 && (
                  <ChevronRight size={14} className="detail-breadcrumb__sep" aria-hidden />
                )}
                {i === listing.breadcrumb.length - 1 ? (
                  <span className="detail-breadcrumb__current">{crumb}</span>
                ) : i === 0 ? (
                  <Link to="/">{crumb}</Link>
                ) : (
                  <button
                    type="button"
                    className="detail-breadcrumb__link"
                    onClick={() => navigate('/')}
                  >
                    {crumb}
                  </button>
                )}
              </span>
            ))}
          </nav>

          <div className="detail-layout">
            <div className="detail-main">
              <div className="detail-gallery">
                <div className="detail-gallery__main">
                  <img
                    src={listing.images[activeImage]}
                    alt={listing.title}
                    className="detail-gallery__image"
                  />
                  <span className="detail-gallery__counter">
                    {activeImage + 1} / {listing.images.length}
                  </span>
                  <button
                    type="button"
                    className={`detail-gallery__bookmark${saved ? ' detail-gallery__bookmark--saved' : ''}`}
                    onClick={() => toggleSave(listing.id)}
                    aria-label={saved ? 'Remove bookmark' : 'Bookmark listing'}
                  >
                    <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="detail-gallery__thumbs">
                  {listing.images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      className={`detail-gallery__thumb${i === activeImage ? ' detail-gallery__thumb--active' : ''}`}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={img} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              <section className="detail-specs">
                <h2 className="detail-section-title">
                  <BarChart3 size={18} aria-hidden />
                  Material Specifications
                </h2>
                <dl className="detail-specs__grid">
                  {listing.specs.map((spec) => (
                    <div key={spec.label} className="detail-specs__item">
                      <dt>{spec.label}</dt>
                      <dd className={spec.highlight ? 'detail-specs__highlight' : undefined}>
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="detail-ai-summary">
                <h2 className="detail-ai-summary__label">AI Analysis Summary</h2>
                <p>{listing.aiSummary}</p>
              </section>

              <section className="detail-seller">
                <div className="detail-seller__avatar" aria-hidden>
                  {listing.seller.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="detail-seller__info">
                  <h3 className="detail-seller__name">{listing.seller.name}</h3>
                  <p className="detail-seller__location">
                    <MapPin size={13} aria-hidden />
                    {listing.seller.location}
                  </p>
                  <div className="detail-seller__rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.floor(listing.seller.rating) ? '#4fd1c5' : 'none'}
                        color="#4fd1c5"
                        aria-hidden
                      />
                    ))}
                    <span>{listing.seller.rating}</span>
                    <button type="button" className="detail-seller__reviews">
                      View {listing.seller.reviewCount} reviews
                    </button>
                  </div>
                  <div className="detail-seller__badges">
                    <span className="detail-seller__badge">
                      Reliability Score{' '}
                      <strong>{listing.seller.reliabilityScore}/100</strong>
                    </span>
                    <span className="detail-seller__badge">
                      Response Time <strong>{listing.seller.responseTime}</strong>
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <aside className="detail-sidebar">
              <div className="detail-purchase">
                <div className="detail-purchase__header">
                  <h1 className="detail-purchase__title">{listing.title}</h1>
                  {listing.aiVerified && (
                    <span className="detail-purchase__verified">
                      <BadgeCheck size={13} aria-hidden />
                      Verified Listing
                    </span>
                  )}
                </div>

                <p className="detail-purchase__price">{listing.pricePerUnit}</p>
                <p className="detail-purchase__min">Min. Order: {listing.minOrder}</p>

                <div className="detail-purchase__slider-section">
                  <div className="detail-purchase__slider-labels">
                    <span>Available: {listing.availableAmount} {listing.availableUnit}</span>
                    <span>
                      Selected: {selectedAmount} {listing.availableUnit}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="detail-purchase__slider"
                    min={minOrderNum}
                    max={listing.availableAmount}
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(Number(e.target.value))}
                    aria-label="Select order quantity"
                  />
                  <div
                    className="detail-purchase__progress"
                    style={{ width: `${progressPct}%` }}
                    aria-hidden
                  />
                </div>

                <ul className="detail-logistics">
                  <li>
                    <Truck size={16} aria-hidden />
                    <span>{listing.shippingTerms}</span>
                  </li>
                  <li>
                    <Warehouse size={16} aria-hidden />
                    <span>{listing.leadTime}</span>
                  </li>
                  <li>
                    <MapPin size={16} aria-hidden />
                    <span>
                      Origin: {listing.origin}{' '}
                      <button type="button" className="detail-logistics__map-link">
                        View on map
                      </button>
                    </span>
                  </li>
                </ul>

                <button type="button" className="detail-cta detail-cta--primary" onClick={handleEscrow}>
                  <ShoppingCart size={18} aria-hidden />
                  Proceed to Escrow / Bulk Buy
                </button>
                <button type="button" className="detail-cta detail-cta--secondary" onClick={handleSample}>
                  <FlaskConical size={18} aria-hidden />
                  Request Sample (1kg)
                </button>

                <p className="detail-escrow-note">
                  <Lock size={13} aria-hidden />
                  Secure Transaction via Badil Escrow
                </p>

                <div className="detail-mini-map" aria-label={`Map showing ${listing.origin}`}>
                  <div className="detail-mini-map__pin">
                    <MapPin size={20} color="#4fd1c5" />
                  </div>
                  <span className="detail-mini-map__label">{listing.origin}</span>
                </div>
              </div>
            </aside>
          </div>

          {listing.similar.length > 0 && (
            <section className="detail-similar-section">
              <div className="detail-similar-section__header">
                <h2>Similar Materials</h2>
                <Link to="/" className="detail-similar-section__view-all">
                  View all <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
              <div className="detail-similar-grid">
                {listing.similar.map((item) => (
                  <SimilarCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProductDetailRoute({ id }: { id: string }) {
  const listing = getListingById(id)

  if (!listing) {
    return (
      <div className="home-app">
        <Sidebar />
        <div className="home-main">
          <div className="home-content home-content--detail">
            <div className="detail-not-found">
              <h1>Listing not found</h1>
              <p>The material you are looking for does not exist or has been removed.</p>
              <Link to="/" className="detail-cta detail-cta--primary">
                Back to Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <ProductDetailPage listing={listing} />
}
