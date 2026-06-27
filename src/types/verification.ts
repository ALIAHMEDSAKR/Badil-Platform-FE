// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Verification Request Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateVerificationRequestCommand, UpdateVerificationRequestCommand
// Endpoints: /api/VerificationRequest (GET, POST), /api/VerificationRequest/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import type { VerificationStatus } from './enums';

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/VerificationRequest — submit company docs for verification */
export interface CreateVerificationRequestCommand {
  companyId: string; // uuid
  documentUrls: string[] | null;
}

/** PUT /api/VerificationRequest/{id} — admin: approve/reject verification */
export interface UpdateVerificationRequestCommand {
  id: string; // uuid
  status: VerificationStatus;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/VerificationRequest & GET /api/VerificationRequest/{id}
 * Inferred response shape — includes review status + admin info.
 */
export interface VerificationRequestDto {
  id: string; // uuid
  companyId: string; // uuid
  documentUrls: string[];
  status: VerificationStatus;
  reviewedByAdminId: string | null; // uuid — admin who reviewed
  remarks: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
