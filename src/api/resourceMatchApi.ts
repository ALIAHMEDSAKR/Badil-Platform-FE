// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Resource Match API Service
// Endpoints: /api/ResourceMatch (GET, POST), /api/ResourceMatch/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import client from './client';
import type {
  ResourceMatchDto,
  CreateResourceMatchCommand,
  UpdateResourceMatchCommand,
} from '../types/resourceMatch';

export const resourceMatchApi = {
  /** GET /api/ResourceMatch — list all resource matches */
  getAll: async (): Promise<ResourceMatchDto[]> => {
    const res = await client.get<ResourceMatchDto[]>('/ResourceMatch');
    return res.data;
  },

  /** GET /api/ResourceMatch/{id} — get a single match */
  getById: async (id: string): Promise<ResourceMatchDto> => {
    const res = await client.get<ResourceMatchDto>(`/ResourceMatch/${id}`);
    return res.data;
  },

  /** POST /api/ResourceMatch — create a listing↔request match */
  create: async (data: CreateResourceMatchCommand): Promise<ResourceMatchDto> => {
    const res = await client.post<ResourceMatchDto>('/ResourceMatch', data);
    return res.data;
  },

  /** PUT /api/ResourceMatch/{id} — update match scores */
  update: async (id: string, data: UpdateResourceMatchCommand): Promise<void> => {
    await client.put(`/ResourceMatch/${id}`, data);
  },

  /** DELETE /api/ResourceMatch/{id} — remove a match */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/ResourceMatch/${id}`);
  },
};
