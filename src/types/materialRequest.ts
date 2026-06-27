// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Material Request Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateMaterialRequestCommand, UpdateMaterialRequestCommand
// Endpoints: /api/MaterialRequest (GET, POST), /api/MaterialRequest/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/MaterialRequest — create a new material/resource request */
export interface CreateMaterialRequestCommand {
  materialType: string | null;
  targetQuantity: number;
  locationPreferenceRadiusKm: number;
}

/** PUT /api/MaterialRequest/{id} — update an existing request */
export interface UpdateMaterialRequestCommand {
  id: string; // uuid
  materialType: string | null;
  targetQuantity: number;
  locationPreferenceRadiusKm: number;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/MaterialRequest & GET /api/MaterialRequest/{id}
 * Inferred response shape — includes requester + audit fields.
 */
export interface MaterialRequestDto {
  id: string; // uuid
  requesterId: string; // uuid — the user who created the request
  companyId: string; // uuid — the company requesting materials
  materialType: string;
  targetQuantity: number;
  locationPreferenceRadiusKm: number;
  isMatched: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
