// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Notification API Service
// Endpoints: /api/Notification
// ═══════════════════════════════════════════════════════════════════

import client from "./client";
import type {
  NotificationDto,
  CreateNotificationCommand,
  UpdateNotificationCommand,
} from "../types/notification";

export const notificationApi = {
  /** GET /api/Notification — list all notifications (Admin view) */
  getAll: async (): Promise<NotificationDto[]> => {
    const res = await client.get<NotificationDto[]>("/Notification");
    return res.data;
  },

  /** GET /api/Notification/mine — current user's notifications */
  getMine: async (): Promise<NotificationDto[]> => {
    const res = await client.get<NotificationDto[]>("/Notification/mine");
    return res.data;
  },

  /** GET /api/Notification/{id} — get a single notification */
  getById: async (id: string): Promise<NotificationDto> => {
    const res = await client.get<NotificationDto>(`/Notification/${id}`);
    return res.data;
  },

  /** GET /api/Notification/unread-count */
  getUnreadCount: async (): Promise<{ count: number }> => {
    const res = await client.get<{ count: number }>(
      "/Notification/unread-count",
    );
    return res.data;
  },

  /** POST /api/Notification — create a notification (Admin) */
  create: async (data: CreateNotificationCommand): Promise<NotificationDto> => {
    const res = await client.post<NotificationDto>("/Notification", data);
    return res.data;
  },

  /** PUT /api/Notification/{id} — mark as read */
  update: async (
    id: string,
    data: UpdateNotificationCommand,
  ): Promise<void> => {
    await client.put(`/Notification/${id}`, data);
  },

  /** PATCH /api/Notification/{id}/mark-read */
  markAsRead: async (id: string): Promise<void> => {
    await client.patch(`/Notification/${id}/mark-read`);
  },

  /** POST /api/Notification/mark-all-read */
  markAllAsRead: async (): Promise<void> => {
    await client.post("/Notification/mark-all-read");
  },

  /** DELETE /api/Notification/{id} — delete a notification */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/Notification/${id}`);
  },
};
