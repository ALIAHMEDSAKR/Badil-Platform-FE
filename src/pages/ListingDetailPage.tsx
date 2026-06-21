import { useParams } from 'react-router-dom'
import { ProductDetailRoute } from '../home/ProductDetailPage'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  return <ProductDetailRoute id={id ?? ''} />
}
