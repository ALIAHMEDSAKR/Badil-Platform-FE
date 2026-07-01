// ═══════════════════════════════════════════════════════════════════
// Badil Platform — AI Match API Service
// Endpoints: /api/ResourceMatch
// ═══════════════════════════════════════════════════════════════════

import client from "./client";

export interface ResourceMatchDto {
  id: string;
  listingId: string;
  requestId: string;
  semanticCompatibilityScore: number;
  distanceKm: number;
  createdAt: string;
}

export const aiMatchApi = {
  /** GET /api/ResourceMatch — list all matches (Admin) */
  getAll: async (): Promise<ResourceMatchDto[]> => {
    const res = await client.get<ResourceMatchDto[]>("/ResourceMatch");
    return res.data;
  },

  /** GET /api/ResourceMatch/{id} */
  getById: async (id: string): Promise<ResourceMatchDto> => {
    const res = await client.get<ResourceMatchDto>(`/ResourceMatch/${id}`);
    return res.data;
  },

  /** POST /api/ResourceMatch/auto-match — triggers auto matching engine (Admin only) */
  autoMatch: async (): Promise<{ matchesCreated: number }> => {
    const res = await client.post<{ matchesCreated: number }>("/ResourceMatch/auto-match");
    return res.data;
  },

  /** GET /api/ResourceMatch/for-listing/{listingId} */
  getForListing: async (listingId: string): Promise<ResourceMatchDto[]> => {
    const res = await client.get<ResourceMatchDto[]>(`/ResourceMatch/for-listing/${listingId}`);
    return res.data;
  },

  /** GET /api/ResourceMatch/for-request/{requestId} */
  getForRequest: async (requestId: string): Promise<ResourceMatchDto[]> => {
    const res = await client.get<ResourceMatchDto[]>(`/ResourceMatch/for-request/${requestId}`);
    return res.data;
  },
};
