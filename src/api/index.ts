// ═══════════════════════════════════════════════════════════════════
// Badil Platform — API Layer Barrel Export
// Import any API service from: import { wasteListingApi, companyApi } from '@/api'
// ═══════════════════════════════════════════════════════════════════

// ── Axios clients ──
export { default as client } from './client';
export { default as apiClient } from './apiClient'; // legacy — preserved

// ── Auth (preserved) ──
export { authApi } from './authApi';
export { adminApi } from './adminApi';

// ── Domain services (new — use store-aware client) ──
export { companyApi } from './companyApi';
export { wasteListingApi } from './wasteListingApi';
export { materialRequestApi } from './materialRequestApi';
export { transactionApi } from './transactionApi';
export { disputeApi } from './disputeApi';
export { resourceMatchApi } from './resourceMatchApi';
export { messageApi } from './messageApi';
export { notificationApi } from './notificationApi';
export { verificationApi } from './verificationApi';
