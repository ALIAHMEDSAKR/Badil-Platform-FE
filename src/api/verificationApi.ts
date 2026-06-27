// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Verification Request API Service
// Endpoints: /api/VerificationRequest (GET, POST), /api/VerificationRequest/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import client from './client';
import type {
  VerificationRequestDto,
  CreateVerificationRequestCommand,
  UpdateVerificationRequestCommand,
} from '../types/verification';

export const verificationApi = {
  /** GET /api/VerificationRequest — list all verification requests */
  getAll: async (): Promise<VerificationRequestDto[]> => {
    const res = await client.get<VerificationRequestDto[]>('/VerificationRequest');
    return res.data;
  },

  /** GET /api/VerificationRequest/{id} — get a single request */
  getById: async (id: string): Promise<VerificationRequestDto> => {
    const res = await client.get<VerificationRequestDto>(`/VerificationRequest/${id}`);
    return res.data;
  },

  /** POST /api/VerificationRequest — submit verification documents */
  create: async (data: CreateVerificationRequestCommand): Promise<VerificationRequestDto> => {
    const res = await client.post<VerificationRequestDto>('/VerificationRequest', data);
    return res.data;
  },

  /** PUT /api/VerificationRequest/{id} — admin: approve/reject */
  update: async (id: string, data: UpdateVerificationRequestCommand): Promise<void> => {
    await client.put(`/VerificationRequest/${id}`, data);
  },

  /** DELETE /api/VerificationRequest/{id} — remove a request */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/VerificationRequest/${id}`);
  },
};
