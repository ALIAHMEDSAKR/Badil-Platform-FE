// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Company API Service
// Endpoints: /api/Company (GET, POST), /api/Company/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import client from './client';
import type {
  CompanyDto,
  CreateCompanyCommand,
  UpdateCompanyCommand,
} from '../types/company';

export const companyApi = {
  /** GET /api/Company — list all companies */
  getAll: async (): Promise<CompanyDto[]> => {
    const res = await client.get<CompanyDto[]>('/Company');
    return res.data;
  },

  /** GET /api/Company/{id} — get a single company */
  getById: async (id: string): Promise<CompanyDto> => {
    const res = await client.get<CompanyDto>(`/Company/${id}`);
    return res.data;
  },

  /** POST /api/Company — register a new company */
  create: async (data: CreateCompanyCommand): Promise<CompanyDto> => {
    const res = await client.post<CompanyDto>('/Company', data);
    return res.data;
  },

  /** PUT /api/Company/{id} — update company profile */
  update: async (id: string, data: UpdateCompanyCommand): Promise<void> => {
    await client.put(`/Company/${id}`, data);
  },

  /** DELETE /api/Company/{id} — delete a company */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/Company/${id}`);
  },
};
