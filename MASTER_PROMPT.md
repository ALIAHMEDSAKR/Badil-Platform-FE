# BADIL ADMIN DASHBOARD — MASTER PROMPT
**For:** Claude Code (autonomous agent)
**Project:** Badil Industrial Symbiosis Marketplace — Admin Panel
**Stack:** React 19 + Vite + TypeScript + TanStack Query v5 + shadcn/ui + Tailwind CSS
**Backend:** .NET 8 REST API (JWT)

---

## MANDATORY FIRST STEP

Before writing ANY code, read `SKILL.md` in full. It defines:
- Exact color values you must use (dark theme, no deviations)
- All API endpoints with correct paths and payloads
- The file structure you must follow
- Known bugs you must fix
- TanStack Query v5 patterns (syntax changed from v4 — do not use old patterns)

Do not proceed past this instruction until you have read and internalized SKILL.md.

---

## CONTEXT

The admin panel is at `/admin/*`. It already exists in the repo with basic routing and a sidebar. The UI is dark-themed (see SKILL.md for exact colors). All pages currently show placeholder content. The sidebar has a broken Settings icon. User Management role changes don't call the API. Nothing is wired to real data.

Your job: complete the admin panel end-to-end. Real API calls, real data, proper UI, all bugs fixed.

---

## PHASE 0 — Audit & Setup (do this first, no UI changes yet)

**Goal:** Understand what exists before touching it.

1. List all files under `src/pages/admin/` and `src/components/admin/`
2. Read `AdminLayout.tsx` — note sidebar structure, nav items, router outlet
3. Read `src/api/` or equivalent — note how axios is configured, how auth token is attached
4. Check `package.json` — confirm these are installed: `@tanstack/react-query`, `lucide-react`, `sonner`, `recharts`. If any are missing, install them.
5. Check if a global `toast` provider (sonner `<Toaster />`) is mounted in `App.tsx` or `main.tsx`. If not, add it.
6. Check if `QueryClientProvider` is mounted. If not, add it with `staleTime: 1000 * 60 * 5`.
7. Write a summary comment at the top of your work log: what exists, what's missing, what needs fixing.

**Do NOT modify any UI in Phase 0.**

---

## PHASE 1 — Fix AdminLayout & Sidebar

**Files to modify:** `src/pages/admin/AdminLayout.tsx` (or wherever the sidebar lives)

### 1.1 Sidebar structure
The sidebar must have exactly this structure (top to bottom):

**Top section:**
- Avatar: teal circle (`bg-[#00c896]`), white initials, 40px. Show `SA` by default, or real initials from auth.
- Name: `text-sm font-semibold text-[#e8f4f4]`
- Role label: `text-xs text-[#6b9090]` — show "Level 3 Access" for superadmin

**Nav items (in order):**
- Dashboard → `/admin`
- Verifications → `/admin/verifications`
- Disputes → `/admin/disputes`
- User Management → `/admin/users`
- Analytics → `/admin/analytics`

Each nav item: `flex items-center gap-3 px-4 h-10 text-sm rounded-none`
- Inactive: `text-[#6b9090] hover:text-[#e8f4f4] hover:bg-[#1a2a2a]`
- Active (use `NavLink` with `isActive`): `text-[#00c896] bg-[#0f2a2a] border-l-2 border-[#00c896]`

**Bottom section (pinned with `mt-auto`):**
- **Settings** — MUST be a `NavLink` to `/admin/settings` styled IDENTICALLY to other nav items. Use `<Settings />` from lucide-react. Label: "Settings". This is a bug fix — the current floating icon must be replaced.
- **Logout** — `flex items-center gap-3 px-4 h-10 text-sm text-[#ef4444] hover:bg-[#2a0a0a] w-full cursor-pointer`

### 1.2 Logout handler
On logout click: call `POST /api/auth/logout`, clear token from localStorage/context, redirect to `/login`.

### 1.3 Responsive
On mobile (<768px) sidebar collapses to icon-only (48px wide). Add hamburger toggle. This is lower priority — implement only after all pages work.

---

## PHASE 2 — Dashboard Page

**File:** `src/pages/admin/DashboardPage.tsx`

### 2.1 Stat cards (top row)
Call `GET /api/admin/dashboard/stats` with TanStack Query.
Show 4 cards:
- Total Users → icon: `<Users />`
- Total Admins → icon: `<Shield />`
- Active Disputes → icon: `<AlertTriangle />` (red tint if > 0)
- Pending Verifications → icon: `<Clock />` (amber tint if > 0)

Card style: `bg-[#132020] border border-[#1f3333] rounded-lg p-5`
Number: `text-3xl font-bold text-[#e8f4f4] mt-2`
Label: `text-sm text-[#6b9090]`
Skeleton: show 4 skeleton cards while loading.

### 2.2 Page header
- Title: "Admin Dashboard" `text-2xl font-bold`
- Subtitle: "Platform overview, pending verifications, and active disputes."
- Top-right buttons: `<Filters />` (outline) and `<Export Report />` (teal filled) — Export calls `GET /api/admin/analytics/export` and triggers PDF download.

### 2.3 Pending Factory Verifications table
Call `GET /api/admin/dashboard/recent-verifications?limit=5`.
Columns: Factory Name (+ FAC ID below), Industry Type, Submitted Doc (link), Date, Status badge, Actions (✓ approve / ✗ reject).

- Approve: call `PATCH /api/admin/verifications/{id}/approve`, show success toast, invalidate queries
- Reject: open `<RejectModal>` dialog asking for reason, then call `PATCH /api/admin/verifications/{id}/reject`
- "View All History" link → navigates to `/admin/verifications`

### 2.4 Active Disputes table (below verifications)
Call `GET /api/admin/dashboard/recent-disputes?limit=5`.
Columns: Dispute ID, Transaction, Buyer, Seller, Opened Date, Status, Action (View).
"View All" link → `/admin/disputes`

---

## PHASE 3 — Verifications Page

**Files:** `src/pages/admin/VerificationsPage.tsx`, `src/pages/admin/VerificationDetailPage.tsx`

### 3.1 Filter bar
Tab pills: All | Pending | Reviewing | Approved | Rejected
Active tab: `bg-[#00c896] text-[#0f1a1a]` pill
Inactive: `text-[#6b9090] hover:text-[#e8f4f4]`

Search input: `placeholder="Search by factory name or FAC ID..."` — debounce 300ms, pass as `?search=` query param.

### 3.2 Table
Columns: Factory Name / FAC ID, Industry Type, Submitted Doc, Date, Status, Actions
- Actions: Approve (✓) and Reject (✗) buttons — same behavior as dashboard
- Click on factory name → navigate to `/admin/verifications/{id}`

### 3.3 Pagination
`page` and `pageSize=20` params. Show "Showing X–Y of Z" + Prev/Next buttons.

### 3.4 Detail page `/admin/verifications/{id}`
- Header: Factory name, FAC ID, status badge, action buttons
- Sections: Factory Info (name, sector, location), Submitted Documents (list with download links), Verification History (timeline of status changes)
- Reject modal: `<Dialog>` with `<Textarea>` for reason, confirm button

---

## PHASE 4 — Disputes Page

**Files:** `src/pages/admin/DisputesPage.tsx`, `src/pages/admin/DisputeDetailPage.tsx`

### 4.1 Disputes list
Filter tabs: All | Open | Resolved
Table columns: Dispute ID, Transaction ID, Parties (Buyer → Seller), Opened Date, SLA (days remaining — highlight red if < 2), Assigned Admin, Status, Action (View)

### 4.2 Detail page `/admin/disputes/{id}`
Layout: 2-column (left: case info + actions, right: message thread)

**Left column:**
- Case header: ID, status badge, opened date
- Parties: buyer name/email, seller name/email
- Transaction details: amount, item, quantity
- **Assign to admin** dropdown — calls `PATCH /api/admin/disputes/{id}/assign`
- **Resolve dispute** button → opens `<ResolveDisputeModal>`

**ResolveDisputeModal:**
- Textarea: resolution notes
- Radio: Winner = Buyer | Seller | Split
- Confirm → `PATCH /api/admin/disputes/{id}/resolve`

**Right column — Message thread:**
- Messages list (scrollable, newest at bottom)
- Each message: avatar, sender name, timestamp, content
- Input + Send button → `POST /api/admin/disputes/{id}/messages`
- Auto-scroll to bottom on new message

---

## PHASE 5 — User Management Page

**File:** `src/pages/admin/UserManagementPage.tsx`

### 5.1 Fix search
Search input must be controlled, debounced 300ms, and passed as `?search=` to `GET /api/admin/users`.
Placeholder: "Search by email, role, or ID..."
Show full-width input with search icon inside (lucide `<Search />`).

### 5.2 Fix role dropdown
Current bug: dropdown changes don't call API.

Fix:
```tsx
// Use shadcn/ui <Select> component — do NOT use native <select>
<Select
  defaultValue={user.role}
  onValueChange={(newRole) => {
    updateRoleMutation.mutate({ userId: user.id, role: newRole })
  }}
>
  <SelectTrigger className="w-36 bg-[#1a2a2a] border-[#1f3333] text-[#e8f4f4]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-[#132020] border-[#1f3333]">
    <SelectItem value="user">User</SelectItem>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="superadmin">Superadmin</SelectItem>
  </SelectContent>
</Select>
```

Mutation: `PATCH /api/admin/users/{id}/role` with `{ role }`.
On success: toast "Role updated", invalidate `['admin', 'users']`.
On error: toast error, revert dropdown to original value.

### 5.3 Delete user
Trash icon → open confirm dialog "Are you sure you want to delete this user? This cannot be undone."
On confirm: `DELETE /api/admin/users/{id}` → toast + invalidate.

### 5.4 Table
Add "All Users (N)" header showing count.
Truncated user ID: show first 8 chars + `...` with full ID on hover (tooltip).

---

## PHASE 6 — Analytics Page

**File:** `src/pages/admin/AnalyticsPage.tsx`

### 6.1 Metric cards (top row)
Call `GET /api/admin/analytics/overview`. Show:
- Total Users
- Active Offers
- Completed Deals
- CO₂ Saved (kg)
- Waste Diverted (tons)

### 6.2 Charts (use recharts)
Call `GET /api/admin/analytics/charts`.

**Chart 1:** "Deals by Month" — `<BarChart>` with teal bars (`#00c896`)
**Chart 2:** "User Growth" — `<LineChart>` with teal line
**Chart 3:** "Waste by Category" — `<PieChart>` with teal shades

Chart container: `bg-[#132020] border border-[#1f3333] rounded-lg p-5`
Chart title: `text-sm font-semibold text-[#e8f4f4] mb-4`
If API returns empty data, show "No data available yet" centered inside chart container.

### 6.3 Export button
"Export Compliance Report" teal button (top right) → calls `GET /api/admin/analytics/export` → triggers browser PDF download with filename `badil-compliance-${date}.pdf`.

---

## PHASE 7 — Settings / Profile Page

**File:** `src/pages/admin/SettingsPage.tsx`
**Route:** `/admin/settings`

### 7.1 Profile section
Call `GET /api/auth/me` to populate.
Fields: Display Name (text input), Email (read-only).
Save button → `PUT /api/auth/me { displayName }` → toast success.

### 7.2 Change password section
Fields: Current Password, New Password, Confirm New Password.
Validation: new === confirm before submitting.
Submit → `PUT /api/auth/me { currentPassword, newPassword }` → toast success or error.

### 7.3 Notification preferences
Toggle switches (shadcn `<Switch />`):
- Email notifications for new verifications
- Email notifications for new disputes
- In-app notifications

Load from `GET /api/admin/settings`, save on toggle change → `PUT /api/admin/settings`.

### 7.4 Layout
Two-column card layout on desktop, single column on mobile.
Section headers: `text-sm font-semibold uppercase tracking-wider text-[#6b9090] mb-4 pb-2 border-b border-[#1f3333]`

---

## PHASE 8 — Polish & Hardening

Do this last, only after all pages render correctly with real data.

### 8.1 Empty states
Every table/list must have an empty state when data is empty:
```tsx
<div className="flex flex-col items-center justify-center py-16 text-[#6b9090]">
  <IconComponent size={40} className="mb-3 opacity-40" />
  <p className="text-sm">No {entityName} found</p>
</div>
```

### 8.2 Error states
If a query fails, show:
```tsx
<div className="text-center py-12 text-[#6b9090]">
  <p>Failed to load data.</p>
  <button onClick={() => refetch()} className="mt-2 text-[#00c896] text-sm hover:underline">
    Try again
  </button>
</div>
```

### 8.3 Loading skeletons
Use shadcn `<Skeleton />` for all loading states. Stat cards: 4 rectangle skeletons. Tables: 5 row skeletons.

### 8.4 Confirm dialogs
All destructive actions (delete user, reject factory, resolve dispute) MUST use `<AlertDialog>` from shadcn/ui, not `window.confirm`.

### 8.5 Accessibility
- All icon-only buttons must have `aria-label`
- Table `<th>` elements must have `scope="col"`
- Modals must trap focus

---

## EXECUTION RULES FOR THE AGENT

1. **Read SKILL.md before every phase** — colors, API paths, and patterns are there.
2. **One phase at a time.** Complete and verify before moving to the next.
3. **Never use mock/hardcoded data** in final output. Skeleton loaders during loading, real API data when loaded.
4. **Never use `any` type.** Define interfaces for all API responses.
5. **Never use `alert()` or `confirm()`.** Always use shadcn dialogs + sonner toasts.
6. **Do not change the dark color theme.** Use exact hex values from SKILL.md.
7. **TanStack Query v5 syntax only.** `useQuery({ queryKey, queryFn })` — not the old object-style.
8. **After each phase, list what was changed** (file paths) and what the agent should test manually.

---

## PHASE CHECKLIST

| Phase | Description | Done? |
|-------|-------------|-------|
| 0 | Audit repo, install missing deps, add providers | ☐ |
| 1 | Fix AdminLayout sidebar (Settings nav item, logout) | ☐ |
| 2 | Dashboard: stat cards + verifications table + disputes table | ☐ |
| 3 | Verifications: filter tabs, search, table, detail page | ☐ |
| 4 | Disputes: list, detail, assign, resolve, message thread | ☐ |
| 5 | User Management: fix search, fix role dropdown API call, delete | ☐ |
| 6 | Analytics: metric cards, 3 charts, PDF export | ☐ |
| 7 | Settings: profile edit, password change, notification prefs | ☐ |
| 8 | Polish: empty states, error states, skeletons, a11y | ☐ |
