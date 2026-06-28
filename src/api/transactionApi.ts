// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Transaction API Service
// Endpoints: /api/Transaction
// ═══════════════════════════════════════════════════════════════════

import client from "./client";
import type {
  TransactionDto,
  CreateTransactionCommand,
  UpdateTransactionCommand,
} from "../types/transaction";

export const transactionApi = {
  /** GET /api/Transaction — list all transactions */
  getAll: async (): Promise<TransactionDto[]> => {
    const res = await client.get<TransactionDto[]>("/Transaction");
    return res.data;
  },

  /** GET /api/Transaction/{id} — get a single transaction */
  getById: async (id: string): Promise<TransactionDto> => {
    const res = await client.get<TransactionDto>(`/Transaction/${id}`);
    return res.data;
  },

  /** GET /api/Transaction/mine — current user's transactions */
  getMine: async (): Promise<TransactionDto[]> => {
    const res = await client.get<TransactionDto[]>("/Transaction/mine");
    return res.data;
  },

  /** POST /api/Transaction — initiate a new transaction */
  create: async (data: CreateTransactionCommand): Promise<TransactionDto> => {
    const res = await client.post<TransactionDto>("/Transaction", data);
    return res.data;
  },

  /** PUT /api/Transaction/{id} — update transaction / escrow state */
  update: async (id: string, data: UpdateTransactionCommand): Promise<void> => {
    await client.put(`/Transaction/${id}`, data);
  },

  /** DELETE /api/Transaction/{id} — cancel a transaction */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/Transaction/${id}`);
  },

  /** POST /api/Transaction/{id}/lock-funds */
  lockFunds: async (id: string): Promise<void> => {
    await client.post(`/Transaction/${id}/lock-funds`);
  },

  /** POST /api/Transaction/{id}/confirm-delivery */
  confirmDelivery: async (id: string): Promise<void> => {
    await client.post(`/Transaction/${id}/confirm-delivery`);
  },

  /** POST /api/Transaction/{id}/release-funds */
  releaseFunds: async (id: string): Promise<void> => {
    await client.post(`/Transaction/${id}/release-funds`);
  },
};
