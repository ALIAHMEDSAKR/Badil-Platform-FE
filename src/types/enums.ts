// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Backend Enum Mirrors
// Source: OpenAPI 3.0.1 spec (BadilAPISDOC.txt) + .NET enum definitions
// Pattern: `as const` object + derived union type (matches auth.ts style)
// ═══════════════════════════════════════════════════════════════════

// ── DisputeStatus ──────────────────────────────────────────────────
/** Mirrors Badil.Domain.Enum.DisputeStatus */
export const DisputeStatus = {
  Open: 0,
  UnderInvestigation: 1,
  Resolved: 2,
} as const;

export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];

/** String labels for display purposes */
export type DisputeStatusString = 'Open' | 'UnderInvestigation' | 'Resolved';

// ── EscrowStatus ───────────────────────────────────────────────────
/** Mirrors Badil.Domain.Enum.EscrowStatus */
export const EscrowStatus = {
  AwaitingDeposit: 0,
  FundsLocked: 1,
  InTransit: 2,
  InspectionPeriod: 3,
  FundsReleased: 4,
  Disputed: 5,
} as const;

export type EscrowStatus = (typeof EscrowStatus)[keyof typeof EscrowStatus];

export type EscrowStatusString =
  | 'AwaitingDeposit'
  | 'FundsLocked'
  | 'InTransit'
  | 'InspectionPeriod'
  | 'FundsReleased'
  | 'Disputed';

// ── ListingStatus ──────────────────────────────────────────────────
/** Mirrors Badil.Domain.Enum.ListingStatus */
export const ListingStatus = {
  Draft: 0,
  Available: 1,
  Sold: 2,
} as const;

export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];

export type ListingStatusString = 'Draft' | 'Available' | 'Sold';

// ── NotificationType ───────────────────────────────────────────────
/** Mirrors Badil.Domain.Enum.NotificationType */
export const NotificationType = {
  MatchFound: 0,
  MessageReceived: 1,
  TransactionUpdate: 2,
  SystemAlert: 3,
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export type NotificationTypeString =
  | 'MatchFound'
  | 'MessageReceived'
  | 'TransactionUpdate'
  | 'SystemAlert';

// ── VerificationStatus ─────────────────────────────────────────────
/** Mirrors Badil.Domain.Enum.VerificationStatus */
export const VerificationStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const;

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

export type VerificationStatusString = 'Pending' | 'Approved' | 'Rejected';
