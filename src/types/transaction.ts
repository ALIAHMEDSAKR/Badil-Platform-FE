// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Transaction Domain Types
// Source: Badil.Application Features/Transaction DTOs & Commands
// Endpoints: /api/Transaction
// ═══════════════════════════════════════════════════════════════════

import type { EscrowStatusString } from "./enums";

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/Transaction — initiate a new transaction */
export interface CreateTransactionCommand {
  listingId: string;
  sellerId: string;
  agreedPrice: number;
  isSampleRequest: boolean;
}

/** PUT /api/Transaction/{id} — update transaction state */
export interface UpdateTransactionCommand {
  id: string;
  agreedPrice: number;
  escrowState: EscrowStatusString;
  isSampleRequest: boolean;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/** GET /api/Transaction & GET /api/Transaction/{id} */
export interface TransactionDto {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  agreedPrice: number;
  escrowState: EscrowStatusString;
  isSampleRequest: boolean;
  createdAt: string;
}
