// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Dispute Ticket API Service
// Endpoints: /api/DisputeTicket
// ═══════════════════════════════════════════════════════════════════

import client from "./client";
import type {
  DisputeTicketDto,
  CreateDisputeTicketCommand,
  UpdateDisputeTicketCommand,
  ResolveDisputeTicketCommand,
} from "../types/dispute";

export const disputeApi = {
  /** GET /api/DisputeTicket — list all dispute tickets */
  getAll: async (): Promise<DisputeTicketDto[]> => {
    const res = await client.get<DisputeTicketDto[]>("/DisputeTicket");
    return res.data;
  },

  /** GET /api/DisputeTicket/{id} — get a single dispute */
  getById: async (id: string): Promise<DisputeTicketDto> => {
    const res = await client.get<DisputeTicketDto>(`/DisputeTicket/${id}`);
    return res.data;
  },

  /** POST /api/DisputeTicket — raise a new dispute */
  create: async (
    data: CreateDisputeTicketCommand,
  ): Promise<DisputeTicketDto> => {
    const res = await client.post<DisputeTicketDto>("/DisputeTicket", data);
    return res.data;
  },

  /** PUT /api/DisputeTicket/{id} — admin: update a dispute */
  update: async (
    id: string,
    data: UpdateDisputeTicketCommand,
  ): Promise<void> => {
    await client.put(`/DisputeTicket/${id}`, data);
  },

  /** DELETE /api/DisputeTicket/{id} — remove a dispute ticket */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/DisputeTicket/${id}`);
  },

  /** POST /api/DisputeTicket/{id}/resolve — admin: resolve a dispute */
  resolve: async (
    id: string,
    data: ResolveDisputeTicketCommand,
  ): Promise<void> => {
    await client.post(`/DisputeTicket/${id}/resolve`, data);
  },
};
