// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Transaction Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateTransactionCommand, UpdateTransactionCommand
// Endpoints: /api/Transaction (GET, POST), /api/Transaction/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import type { EscrowStatus } from './enums';

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/Transaction — initiate a new transaction */
export interface CreateTransactionCommand {
  listingId: string; // uuid
  sellerId: string; // uuid
  agreedPrice: number;
  isSampleRequest: boolean;
}

/** PUT /api/Transaction/{id} — update transaction state */
export interface UpdateTransactionCommand {
  id: string; // uuid
  agreedPrice: number;
  escrowState: EscrowStatus;
  isSampleRequest: boolean;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/Transaction & GET /api/Transaction/{id}
 * Inferred response shape — includes buyer/seller + escrow state + audit fields.
 */
export interface TransactionDto {
  id: string; // uuid
  listingId: string; // uuid
  buyerId: string; // uuid
  sellerId: string; // uuid
  agreedPrice: number;
  escrowState: EscrowStatus;
  isSampleRequest: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
