// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Resource Match API Service
// Endpoints: /api/ResourceMatch
// ═══════════════════════════════════════════════════════════════════

import client from "./client";
import type {
  ResourceMatchDto,
  CreateResourceMatchCommand,
  UpdateResourceMatchCommand,
} from "../types/resourceMatch";

export const resourceMatchApi = {
  /** GET /api/ResourceMatch — list all resource matches */
  getAll: async (): Promise<ResourceMatchDto[]> => {
    const res = await client.get<ResourceMatchDto[]>("/ResourceMatch");
    return res.data;
  },

  /** GET /api/ResourceMatch/{id} — get a single match */
  getById: async (id: string): Promise<ResourceMatchDto> => {
    const res = await client.get<ResourceMatchDto>(`/ResourceMatch/${id}`);
    return res.data;
  },

  /** GET /api/ResourceMatch/for-listing/{listingId} */
  getForListing: async (listingId: string): Promise<ResourceMatchDto[]> => {
    const res = await client.get<ResourceMatchDto[]>(
      `/ResourceMatch/for-listing/${listingId}`,
    );
    return res.data;
  },

  /** GET /api/ResourceMatch/for-request/{requestId} */
  getForRequest: async (requestId: string): Promise<ResourceMatchDto[]> => {
    const res = await client.get<ResourceMatchDto[]>(
      `/ResourceMatch/for-request/${requestId}`,
    );
    return res.data;
  },

  /** POST /api/ResourceMatch — create a listing↔request match (Admin) */
  create: async (
    data: CreateResourceMatchCommand,
  ): Promise<ResourceMatchDto> => {
    const res = await client.post<ResourceMatchDto>("/ResourceMatch", data);
    return res.data;
  },

  /** PUT /api/ResourceMatch/{id} — update match scores (Admin) */
  update: async (
    id: string,
    data: UpdateResourceMatchCommand,
  ): Promise<void> => {
    await client.put(`/ResourceMatch/${id}`, data);
  },

  /** DELETE /api/ResourceMatch/{id} — remove a match (Admin) */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/ResourceMatch/${id}`);
  },

  /** POST /api/ResourceMatch/auto-match — run auto-matching (Admin) */
  autoMatch: async (): Promise<{ matchesCreated: number }> => {
    const res = await client.post<{ matchesCreated: number }>(
      "/ResourceMatch/auto-match",
    );
    return res.data;
  },
};
