# MASTER PROMPT — Badil User-Side Audit & Completion

## ROLE
You are an autonomous coding agent working on **Badil**, an AI-powered Industrial
Symbiosis Marketplace (B2B SaaS). Stack: **React 19 + Vite + TypeScript** (frontend),
**.NET 8 Web API** (backend, already complete and working — do not modify it unless
you find a confirmed contract mismatch between frontend and backend).

## SCOPE BOUNDARY — READ THIS FIRST
- **DO NOT touch any Admin pages, Admin routes, Admin components, or Admin-related
  state/services.** The admin side is partially built intentionally and is off-limits
  for this task. If you find shared code (e.g. a shared layout, shared API client,
  shared auth context) that both Admin and User side depend on, you may read it and
  use it, but do not change its behavior in a way that could break Admin — flag it
  instead and ask before changing.
- Your job is the **User side only**: Seller and Buyer experiences.
- Backend (.NET 8) is reported as done. Do not refactor backend architecture. You may
  only touch backend code if you find a concrete, reproducible contract bug (e.g.
  endpoint returns wrong shape, missing validation causing 400s) — and if so, fix
  minimally and document exactly what you changed and why.

## PHASE OVERVIEW

| Phase | Goal | Output | Gate |
|---|---|---|---|
| Phase 0 | Audit codebase, no edits | Audit report | Wait for user go-ahead |
| Phase 1 | Fix the 3 reported bugs only | Bug fixes + changelog | Wait for user confirmation |
| Phase 2 | Fix navigation/flow issues | Flow fixes + changelog | Wait for user confirmation |
| Phase 3 | Build/complete Factory Profile Page | Working page | Wait for user confirmation |
| Phase 4 | Build remaining MVP-tier pages | Working pages | Wait for user confirmation |
| Phase 5 | Build Enhanced-tier pages | Working pages | Wait for user confirmation |
| Phase 6 | Build Advanced-tier pages | Working pages | Final review |

Do not skip ahead to a later phase before the current phase is reviewed and approved,
unless the user explicitly says "proceed automatically through all phases."

---

## PHASE 0 — AUDIT (mandatory, do this first, report back before writing or editing any code)

Do not start implementing anything until you've produced an audit. The user does NOT
have a full inventory of what's done — your first job is to figure out ground truth
from the actual code, not from assumptions.

Produce a report covering:

1. **Route inventory** — list every route currently defined (react-router or
   equivalent), what component it renders, and whether it's User or Admin scope.
2. **Page-by-page status** against this target list (derived from the SRS), marking
   each as `Done / Partial / Missing / Broken`:
   - Login Page
   - Register Page
   - Factory Profile Page (view/edit profile, verification status, geolocation pin)
   - Create Offer Page (Seller)
   - Create Request Page (Buyer)
   - My Listings Page (Seller)
   - My Requests Page (Buyer)
   - Marketplace Browse Page (search + filters)
   - Offer/Request Detail Page
   - AI Matches Page
   - Map Explore Page (radius search, nearest factories)
   - Transaction / Deal Page (escrow status, sample request)
   - Dispute Page
   - Seller Dashboard
   - Buyer Dashboard
   - Environmental Impact Report Page
   - Compliance Report Page
   - Notifications Page/Panel
   - Chat / Messages Page
3. **Navigation/flow map** — trace every nav element (top-left icon, navbar links,
   buttons, redirects after actions like login/register/create listing) and document
   where each one ACTUALLY goes vs where it SHOULD go per intended UX. Explicitly
   check: "top-left icon" routing behavior (user reports clicking it always lands on
   Profile — confirm if intended or a routing bug), post-login redirect, post-register
   redirect, post-create-listing redirect, back-navigation behavior.
4. **Known bugs to reproduce and root-cause** (do not just patch symptoms):
   - Console error: `Cannot update a component (BrowserRouter) while rendering a
     different component (RegisterPage)`. This is a classic "calling
     navigate()/setState during render" bug — find the offending `setState`/`navigate`
     call inside `RegisterPage` (likely called directly in the component body, a
     conditional render path, or a non-memoized effect-less call) and report the exact
     line before fixing.
   - `POST /api/WasteListing` returns `400 Bad Request` when creating a listing. Get
     the actual response body (not just status code) — log/inspect it. Compare the
     payload `wasteListingApi.ts` sends against the .NET 8 endpoint's expected DTO/
     validation rules. Identify the exact field mismatch (missing required field,
     wrong type, wrong enum value, wrong casing, etc).
   - New user registration shows data that "shouldn't be there" — likely state leaking
     across users (stale Redux/Zustand/Context state not reset on register/login,
     cached API response reused for a new user, or a hardcoded/mock fallback value
     rendering before real data loads). Find the actual source: check global state
     initialization, check whether logout/register properly clears prior session
     state, check if there's a seeded/mock default object being rendered as a
     fallback.
   - Factory Profile Page — user cannot find it / unsure it exists. Confirm: does this
     page exist at all? If yes, where is it routed and why isn't it discoverable? If
     no, it needs to be built per SRS section 2.2/3.1 (factory name, sector, address,
     geolocation pin, verification documents, verification status).

5. **Data flow integrity check** — for the User side, confirm that:
   - Auth state is properly scoped per session (no cross-user bleed)
   - API services in the frontend match backend DTOs/contracts (list mismatches found)
   - Loading/error states exist on every page that fetches data (no silent failures)

## PHASE 0 — DELIVERABLE
Output the audit as a structured markdown report BEFORE touching any code. Include:
- The route map
- The page status table
- Root cause for each of the 3 reported bugs (with file:line references)
- A prioritized punch list of what's Missing/Broken, ordered by: (1) blocking bugs,
  (2) missing core flow pages, (3) missing secondary pages

**STOP HERE.** Wait for the user to review the audit and explicitly approve before
starting Phase 1.

## PHASE 1 — FIX THE 3 REPORTED BUGS (only after Phase 0 is approved)

Fix only these three. Nothing else in this phase.

1. **RegisterPage crash**: `Cannot update a component (BrowserRouter) while
   rendering a different component (RegisterPage)`. This is a classic
   "calling navigate()/setState during render" bug — find the offending
   `setState`/`navigate` call inside `RegisterPage` (likely called directly in the
   component body, a conditional render path, or a non-memoized effect-less call).
   Report the exact line, then fix by moving it into the correct lifecycle point
   (event handler or `useEffect`).
2. **`POST /api/WasteListing` returns 400 Bad Request** when creating a listing. Get
   the actual response body (not just status code) — log/inspect it. Compare the
   payload `wasteListingApi.ts` sends against the .NET 8 endpoint's expected DTO/
   validation rules. Identify the exact field mismatch (missing required field, wrong
   type, wrong enum value, wrong casing, etc) and fix the frontend payload to match
   the backend contract.
3. **Cross-user data leak**: new user registration shows data that shouldn't be
   there. Likely state leaking across users (stale Redux/Zustand/Context state not
   reset on register/login, cached API response reused for a new user, or a
   hardcoded/mock fallback value rendering before real data loads). Find the actual
   source — check global state initialization, check whether logout/register properly
   clears prior session state, check for a seeded/mock default object rendering as a
   fallback — and fix at the source.

Each fix gets a short changelog entry: what was wrong, what you changed, how you
verified it (e.g. "created two different test users, confirmed no stale data carries
over").

**STOP HERE.** Wait for the user to confirm these 3 bugs are actually resolved before
starting Phase 2.

---

## PHASE 2 — FIX NAVIGATION & FLOW ISSUES (only after Phase 1 is confirmed)

Using the flow map from Phase 0:
- Confirm/fix the top-left icon behavior (user reports it always lands on Profile —
  confirm if intentional onboarding gate or unintended bug; only change it if
  unintended, and explain which you found).
- Fix post-login redirect, post-register redirect, post-create-listing redirect, and
  any other nav element found to go somewhere unexpected.
- Every navigation element must end up with a single, predictable, documented
  destination. No silent fallback redirects to Profile or Home unless that's
  explicitly the intended UX.

**STOP HERE.** Wait for user confirmation before starting Phase 3.

---

## PHASE 3 — FACTORY PROFILE PAGE (only after Phase 2 is confirmed)

Confirm: does this page exist at all? If yes, where is it routed and why isn't it
discoverable — fix the routing/nav so it's reachable. If no, build it per SRS 3.1:
factory name, sector, address (with geolocation pin on map per SRS 3.8), verification
documents, verification status, view/edit mode. Match the existing visual UI design
(don't introduce a new design language).

**STOP HERE.** Wait for user confirmation before starting Phase 4.

---

## PHASE 4 — REMAINING MVP-TIER PAGES (only after Phase 3 is confirmed)

Build/complete, in this order:
1. Marketplace Browse Page (search + filters)
2. Offer/Request Detail Page
3. My Listings Page (Seller)
4. My Requests Page (Buyer)
5. Chat / Messages Page

**STOP HERE.** Wait for user confirmation before starting Phase 5.

---

## PHASE 5 — ENHANCED-TIER PAGES (only after Phase 4 is confirmed)

Build/complete, in this order:
1. AI Matches Page
2. Map Explore Page (radius search, nearest factories)
3. Seller Dashboard
4. Buyer Dashboard
5. Notifications Page/Panel

**STOP HERE.** Wait for user confirmation before starting Phase 6.

---

## PHASE 6 — ADVANCED-TIER PAGES (only after Phase 5 is confirmed)

Build/complete, in this order:
1. Transaction / Deal Page (escrow status, sample request flow)
2. Dispute Page
3. Environmental Impact Report Page
4. Compliance Report Page

Final review with user after this phase.

## GUARDRAILS THROUGHOUT
- Never touch Admin routes/components/services.
- Never assume backend is wrong before checking the actual response payload and
  comparing against the actual DTO — diagnose from real evidence, not guesses.
- Every navigation element must have a single, predictable, documented destination.
  No silent fallback redirects to Profile or Home unless that's explicitly the
  intended UX (confirm before "fixing" it away).
- Keep the existing visual UI design intact — admin panel UI already exists visually
  per project context; match this established style for new user-side pages rather
  than introducing a new design language.
- After each fix or new page, do a manual flow check: load page → perform primary
  action → confirm correct redirect/state update → confirm no console errors.
