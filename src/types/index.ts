// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Types Barrel Export
// Central re-export for all domain types.
// Usage: import { UserRole, CreateWasteListingCommand, EscrowStatus } from '@/types'
// ═══════════════════════════════════════════════════════════════════

// Enums (all backend enum mirrors)
export * from './enums';

// Auth & Admin (pre-existing — preserved)
export * from './auth';

// Domain entities
export * from './company';
export * from './wasteListing';
export * from './materialRequest';
export * from './transaction';
export * from './dispute';
export * from './resourceMatch';
export * from './message';
export * from './notification';
export * from './verification';
