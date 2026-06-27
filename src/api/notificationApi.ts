// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Notification API Service
// Endpoints: /api/Notification (GET, POST), /api/Notification/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import client from './client';
import type {
  NotificationDto,
  CreateNotificationCommand,
  UpdateNotificationCommand,
} from '../types/notification';

export const notificationApi = {
  /** GET /api/Notification — list all notifications for current user */
  getAll: async (): Promise<NotificationDto[]> => {
    const res = await client.get<NotificationDto[]>('/Notification');
    return res.data;
  },

  /** GET /api/Notification/{id} — get a single notification */
  getById: async (id: string): Promise<NotificationDto> => {
    const res = await client.get<NotificationDto>(`/Notification/${id}`);
    return res.data;
  },

  /** POST /api/Notification — create a notification */
  create: async (data: CreateNotificationCommand): Promise<NotificationDto> => {
    const res = await client.post<NotificationDto>('/Notification', data);
    return res.data;
  },

  /** PUT /api/Notification/{id} — mark as read */
  update: async (id: string, data: UpdateNotificationCommand): Promise<void> => {
    await client.put(`/Notification/${id}`, data);
  },

  /** DELETE /api/Notification/{id} — delete a notification */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/Notification/${id}`);
  },
};
