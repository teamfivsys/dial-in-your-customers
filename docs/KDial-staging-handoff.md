# KDial directory + admin: local implementation handoff

This is the actual website repository, not a Wabi tracker or replacement app. It is a tested local milestone toward the requested complete product. It is NOT a deployed or hosted-verified release.

## Reproduce locally

Use Node 22.12+ and pnpm 11.9.0 (the exact packageManager version). No secrets are included.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:e2e
pnpm test:submission-ui
pnpm test:edge
pnpm test:security
pnpm test:dependencies
pnpm test:http
# Requires Docker/sudo; creates and cleans isolated loopback-only services:
pnpm test:connected-local
```

`check` runs lint, TypeScript, unit tests, production build, prerender, homepage SEO, dependency-hardening, direct HTTP handler and published-only sitemap tests. Lint has pre-existing Fast Refresh warnings but no errors. Browser tests use Playwright Chromium; install it with `pnpm exec playwright install chromium` and system browser dependencies if needed. `test:edge` uses pinned Deno 2.5.6 and needs the first package download. `test:security` requires local PostgreSQL and a sudo-accessible postgres OS account. It destroys/recreates ONLY `kdial_v1_test`; it cannot accept a remote database URL. Never run this script against a hosted service.

Copy `.env.example` to `.env.local` for public configuration. With backend disabled, production discovery is truthfully empty, submissions are disabled and admin cannot pretend to save. To inspect the fictional, contact-disabled directory locally:

```sh
VITE_DIRECTORY_DEMO=true pnpm dev --host 127.0.0.1
# Open /demo/directory and /demo/businesses/demo-harbour-cafe
```

Fixtures are imported only by explicit demo routes when enabled. Never populate a real database with them. No real listing, bank-credit or package terms are bundled. The original visual browser tests intercept API/auth transport and visibly label those admin and submission screenshots as mocked. The separate `test:connected-local` browser lifecycle instead uses actual local Auth/API/Edge/database persistence; only third-party CAPTCHA is controlled. SQL tests, separately, execute the actual migration and permission checks in isolated PostgreSQL with a test `auth.uid()` context, not Supabase's real authentication service.

## Implemented product paths

- `/directory`: live published-record projection, service/category/locality search, city-wide/no-result/empty/loading/error states, cards and direct profile links/call actions.
- `/businesses/:slug`: address/directions, actual supplied photos/services/hours, business-details verification only after content review, phone and only a supplied, consented WhatsApp channel. No ratings, paid=verified badge or fabricated open-now status.
- `/submit-business`: validated mobile form, authorization/consent, optional WhatsApp consent, CAPTCHA, private pending receipt. It never publishes or collects payment.
- `/admin`: provider authentication and server-maintained role check, search/filter, listing drafts/editing, moderation inbox, category/locality CRUD, content checks and rejection reasons, explicit package terms, payment report, independent bank-credit reconciliation, publication/suspension/expiry, permitted draft deletion, audit actor/timestamps and account-password/recovery UI.
- `vercel.json`: directory/profile requests go through a read-only server HTTP adapter with route-specific metadata and genuine HTTP statuses. Admin/submission/demo routes use explicit SPA rewrites; no blanket rewrite of arbitrary unknown URLs. Legacy internal discovery links redirect to the new directory rather than exposing unsubstantiated old statewide feature claims.

There are no seller accounts, reviews, CRM, auto-follow-ups, native apps or statewide expansion. No new commercial terms were assumed.

## Backend security model

`supabase/migrations/20261019090000_kdial_directory.sql` introduces only namespaced objects. All privileged tables are in `kdial_private`, outside the API-exposed public schema, with RLS enabled and no anon/authenticated table privileges. Public API exposure consists of narrowly granted `SECURITY DEFINER` RPCs with fixed empty search paths, explicit qualified object references, allowlisted fields and database constraints. Every admin RPC checks `auth.uid()` against server-owned `admin_roles`; logging in does NOT grant an admin role. Client-side button visibility is not the security boundary.

Roles:
- `editor`: draft/contents/taxonomy preparation and submission-to-private-draft moderation.
- `publisher`: business-content/consent review and explicit publish/suspend/expire controls; cannot confirm bank credit or alter terms.
- `finance`: record payment reports and independently reconcile actual bank credit; cannot publish, edit content or change commercial terms.
- `owner`: all of those, explicit agreed terms and safe deletion of untouched drafts. Roles cannot be self-assigned through the browser.

YouPI is only a payment report. Paid-listing publication requires separately approved content + consent reference, explicit agreed package/amount/current start/end, and exact actual bank credit manually verified by an authorized finance/owner identity with a reconciliation reference. A trigger prevents bypass through other update paths. The public query rechecks current terms, so past-term listings disappear without relying on a client's clock. Changed terms invalidate previous bank verification and unpublish. Content edits invalidate content approval and unpublish. Repeat payment event keys are idempotent; conflicting duplicates fail. Financial history cannot be deleted through draft deletion.

`submit-business` Edge Function validates origin, size, content and consent; verifies Turnstile action and hostname; HMACs the normalized private email into a server rate key; and calls a service-only RPC. That RPC revalidates and keeps a maximum three submissions/hour per rate key plus a conservative global cap. This is baseline abuse reduction, not a full anti-fraud system. Applicant email is not OTP-verified; content reviewers must independently establish the business's authority and permission before approval. No notification automation is implemented.

## Exact connected-staging dependency (not secrets in chat)

A project operator must authorize a NEW isolated Supabase staging project or identify an existing staging project that may receive these objects, with permission to manage its database, Auth and Edge Functions. Neither project ownership nor admin access has been verified. `supabase/config.toml` identifies legacy project `ypjtbhtbtcdpxazyfccz`; the runtime host is read from `VITE_SUPABASE_URL`, which is blank in the source template. A mailbox lead separately identifies `kdail`, project `kkhcndmnyejsqraniwxz`, in the teamfivsys@gmail.com organization. These references differ: neither is silently chosen as the staging target. The January 2026 pause notice does not establish current account/project state. Inspect both through the authenticated Supabase dashboard, confirm the intended isolated staging target, and obtain its actual API host/public key there. No secret values are included here.

Once access is established through the provider's authenticated/secure setup:

1. Back up/inspect the target. Review and apply this single namespaced migration to staging. Do not blindly `db push` all unrelated historical migrations or apply to production. Verify PostgREST exposes only `public`, never `kdial_private`; reload its schema cache if necessary.
2. Turn off public Auth signups. Set the site's staging URL and allow only its `/admin` invite/recovery redirect. Use provider-managed invites for the first administrator and confirm its Auth UUID. Through the authorized SQL console only, insert that exact real UUID into `kdial_private.admin_roles(user_id,role)` with role `owner`. Do not use the fictional test UUIDs. Test invite/password/recovery in the actual provider before considering admin usable.
3. For the HTTP function, supply server-side `KDIAL_DIRECTORY_BACKEND_ENABLED=true`, `KDIAL_SUPABASE_URL` and `KDIAL_SUPABASE_PUBLISHABLE_KEY` (public/anon only). The server can fall back to the matching `VITE_` values, but explicit function-runtime configuration is recommended. Protect staging from indexing with its host-level X-Robots-Tag. Supply `VITE_DIRECTORY_BACKEND_ENABLED=true`, the staging `VITE_SUPABASE_URL`, and staging PUBLIC/publishable key to the frontend's build environment. No service key may use a `VITE_` prefix or enter a frontend bundle.
4. Configure a Turnstile widget for the exact staging hostname and action `submit_business`. Put only its public site key in `VITE_TURNSTILE_SITE_KEY`. Put its secret and a strong server-only `SUBMISSION_RATE_SECRET` in Supabase Edge Function secrets. Set `KDial_ALLOWED_ORIGINS` to a comma-separated exact origin allowlist with no wildcards. Supabase's own service URL/key stay only in its server environment. Never paste durable secrets into ordinary chat or notes.
5. Deploy only `submit-business` to staging with `verify_jwt=false` (it is an intentionally public intake endpoint), AFTER origin/CAPTCHA configuration. Function publication is not authorized by this handoff. No emails, deployment, migration or hosting setup have been performed by this task.
6. On staging, test the entire browser flow without mocks: real submission -> private pending inbox -> admin accept/reject -> draft CRUD -> separate content/consent -> test-only agreed terms -> report remains unpaid -> exact independently reconciled TEST bank evidence -> explicit publish -> public discovery/profile -> suspend/expiry -> removal from public. Also test refresh-token invalidation, access-JWT expiry behavior, immediate role revocation, unauthorized calls, failed CAPTCHA/replay/host mismatch and recovery links. Use fictional records only and no money movement. Capture evidence before an approval to deploy.

Owner confirmation of actual Founder Package inclusions, term start/duration, renewal/refunds and listing-publication consent is required before real payment collection or paid publication. A temporary static UPI QR is shown in staging admin only after an owner records the listing’s agreed INR terms; it identifies Felix Williams, encodes no amount or listing reference, and is not a KDial-verified merchant QR. The image is a public static asset URL if staging is reachable, so share it only as intended. Reports remain unverified until a separate manual bank-credit reconciliation; there is no public checkout/gateway or automatic payment collection in this milestone.

## Remaining work / limits

- Real GoTrue Auth + PostgREST + Supabase Edge Runtime integration now passes locally against disposable PostgreSQL. Hosted provider integration and deployment remain unverified; no hosted database has been changed. The successful CAPTCHA upstream is deliberately a fixture and is NOT a real Turnstile verification.
- Deployment and production rollout are separate later steps. This package has not been pushed, merged or deployed.
- The dynamic `/sitemap.xml` advertises the homepage and, when active approved records exist, directory and sorted unique published business profiles. It uses the same public projection and excludes suspended/private/expired records; unavailable backend returns 503. A static sitemap is deliberately not generated, so it cannot shadow the function. Route-specific initial HTML/title/canonical/Open Graph metadata is now implemented and locally HTTP-tested, including real published-only API responses and 404 for missing/suspended/expired slugs. Hosted Vercel rewrites and social-crawler rendering remain unverified. This is not a claim of indexed profile pages.
- Public queries/admin state currently fetch their datasets in one RPC for an initial Kochi directory. Before a large rollout, add server-side pagination, query indexes/search and scale/load testing; do not treat this as Justdial-scale architecture.
- Photos are optional reviewed HTTPS URLs, not an upload/storage/media-processing product. Review ownership and permission before publishing. Formal privacy/data-retention terms, backup/restore and production operational hardening remain to be settled.
- No independent accessibility certification, third-party penetration test or performance superiority benchmark has been performed. The visual target does not prove superiority to competitors.
- Production dependency audit currently reports zero advisories. Full build/dev audit retains one high-severity `braces@3.0.3` nested-pattern stack-exhaustion advisory (GHSA-vfj7-8cjw-p6xm), through Tailwind build tooling. The registry did not provide the advisory’s suggested 3.0.4 version during this run. A pnpm integrity-pinned local patch now caps parser AST nesting at 64 before recursive traversal, covering both braces and parentheses; ten focused normal-input/malicious-depth checks passed. The audit still flags package version 3.0.3: this is a local mitigation, not an upstream patch or a clean full audit. Do not process untrusted glob patterns in build tooling; recheck the upstream patch before release. This is not a claim of a vulnerability-free product.

## Final local evidence

- Frozen pnpm install passed.
- Lint: zero errors (pre-existing Fast Refresh warnings remain); TypeScript passed.
- Six unit tests passed; production build/prerender/homepage SEO tests passed.
- Six Playwright directory/admin/responsive/error-recovery tests passed, plus one separately configured public submission UI test. Admin/auth/API and successful submission transport are explicitly mocked.
- 49 PostgreSQL security assertions passed against the actual new migration in an isolated local database. Provider authentication is not simulated as a claim of actual hosted Auth validation.
- Seven local Edge Function HTTP fail-closed checks passed. Live Turnstile/provider acceptance is not tested.
- Production dependency audit: zero reported advisories; full dev/build audit: one high `braces` advisory as above.
- Actual desktop/mobile captures inspected, including directory, profile and admin overview/control forms; no horizontal overflow at tested widths 320/390/768/1024/1440. Nonmodal toast pointer interception was found and repaired; recovery checks reran successfully.

- Added hardening checks: frozen-lock installation, full `pnpm check`, ten parser mitigation tests and ten direct HTTP status/metadata tests and five published-only sitemap tests passed.
- Added connected local checks: 44 assertions with actual Auth-issued JWTs/PostgREST/Edge Runtime/SQL, plus ten direct HTTP adapter/sitemap checks against the real public API; no API/Auth mocks in these added checks. Test accounts and business records are fictional, generated only in disposable local services.
- Connected local tests cover disabled signup, real test-user creation/login/validation, non-admin/role denials, hidden private tables, submission persistence, moderation, terms, payment safety, publication, public discovery, suspension and audit actors. Fourteen additional real local Auth assertions cover recovery-token single use, password replacement, refresh-token revocation and immediate role revocation. One actual connected Chromium lifecycle covers submission, login, moderation, content, terms, unpaid YouPI blocking, separate bank check, publication, anonymous discovery/profile and suspension. Only the CAPTCHA upstream is a controlled fixture. Provider email invite/recovery delivery and live CAPTCHA remain staging work. Existing visual/browser fixture tests remain explicitly mocked.

Evidence logs remain on the retained computer under `artifacts/`; selected sanitized execution receipts accompany the updated source archive. The bootstrap test uses real local services; only the external CAPTCHA verifier is stubbed. This milestone does not close the broader complete-product request.

## Session revocation operational behavior

Local GoTrue global logout invalidates refresh tokens, but an already issued signed access JWT remains accepted by PostgREST until its expiry. This is observed behavior, not immediate access-token invalidation. Emergency admin access removal must delete that exact Auth UUID's row from `kdial_private.admin_roles` through authorized SQL; all admin RPCs recheck the role, and a test proves the same still-unexpired JWT is then denied. Hosted JWT expiry/session settings and provider recovery/invite delivery still need verification. No operator role was removed from any real service.
