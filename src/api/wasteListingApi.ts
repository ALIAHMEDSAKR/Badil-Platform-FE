// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Waste Listing API Service
// Endpoints: /api/WasteListing (GET, POST), /api/WasteListing/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import client from './client';
import type {
  WasteListingDto,
  CreateWasteListingCommand,
  UpdateWasteListingCommand,
} from '../types/wasteListing';

export const wasteListingApi = {
  /** GET /api/WasteListing — list all waste listings */
  getAll: async (): Promise<WasteListingDto[]> => {
    const res = await client.get<WasteListingDto[]>('/WasteListing');
    return res.data;
  },

  /** GET /api/WasteListing/{id} — get a single listing */
  getById: async (id: string): Promise<WasteListingDto> => {
    const res = await client.get<WasteListingDto>(`/WasteListing/${id}`);
    return res.data;
  },

  /** POST /api/WasteListing — create a new listing */
  create: async (data: CreateWasteListingCommand): Promise<WasteListingDto> => {
    const res = await client.post<WasteListingDto>('/WasteListing', data);
    return res.data;
  },

  /** PUT /api/WasteListing/{id} — update a listing */
  update: async (id: string, data: UpdateWasteListingCommand): Promise<void> => {
    await client.put(`/WasteListing/${id}`, data);
  },

  /** DELETE /api/WasteListing/{id} — remove a listing */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/WasteListing/${id}`);
  },
};
