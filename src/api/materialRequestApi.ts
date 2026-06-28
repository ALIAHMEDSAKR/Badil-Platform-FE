// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Material Request API Service
// Endpoints: /api/MaterialRequest
// ═══════════════════════════════════════════════════════════════════

import client from "./client";
import type {
  MaterialRequestDto,
  CreateMaterialRequestCommand,
  UpdateMaterialRequestCommand,
} from "../types/materialRequest";

export const materialRequestApi = {
  /** GET /api/MaterialRequest — list all material requests */
  getAll: async (): Promise<MaterialRequestDto[]> => {
    const res = await client.get<MaterialRequestDto[]>("/MaterialRequest");
    return res.data;
  },

  /** GET /api/MaterialRequest/{id} — get a single request */
  getById: async (id: string): Promise<MaterialRequestDto> => {
    const res = await client.get<MaterialRequestDto>(`/MaterialRequest/${id}`);
    return res.data;
  },

  /** GET /api/MaterialRequest/mine — current user's requests */
  getMine: async (): Promise<MaterialRequestDto[]> => {
    const res = await client.get<MaterialRequestDto[]>("/MaterialRequest/mine");
    return res.data;
  },

  /** POST /api/MaterialRequest — create a new material request */
  create: async (
    data: CreateMaterialRequestCommand,
  ): Promise<MaterialRequestDto> => {
    const res = await client.post<MaterialRequestDto>("/MaterialRequest", data);
    return res.data;
  },

  /** PUT /api/MaterialRequest/{id} — update a request */
  update: async (
    id: string,
    data: UpdateMaterialRequestCommand,
  ): Promise<void> => {
    await client.put(`/MaterialRequest/${id}`, data);
  },

  /** DELETE /api/MaterialRequest/{id} — remove a request */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/MaterialRequest/${id}`);
  },
};
