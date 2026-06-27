// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Notification Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateNotificationCommand, UpdateNotificationCommand
// Endpoints: /api/Notification (GET, POST), /api/Notification/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

import type { NotificationType } from './enums';

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/Notification — create a notification for a user */
export interface CreateNotificationCommand {
  userId: string; // uuid
  content: string | null;
  type: NotificationType;
}

/** PUT /api/Notification/{id} — mark notification as read */
export interface UpdateNotificationCommand {
  id: string; // uuid
  isRead: boolean;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/Notification & GET /api/Notification/{id}
 * Inferred response shape — includes notification metadata.
 */
export interface NotificationDto {
  id: string; // uuid
  userId: string; // uuid
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO 8601
}
