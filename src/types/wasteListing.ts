// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Waste Listing Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateWasteListingCommand, UpdateWasteListingCommand
// Endpoints: /api/WasteListing (GET, POST), /api/WasteListing/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import type { ListingStatus } from './enums';

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
  id: string; // uuid
  materialType: string | null;
  quantity: number;
  description: string | null;
  imageUrls: string[] | null;
  suggestedPrice: number;
  status: ListingStatus;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/WasteListing & GET /api/WasteListing/{id}
 * Inferred response shape — includes ownership + status + audit fields.
 */
export interface WasteListingDto {
  id: string; // uuid
  companyId: string; // uuid — the company that owns this listing
  sellerId: string; // uuid — the user who created it
  materialType: string;
  quantity: number;
  description: string;
  imageUrls: string[];
  suggestedPrice: number;
  status: ListingStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
