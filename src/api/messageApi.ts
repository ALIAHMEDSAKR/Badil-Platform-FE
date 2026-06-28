// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Message API Service
// Endpoints: /api/Message
// ═══════════════════════════════════════════════════════════════════

import client from "./client";
import type {
  MessageDto,
  CreateMessageCommand,
  UpdateMessageCommand,
} from "../types/message";

export const messageApi = {
  /** GET /api/Message — list all messages for current user */
  getAll: async (): Promise<MessageDto[]> => {
    const res = await client.get<MessageDto[]>("/Message");
    return res.data;
  },

  /** GET /api/Message/{id} — get a single message */
  getById: async (id: string): Promise<MessageDto> => {
    const res = await client.get<MessageDto>(`/Message/${id}`);
    return res.data;
  },

  /** GET /api/Message/conversation/{userId} — messages with a user */
  getConversation: async (userId: string): Promise<MessageDto[]> => {
    const res = await client.get<MessageDto[]>(
      `/Message/conversation/${userId}`,
    );
    return res.data;
  },

  /** GET /api/Message/unread-count */
  getUnreadCount: async (): Promise<{ count: number }> => {
    const res = await client.get<{ count: number }>("/Message/unread-count");
    return res.data;
  },

  /** POST /api/Message — send a new message */
  create: async (data: CreateMessageCommand): Promise<MessageDto> => {
    const res = await client.post<MessageDto>("/Message", data);
    return res.data;
  },

  /** PUT /api/Message/{id} — update message (e.g. mark as read) */
  update: async (id: string, data: UpdateMessageCommand): Promise<void> => {
    await client.put(`/Message/${id}`, data);
  },

  /** PATCH /api/Message/{id}/mark-read */
  markAsRead: async (id: string): Promise<void> => {
    await client.patch(`/Message/${id}/mark-read`);
  },

  /** DELETE /api/Message/{id} — delete a message */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/Message/${id}`);
  },
};
