// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Dispute Ticket Domain Types
// Source: Badil.Application Features/DisputeTicket DTOs & Commands
// Endpoints: /api/DisputeTicket
// ═══════════════════════════════════════════════════════════════════

import type { DisputeStatusString } from "./enums";

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/DisputeTicket — raise a dispute on a transaction */
export interface CreateDisputeTicketCommand {
  transactionId: string;
  reason: string | null;
}

/** PUT /api/DisputeTicket/{id} — admin: update dispute status/resolution */
export interface UpdateDisputeTicketCommand {
  id: string;
  status: DisputeStatusString;
  adminResolutionRemarks: string | null;
}

/** POST /api/DisputeTicket/{id}/resolve — admin: resolve dispute */
export interface ResolveDisputeTicketCommand {
  remarks: string;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/** GET /api/DisputeTicket & GET /api/DisputeTicket/{id} */
export interface DisputeTicketDto {
  id: string;
  transactionId: string;
  raisedByUserId: string;
  reason: string;
  status: DisputeStatusString;
  adminResolutionRemarks: string | null;
  createdAt: string;
}
