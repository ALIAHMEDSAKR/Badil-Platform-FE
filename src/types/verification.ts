// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Verification Request Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateVerificationRequestCommand, UpdateVerificationRequestCommand
// Endpoints: /api/VerificationRequest (GET, POST), /api/VerificationRequest/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import type { VerificationStatusString } from "./enums";

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/VerificationRequest — submit company docs for verification */
export interface CreateVerificationRequestCommand {
  companyId: string; // uuid
  documentUrls: string[] | null;
}

/** PUT /api/VerificationRequest/{id} — admin: approve/reject verification */
export interface UpdateVerificationRequestCommand {
  id: string;
  status: VerificationStatusString;
}

/** POST /api/VerificationRequest/{id}/reject — admin: reject with reason */
export interface RejectVerificationRequestCommand {
  reason: string;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/VerificationRequest & GET /api/VerificationRequest/{id}
 * Inferred response shape — includes review status + admin info.
 */
export interface VerificationRequestDto {
  id: string;
  companyId: string;
  documentUrls: string[];
  status: VerificationStatusString;
  reviewedByAdminId: string | null;
  createdAt: string;
}
