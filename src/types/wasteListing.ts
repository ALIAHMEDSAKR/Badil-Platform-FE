// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Waste Listing Domain Types
// Source: Badil.Application Features/WasteListing DTOs & Commands
// Endpoints: /api/WasteListing
// ═══════════════════════════════════════════════════════════════════

import type { ListingStatusString } from "./enums";

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/WasteListing — create a new waste/resource listing */
export interface CreateWasteListingCommand {
  materialType: string | null;
  quantity: number;
  description: string | null;
  imageUrls: string[] | null;
  suggestedPrice: number;
}

/** PUT /api/WasteListing/{id} — update an existing listing */
export interface UpdateWasteListingCommand {
  id: string;
  materialType: string | null;
  quantity: number;
  description: string | null;
  imageUrls: string[] | null;
  suggestedPrice: number;
  status: ListingStatusString;
}

/** GET /api/WasteListing/search — query parameters */
export interface SearchWasteListingsParams {
  materialType?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ListingStatusString;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/** GET /api/WasteListing & GET /api/WasteListing/{id} */
export interface WasteListingDto {
  id: string;
  userId: string;
  materialType: string;
  aiStandardizedTag: string;
  quantity: number;
  description: string;
  imageUrls: string[];
  suggestedPrice: number;
  status: ListingStatusString;
  isVisuallyValidated: boolean;
  createdAt: string;
}
