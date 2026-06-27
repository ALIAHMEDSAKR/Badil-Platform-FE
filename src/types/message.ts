// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Message Domain Types
// Source: OpenAPI 3.0.1 schemas: CreateMessageCommand, UpdateMessageCommand
// Endpoints: /api/Message (GET, POST), /api/Message/{id} (GET, PUT, DELETE)
// ═══════════════════════════════════════════════════════════════════

// ── Commands (Write) ───────────────────────────────────────────────

/** POST /api/Message — send a direct message to another user */
export interface CreateMessageCommand {
  receiverId: string; // uuid
  content: string | null;
}

/** PUT /api/Message/{id} — mark message as read */
export interface UpdateMessageCommand {
  id: string; // uuid
  isRead: boolean;
}

// ── DTOs (Read) ────────────────────────────────────────────────────

/**
 * GET /api/Message & GET /api/Message/{id}
 * Inferred response shape — includes sender/receiver + read status.
 */
export interface MessageDto {
  id: string; // uuid
  senderId: string; // uuid
  receiverId: string; // uuid
  content: string;
  isRead: boolean;
  sentAt: string; // ISO 8601
}
