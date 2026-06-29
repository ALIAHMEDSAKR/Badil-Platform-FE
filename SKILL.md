# SKILL.md — Badil Admin Dashboard Frontend

## Project Identity
- **App:** Badil – AI-Powered Industrial Symbiosis Marketplace
- **Panel:** Admin Dashboard (`/admin/*`)
- **Stack:** React 19 + Vite, TypeScript, TanStack Query v5, shadcn/ui, Tailwind CSS
- **Backend:** .NET 8 Web API (REST, JWT auth)
- **Auth credentials (dev):** superadmin@badil.com / Superadmin@123
- **Dev server:** localhost:5173

---

## Visual Design System

### Color Palette (dark theme — do NOT change)
```
Background:       #0f1a1a  (body/page)
Surface:          #132020  (cards, sidebar)
Surface-elevated: #1a2a2a  (table rows, inputs)
Border:           #1f3333
Accent-teal:      #00c896  (primary CTA, active nav, links)
Accent-teal-dim:  #00a07a  (hover)
Text-primary:     #e8f4f4
Text-secondary:   #6b9090
Text-muted:       #4a7070
Status-pending:   #b8860b bg / #ffd700 text
Status-reviewing: #1a3a6a bg / #4a9eff text
Status-approved:  #0a3a1a bg / #00c896 text
Status-rejected:  #3a0a0a bg / #ff4a4a text
Danger:           #ef4444
```

### Typography
- Font family: system-ui / Inter (already loaded via Tailwind)
- Page titles: `text-2xl font-bold text-[#e8f4f4]`
- Section labels: `text-xs font-semibold uppercase tracking-widest text-[#6b9090]`
- Body: `text-sm text-[#e8f4f4]`
- Muted: `text-sm text-[#6b9090]`

### Sidebar Layout
```
Width: 240px fixed, full height
Background: #132020
Border-right: 1px solid #1f3333

Top section:
  - Avatar circle (teal bg, white initials, 40px)
  - Name bold, role label muted — stacked

Nav items (each):
  - Icon (lucide, 18px) + label, 40px tall, px-4
  - Default: text-[#6b9090], transparent bg
  - Active: text-[#00c896], bg-[#0f2a2a], left border 2px solid #00c896
  - Hover: text-[#e8f4f4], bg-[#1a2a2a]

Bottom section (pinned):
  - Settings icon (⚙️) MUST use same nav-item style as other links
    → route: /admin/settings
  - Logout button: text-[#ef4444], icon + label, NO bg by default
    → hover: bg-[#3a0a0a]
  CRITICAL: Settings must NOT be a floating icon. Style it identically
  to Verifications, Disputes etc. with icon + "Settings" label.
```

### Tables
```
thead: bg-[#0f1a1a], text-xs uppercase tracking-widest text-[#6b9090]
tbody rows: bg-[#132020], hover:bg-[#1a2a2a], border-b border-[#1f3333]
Cells: px-4 py-3, text-sm
Action buttons: icon-only, 28px, rounded, hover:bg-[#1f3333]
```

### Status Badges
```tsx
const statusClass = {
  pending:   'bg-[#2a1f00] text-[#ffd700] border border-[#b8860b]',
  reviewing: 'bg-[#0a1a3a] text-[#4a9eff] border border-[#1a3a6a]',
  approved:  'bg-[#0a2a15] text-[#00c896] border border-[#1a4a2a]',
  rejected:  'bg-[#2a0a0a] text-[#ff6b6b] border border-[#4a1a1a]',
}
// apply: `text-xs px-2 py-0.5 rounded-full font-medium ${statusClass[status]}`
```

---

## API Contract

### Base URL
```
const API_BASE = import.meta.env.VITE_API_URL ?? 'https://localhost:7000'
```

### Auth
```
POST /api/auth/login          { email, password } → { token, user: { id, email, role } }
POST /api/auth/logout
GET  /api/auth/me             → current user profile
PUT  /api/auth/me             { displayName?, currentPassword, newPassword }
```

### Admin – Factory Verifications
```
GET    /api/admin/verifications?status=pending|reviewing|approved|rejected&page=1&pageSize=20
PATCH  /api/admin/verifications/{id}/approve    body: {}
PATCH  /api/admin/verifications/{id}/reject     body: { reason: string }
GET    /api/admin/verifications/{id}            → full detail + doc URL
```

### Admin – Disputes
```
GET    /api/admin/disputes?status=open|resolved&page=1&pageSize=20
GET    /api/admin/disputes/{id}
PATCH  /api/admin/disputes/{id}/assign          { adminId: string }
PATCH  /api/admin/disputes/{id}/resolve         { resolution: string, winner: 'buyer'|'seller'|'split' }
GET    /api/admin/disputes/{id}/messages
POST   /api/admin/disputes/{id}/messages        { content: string }
```

### Admin – User Management
```
GET    /api/admin/users?search=&page=1&pageSize=20
GET    /api/admin/users/{id}
PATCH  /api/admin/users/{id}/role               { role: 'user'|'admin'|'superadmin' }
DELETE /api/admin/users/{id}
```

### Admin – Analytics
```
GET /api/admin/analytics/overview   → { totalUsers, totalFactories, activeOffers, completedDeals, co2Saved, wasteDiverted }
GET /api/admin/analytics/charts     → { dealsByMonth: [...], wasteByCategory: [...], userGrowth: [...] }
GET /api/admin/analytics/export     → PDF blob (compliance report)
```

### Admin – Dashboard
```
GET /api/admin/dashboard/stats      → { totalUsers, totalAdmins, activeDisputes, pendingVerifications }
GET /api/admin/dashboard/recent-verifications?limit=5
GET /api/admin/dashboard/recent-disputes?limit=5
```

### Admin – Settings / Profile
```
GET  /api/admin/settings            → { notifyEmail, notifyInApp, ... }
PUT  /api/admin/settings            { notifyEmail?, notifyInApp? }
```

---

## TanStack Query v5 Patterns

```tsx
// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['admin', 'verifications', { status, page }],
  queryFn: () => api.get(`/admin/verifications?status=${status}&page=${page}`),
})

// Mutation with optimistic invalidation
const approveMutation = useMutation({
  mutationFn: (id: string) => api.patch(`/admin/verifications/${id}/approve`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    toast.success('Factory approved')
  },
})
```

---

## File Structure (admin section only)

```
src/
  pages/admin/
    AdminLayout.tsx          ← sidebar + outlet
    DashboardPage.tsx
    VerificationsPage.tsx
    VerificationDetailPage.tsx
    DisputesPage.tsx
    DisputeDetailPage.tsx
    UserManagementPage.tsx
    AnalyticsPage.tsx
    SettingsPage.tsx         ← admin profile + preferences
  components/admin/
    StatCard.tsx
    VerificationTable.tsx
    DisputeTable.tsx
    UserTable.tsx
    RoleDropdown.tsx
    StatusBadge.tsx
    RejectModal.tsx
    ResolveDisputeModal.tsx
    AnalyticsCharts.tsx
  hooks/admin/
    useAdminStats.ts
    useVerifications.ts
    useDisputes.ts
    useUsers.ts
    useAnalytics.ts
  api/
    adminApi.ts              ← all admin axios calls
```

---

## Known Bugs to Fix (from screenshots)

1. **Sidebar Settings icon** — currently rendered as a floating gear icon separate from the nav. Must be a proper nav link with `<Settings />` icon + "Settings" text, same style as other nav items.

2. **Verifications page** — currently shows only a placeholder card. Must render the full verifications table with filters (All / Pending / Reviewing / Approved / Rejected), search, and approve/reject actions with confirmation modal.

3. **Disputes page** — placeholder only. Must render dispute list, detail view, assign admin, and resolution form with winner selection.

4. **User Management** — role dropdown change fires no API call. Must call `PATCH /api/admin/users/{id}/role` on change with toast feedback. Dropdown must be styled (dark bg, teal focus ring). Search input must filter via API (`?search=`).

5. **Analytics page** — placeholder. Must show metric cards + recharts bar/line charts + Export PDF button.

6. **No Settings/Profile page** — must create `/admin/settings` with: display name edit, password change form, notification preferences toggle.

---

## Error Handling Standard

```tsx
// All mutations follow this pattern:
onError: (err: AxiosError) => {
  const msg = (err.response?.data as any)?.message ?? 'Something went wrong'
  toast.error(msg)
}
// Show inline skeleton loaders while isLoading, not spinners
// Empty states: centered icon + text, not blank pages
```

---

## Do / Don't

| DO | DON'T |
|---|---|
| Use shadcn/ui `<Table>`, `<Dialog>`, `<Select>`, `<Badge>` | Don't build raw HTML tables |
| Use `lucide-react` icons | Don't use emoji as icons |
| Invalidate related queries on mutation success | Don't refetch manually |
| Show toast (sonner) for every action success/error | Don't use alert() |
| Use Tailwind arbitrary values `bg-[#132020]` for brand colors | Don't add a new CSS file |
| Keep each page file under 200 lines; extract components | Don't put everything in one file |
| Type all API responses with TypeScript interfaces | Don't use `any` |
