// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Message API Service
// Endpoints: /api/Message (GET, POST), /api/Message/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import client from './client';
import type {
  MessageDto,
  CreateMessageCommand,
  UpdateMessageCommand,
} from '../types/message';

export const messageApi = {
  /** GET /api/Message — list all messages for current user */
  getAll: async (): Promise<MessageDto[]> => {
    const res = await client.get<MessageDto[]>('/Message');
    return res.data;
  },

  /** GET /api/Message/{id} — get a single message */
  getById: async (id: string): Promise<MessageDto> => {
    const res = await client.get<MessageDto>(`/Message/${id}`);
    return res.data;
  },

  /** POST /api/Message — send a new message */
  create: async (data: CreateMessageCommand): Promise<MessageDto> => {
    const res = await client.post<MessageDto>('/Message', data);
    return res.data;
  },

  /** PUT /api/Message/{id} — mark as read */
  update: async (id: string, data: UpdateMessageCommand): Promise<void> => {
    await client.put(`/Message/${id}`, data);
  },

  /** DELETE /api/Message/{id} — delete a message */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/Message/${id}`);
  },
};
