// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Marketplace Discovery Page
// Wired to: wasteListingApi.getAll()
// Uses: Card, Badge, Button, Input atomic components
// Matches: screen3.png (Marketplace Discovery)
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutGrid,
  Map,
  SlidersHorizontal,
  ShieldCheck,
  Bookmark,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { wasteListingApi } from '../api/wasteListingApi';
import type { WasteListingDto } from '../types/wasteListing';
import { ListingStatus } from '../types/enums';
import { cn } from '../utils/cn';

// ── Category Filters ───────────────────────────────────────────────

const categories = [
  'All Materials',
  'Plastics',
  'Chemicals',
  'Metals',
  'Textiles',
  'Organic Waste',
] as const;

type Category = (typeof categories)[number];

// ── Material Tag Colors ────────────────────────────────────────────

function getMaterialTag(materialType: string): { label: string; color: string } {
  const lower = materialType.toLowerCase();
  if (lower.includes('plastic') || lower.includes('polymer') || lower.includes('pet') || lower.includes('hdpe'))
    return { label: 'Polymer', color: 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/25' };
  if (lower.includes('metal') || lower.includes('aluminum') || lower.includes('steel'))
    return { label: 'Metal', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' };
  if (lower.includes('chemical') || lower.includes('acid') || lower.includes('solvent'))
    return { label: 'Chemical', color: 'bg-purple-500/15 text-purple-400 border-purple-500/25' };
  if (lower.includes('paper') || lower.includes('cardboard') || lower.includes('occ'))
    return { label: 'Paper', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' };
  if (lower.includes('wood') || lower.includes('pallet'))
    return { label: 'Wood', color: 'bg-orange-500/15 text-orange-400 border-orange-500/25' };
  if (lower.includes('textile') || lower.includes('fabric') || lower.includes('cotton'))
    return { label: 'Textile', color: 'bg-pink-500/15 text-pink-400 border-pink-500/25' };
  return { label: materialType, color: 'bg-gray-700/30 text-gray-400 border-gray-600/25' };
}

// ── Listing Card ───────────────────────────────────────────────────

function ListingCard({
  listing,
  onClick,
}: {
  listing: WasteListingDto;
  onClick: () => void;
}) {
  const tag = getMaterialTag(listing.materialType);
  const isVerified = listing.status === ListingStatus.Available;

  return (
    <div
      onClick={onClick}
      className="group bg-[#0f2424] border border-[#1e3a3a] rounded-xl overflow-hidden hover:border-[#2dd4bf]/30 hover:shadow-lg hover:shadow-teal-900/10 transition-all duration-200 cursor-pointer"
    >
      {/* Image area */}
      <div className="relative h-44 bg-[#1a2e2e] overflow-hidden">
        {listing.imageUrls?.[0] ? (
          <img
            src={listing.imageUrls[0]}
            alt={listing.materialType}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <MapPin className="w-8 h-8" />
          </div>
        )}

        {/* Verified badge */}
        {isVerified && (
          <div className="absolute top-3 left-3">
            <Badge variant="teal" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
              AI Verified
            </Badge>
          </div>
        )}

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 text-gray-300 hover:text-white backdrop-blur-sm transition-colors"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-2 truncate group-hover:text-[#2dd4bf] transition-colors">
          {listing.materialType || 'Untitled Material'}
        </h3>

        {/* Tag + Distance */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', tag.color)}>
            {tag.label}
          </span>
          <span className="text-[11px] text-gray-500">
            •  Listing
          </span>
        </div>

        {/* Quantity + Price */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-[#0b1a1a] rounded-lg px-3 py-2">
            <p className="text-[10px] uppercase text-gray-500 font-medium tracking-wider">Quantity</p>
            <p className="text-sm font-semibold text-white">{listing.quantity}</p>
          </div>
          <div className="flex-1 bg-[#0b1a1a] rounded-lg px-3 py-2">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2dd4bf]" />
              <p className="text-[10px] uppercase text-gray-500 font-medium tracking-wider">Est. Price</p>
            </div>
            <p className="text-sm font-semibold text-white">
              ${listing.suggestedPrice?.toLocaleString() || 'Negotiable'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1e3a3a]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1a2e2e] flex items-center justify-center">
              <span className="text-[9px] font-bold text-gray-400">
                {listing.companyId?.slice(0, 2).toUpperCase() || 'CO'}
              </span>
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[100px]">
              Company #{listing.companyId?.slice(0, 6) || '—'}
            </span>
          </div>
          <span className="text-xs font-medium text-[#2dd4bf] hover:text-[#14b8a6]">
            View Details
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Page Component ─────────────────────────────────────────────────

export function Marketplace() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<WasteListingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All Materials');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await wasteListingApi.getAll();
      setListings(data);
    } catch {
      setError('Failed to load marketplace listings. The backend may be offline.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Filtered listings ──
  const filtered = useMemo(() => {
    let result = listings;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.materialType?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q),
      );
    }

    if (activeCategory !== 'All Materials') {
      const catLower = activeCategory.toLowerCase();
      result = result.filter((l) => {
        const tag = getMaterialTag(l.materialType).label.toLowerCase();
        return tag.includes(catLower.slice(0, -1)) || l.materialType.toLowerCase().includes(catLower.slice(0, -1));
      });
    }

    return result;
  }, [listings, searchQuery, activeCategory]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Marketplace Discovery</h1>
        <p className="text-sm text-gray-400 mt-1">
          Find valuable resources from industrial partners near you.
        </p>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        {/* Search bar */}
        <div className="flex-1 flex items-center gap-2 bg-[#0f2424] border border-[#1e3a3a] rounded-lg px-4 py-2.5 w-full md:max-w-xl">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search for materials (e.g., 'HDPE scraps' or 'waste heat')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none w-full"
          />
          <Badge variant="teal" size="sm">AI SEMANTIC</Badge>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#0f2424] border border-[#1e3a3a] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-[#1a2e2e] text-white'
                  : 'text-gray-500 hover:text-gray-300',
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                viewMode === 'map'
                  ? 'bg-[#1a2e2e] text-white'
                  : 'text-gray-500 hover:text-gray-300',
              )}
            >
              <Map className="w-3.5 h-3.5" /> Map
            </button>
          </div>

          <Button variant="outline" size="sm" leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}>
            Filters
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-medium border transition-all duration-150',
              activeCategory === cat
                ? 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/40'
                : 'bg-transparent text-gray-400 border-[#2a4a4a] hover:border-[#3a5a5a] hover:text-gray-300',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchListings}>
            Retry
          </Button>
        </div>
      )}

      {/* Listing Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#0f2424] border border-[#1e3a3a] rounded-xl overflow-hidden animate-pulse">
              <div className="h-44 bg-[#1a2e2e]" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#1a2e2e] rounded w-3/4" />
                <div className="h-3 bg-[#1a2e2e] rounded w-1/2" />
                <div className="flex gap-3">
                  <div className="flex-1 h-14 bg-[#0b1a1a] rounded-lg" />
                  <div className="flex-1 h-14 bg-[#0b1a1a] rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No listings found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? `No materials match "${searchQuery}". Try a different search term.`
              : 'No listings available yet. Check back soon or post your own waste listing.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onClick={() => navigate(`/app/marketplace/${listing.id}`)}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {!isLoading && filtered.length > 0 && (
        <div className="mt-6 text-center text-xs text-gray-500">
          Showing {filtered.length} of {listings.length} listings
        </div>
      )}
    </div>
  );
}
