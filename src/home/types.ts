export type MaterialCategory =
  | 'all'
  | 'plastics'
  | 'chemicals'
  | 'metals'
  | 'textiles'
  | 'organic'

export type TagColor = 'polymer' | 'metal' | 'chemical' | 'paper' | 'wood' | 'textile'

export interface ListingSpec {
  label: string
  value: string
  highlight?: boolean
}

export interface Seller {
  name: string
  location: string
  rating: number
  reviewCount: number
  reliabilityScore: number
  responseTime: string
}

export interface SimilarListing {
  id: string
  title: string
  location: string
  price: string
  purity: string
  status: 'Bulk' | 'Verified' | 'Auction'
  image: string
}

export interface Listing {
  id: string
  title: string
  category: Exclude<MaterialCategory, 'all'>
  tag: string
  tagColor: TagColor
  distanceKm: number
  quantity: string
  price: string
  company: string
  image: string
  images: string[]
  aiVerified: boolean
  breadcrumb: string[]
  location: string
  pricePerUnit: string
  minOrder: string
  availableAmount: number
  availableUnit: string
  shippingTerms: string
  leadTime: string
  origin: string
  specs: ListingSpec[]
  aiSummary: string
  seller: Seller
  similar: SimilarListing[]
}
