import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Bookmark, ArrowLeft, RefreshCw } from 'lucide-react';
import { wasteListingApi } from '../api/wasteListingApi';
import type { WasteListingDto } from '../types/wasteListing';
import { cn } from '../utils/cn';

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<WasteListingDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const data = await wasteListingApi.getById(id);
        setListing(data);
        setError('');
      } catch (e) {
        console.error(e);
        setError('Failed to load listing details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2dd4bf]" />
        <p className="text-sm text-gray-400 mt-4">Loading listing details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p className="mb-4">{error}</p>
        <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Listing not found.</p>
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => (window.history.back())}>
          Back
        </Button>
      </div>
    );
  }

  const tag = getMaterialTag(listing.materialType);
  const isVerified = listing.status === 'Available';

  function getMaterialTag(materialType: string) {
    const lower = materialType.toLowerCase();
    if (lower.includes('plastic') || lower.includes('polymer') || lower.includes('pet') || lower.includes('hdpe')) {
      return { label: 'Polymer', color: 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/25' };
    }
    if (lower.includes('metal') || lower.includes('aluminum') || lower.includes('steel')) {
      return { label: 'Metal', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' };
    }
    if (lower.includes('chemical') || lower.includes('acid') || lower.includes('solvent')) {
      return { label: 'Chemical', color: 'bg-purple-500/15 text-purple-400 border-purple-500/25' };
    }
    if (lower.includes('paper') || lower.includes('cardboard') || lower.includes('occ')) {
      return { label: 'Paper', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' };
    }
    if (lower.includes('wood') || lower.includes('pallet')) {
      return { label: 'Wood', color: 'bg-orange-500/15 text-orange-400 border-orange-500/25' };
    }
    if (lower.includes('textile') || lower.includes('fabric') || lower.includes('cotton')) {
      return { label: 'Textile', color: 'bg-pink-500/15 text-pink-400 border-pink-500/25' };
    }
    return { label: materialType, color: 'bg-gray-700/30 text-gray-400 border-gray-600/25' };
  }

  return (
    <div className="animate-fade-up max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white dashboard-title">{listing.materialType || 'Listing Details'}</h1>
        <Button variant="ghost" leftIcon={<Bookmark className="w-4 h-4" />}>Save</Button>
      </div>

      {/* Image */}
      {listing.imageUrls?.[0] && (
        <div className="relative h-64 rounded-xl overflow-hidden">
          <img src={listing.imageUrls[0]} alt={listing.materialType} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Tags and Status */}
      <div className="flex items-center gap-4">
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', tag.color)}>{tag.label}</span>
        {isVerified && (
          <Badge variant="teal" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>AI Verified</Badge>
        )}
      </div>

      {/* Details Card */}
      <Card className="dashboard-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Quantity</h3>
            <p className="text-lg font-semibold text-white">{listing.quantity}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Estimated Price</h3>
            <p className="text-lg font-semibold text-white">
              {listing.suggestedPrice ? `$${listing.suggestedPrice.toLocaleString()}` : 'Negotiable'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-gray-300">{listing.description}</p>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>Contact Seller</Button>
        <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>
    </div>
  );
}
