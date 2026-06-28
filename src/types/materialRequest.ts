// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Material Request Domain Types
// Source: Badil.Application Features/MaterialRequest DTOs & Commands
// Endpoints: /api/MaterialRequest
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
  id: string;
  materialType: string | null;
  targetQuantity: number;
  locationPreferenceRadiusKm: number;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/** GET /api/MaterialRequest & GET /api/MaterialRequest/{id} */
export interface MaterialRequestDto {
  id: string;
  userId: string;
  materialType: string;
  targetQuantity: number;
  locationPreferenceRadiusKm: number;
  createdAt: string;
}
