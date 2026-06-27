// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Resource Match Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateResourceMatchCommand, UpdateResourceMatchCommand
// Endpoints: /api/ResourceMatch (GET, POST), /api/ResourceMatch/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/ResourceMatch — create a listing↔request match */
export interface CreateResourceMatchCommand {
  listingId: string; // uuid
  requestId: string; // uuid
  semanticCompatibilityScore: number;
  distanceKm: number;
}

/** PUT /api/ResourceMatch/{id} — update match scores */
export interface UpdateResourceMatchCommand {
  id: string; // uuid
  semanticCompatibilityScore: number;
  distanceKm: number;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/ResourceMatch & GET /api/ResourceMatch/{id}
 * Inferred response shape — includes computed match data + audit fields.
 */
export interface ResourceMatchDto {
  id: string; // uuid
  listingId: string; // uuid
  requestId: string; // uuid
  semanticCompatibilityScore: number;
  distanceKm: number;
  isAccepted: boolean;
  createdAt: string; // ISO 8601
}
