import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Bookmark, ArrowLeft, MessageSquare, ShoppingCart, Beaker, X, Edit } from 'lucide-react';
import { wasteListingApi } from '../api/wasteListingApi';
import { transactionApi } from '../api/transactionApi';
import { useAuthStore } from '../store/authStore';
import type { WasteListingDto } from '../types/wasteListing';
import { cn } from '../utils/cn';

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [listing, setListing] = useState<WasteListingDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [isSaved, setIsSaved] = useState(false);

  // Deal Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [isSampleRequest, setIsSampleRequest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <Button variant="outline" onClick={() => window.location.reload()}>
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
  const isVerified = listing.isVisuallyValidated;

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

  const isOwner = user?.id === listing.userId;

  return (
    <div className="animate-fade-up max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white dashboard-title">{listing.materialType || 'Listing Details'}</h1>
        <Button
          variant="ghost"
          leftIcon={<Bookmark className={cn("w-4 h-4", isSaved && "fill-[#2dd4bf] text-[#2dd4bf]")} />}
          onClick={() => setIsSaved(!isSaved)}
        >
          {isSaved ? "Saved" : "Save"}
        </Button>
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
        <Badge variant={listing.status === "Available" ? "success" : listing.status === "Draft" ? "warning" : "purple"} size="sm">
          {listing.status}
        </Badge>
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
        <div className="mt-6 border-t border-[#1e3a3a] pt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
          <p className="text-gray-300">{listing.description}</p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {isOwner ? (
          <Button
            variant="primary"
            leftIcon={<Edit className="w-4 h-4" />}
            onClick={() => navigate(`/app/listings/edit/${listing.id}`)}
          >
            Edit Listing
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => {
                if (!token) {
                  navigate('/login');
                  return;
                }
                navigate(`/app/messages?user=${listing.userId}`);
              }}
            >
              Contact Seller
            </Button>
            <Button
              variant="primary"
              leftIcon={<ShoppingCart className="w-4 h-4" />}
              onClick={() => {
                if (!token) {
                  navigate('/login');
                  return;
                }
                setIsSampleRequest(false);
                setOfferPrice(listing.suggestedPrice || 0);
                setIsOfferModalOpen(true);
              }}
            >
              Initiate Deal
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Beaker className="w-4 h-4" />}
              onClick={() => {
                if (!token) {
                  navigate('/login');
                  return;
                }
                setIsSampleRequest(true);
                setOfferPrice(0);
                setIsOfferModalOpen(true);
              }}
            >
              Request Sample
            </Button>
          </>
        )}
      </div>

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#112222] border-[#2dd4bf]/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {isSampleRequest ? "Request Sample" : "Initiate Deal"}
              </h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                {isSampleRequest
                  ? "A sample request typically involves minimal cost (e.g. shipping only). Enter your proposed price."
                  : "Enter your initial offer price. The seller can negotiate this in the chat before accepting."}
              </p>

              <Input
                label="Offer Price (USD)"
                type="number"
                min="0"
                step="any"
                value={offerPrice}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
              />

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setIsOfferModalOpen(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  isLoading={isSubmitting}
                  onClick={async () => {
                    if (!listing) return;
                    setIsSubmitting(true);
                    try {
                      const created = await transactionApi.create({
                        listingId: listing.id,
                        sellerId: listing.userId,
                        agreedPrice: offerPrice,
                        isSampleRequest: isSampleRequest
                      });
                      navigate(`/app/transactions/${created.id}`);
                    } catch (e) {
                      console.error("Deal error:", e);
                      alert("Failed to initiate deal.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
