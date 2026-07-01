// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Verification Request API Service
// Endpoints: /api/VerificationRequest
// ═══════════════════════════════════════════════════════════════════

import client from "./client";
import type {
  VerificationRequestDto,
  CreateVerificationRequestCommand,
  UpdateVerificationRequestCommand,
  RejectVerificationRequestCommand,
} from "../types/verification";

export const verificationApi = {
  /** GET /api/VerificationRequest — list all verification requests */
  getAll: async (): Promise<VerificationRequestDto[]> => {
    const res = await client.get<VerificationRequestDto[]>(
      "/VerificationRequest",
    );
    return res.data;
  },

  /** GET /api/VerificationRequest/mine — current user's requests */
  getMine: async (): Promise<VerificationRequestDto[]> => {
    const res = await client.get<VerificationRequestDto[]>(
      "/VerificationRequest/mine",
    );
    return res.data;
  },

  /** GET /api/VerificationRequest/{id} — get a single request */
  getById: async (id: string): Promise<VerificationRequestDto> => {
    const res = await client.get<VerificationRequestDto>(
      `/VerificationRequest/${id}`,
    );
    return res.data;
  },

  /** POST /api/VerificationRequest — submit verification documents */
  create: async (
    data: CreateVerificationRequestCommand,
  ): Promise<VerificationRequestDto> => {
    const res = await client.post<VerificationRequestDto>(
      "/VerificationRequest",
      data,
    );
    return res.data;
  },

  /** POST /api/VerificationRequest/{id}/upload-document — upload verification file */
  uploadDocument: async (requestId: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await client.post<{ url: string }>(
      `/VerificationRequest/${requestId}/upload-document`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  /** PUT /api/VerificationRequest/{id} — admin: update status */
  update: async (
    id: string,
    data: UpdateVerificationRequestCommand,
  ): Promise<void> => {
    await client.put(`/VerificationRequest/${id}`, data);
  },

  /** POST /api/VerificationRequest/{id}/approve — admin: approve */
  approve: async (id: string): Promise<void> => {
    await client.post(`/VerificationRequest/${id}/approve`);
  },

  /** POST /api/VerificationRequest/{id}/reject — admin: reject */
  reject: async (
    id: string,
    data: RejectVerificationRequestCommand,
  ): Promise<void> => {
    await client.post(`/VerificationRequest/${id}/reject`, data);
  },

  /** DELETE /api/VerificationRequest/{id} — remove a request (Admin) */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/VerificationRequest/${id}`);
  },
};
