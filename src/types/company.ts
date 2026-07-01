// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Company Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateCompanyCommand, UpdateCompanyCommand
// Endpoints: /api/Company (GET, POST), /api/Company/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/Company — register a new company profile */
export interface CreateCompanyCommand {
  name: string | null;
  sector: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  taxRegistrationNumber: string | null;
  commercialRegisterNumber: string | null;
}

/** PUT /api/Company/{id} — update an existing company */
export interface UpdateCompanyCommand {
  id: string; // uuid
  name: string | null;
  sector: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  taxRegistrationNumber: string | null;
  commercialRegisterNumber: string | null;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/Company & GET /api/Company/{id}
 * Inferred response shape — includes ownership + audit fields.
 */
export interface CompanyDto {
  id: string; // uuid
  userId: string; // uuid — the user who owns this company
  name: string;
  sector: string;
  address: string;
  latitude: number;
  longitude: number;
  taxRegistrationNumber: string;
  commercialRegisterNumber: string;
  isVerified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
