// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Dispute Ticket Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateDisputeTicketCommand, UpdateDisputeTicketCommand
// Endpoints: /api/DisputeTicket (GET, POST), /api/DisputeTicket/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import type { DisputeStatus } from './enums';

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/DisputeTicket — raise a dispute on a transaction */
export interface CreateDisputeTicketCommand {
  transactionId: string; // uuid
  reason: string | null;
}

/** PUT /api/DisputeTicket/{id} — admin: update dispute status/resolution */
export interface UpdateDisputeTicketCommand {
  id: string; // uuid
  status: DisputeStatus;
  adminResolutionRemarks: string | null;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/DisputeTicket & GET /api/DisputeTicket/{id}
 * Inferred response shape — includes the raising user + admin resolution + audit fields.
 */
export interface DisputeTicketDto {
  id: string; // uuid
  transactionId: string; // uuid
  raisedByUserId: string; // uuid — who filed the dispute
  reason: string;
  status: DisputeStatus;
  adminResolutionRemarks: string | null;
  resolvedByAdminId: string | null; // uuid
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
