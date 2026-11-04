# KDial local hardening and connected-backend update

This advances the existing website build; it is not a deployed release.

## Repairs completed

1. Added a depth guard for the build-only braces advisory using pnpm's integrity-pinned patch mechanism. Ten regression checks cover normal globs and deep brace/parenthesis input. The package version remains 3.0.3 and the full audit still flags one high advisory; the local mitigation does not erase that fact. Production dependency audit reports none.
2. Replaced directory/profile index.html rewrites with a read-only HTTP rendering function. The build preserves the original SPA shell separately. The HTTP function supplies per-route title/description/canonical/Open Graph metadata, queries only the public published-record RPC with an anon/public key, returns true 404 for unavailable slugs, and distinguishes backend failure with 503. It never has privileged DB access.
3. Ran real local GoTrue Auth, PostgREST, Supabase Edge Runtime and PostgreSQL containers without using a hosted Supabase project. Actual JWTs authorize the real RPCs and SQL migration. Forty-four connected assertions and seven direct HTTP checks passed. The third-party CAPTCHA response is a controlled fixture; this does not prove live Turnstile or hosted integration.

## Evidence and reproduction

- `pnpm check`: lint (14 existing warnings, zero errors), typecheck, six unit tests, build/prerender, SEO, ten dependency tests and ten HTTP tests.
- `pnpm test:connected-local`: creates loopback-only disposable Docker services with generated test JWT secrets; verifies the connected API lifecycle; checks the actual server adapter against real PostgREST; deletes the local containers/network/test secrets afterwards. Needs Docker/sudo and first image downloads. It accepts no remote database target. It does not contact real customers or move money.
- New logs: `artifacts/hardening-check.log`, `artifacts/connected-stack-reproduction.log`, `artifacts/connected-local-stack.log`, `artifacts/connected-http-routes.log`, and dependency-audit logs. Previous visual artifacts are preserved unchanged.

## Access path and remaining checks

The configured project ref (`ypjtbhtbtcdpxazyfccz`) differs from the mailbox's `kdail` ref (`kkhcndmnyejsqraniwxz`). The source runtime URL is unset, not a proven live host. Main must inspect the authenticated Supabase account, distinguish both projects and confirm an isolated staging target before applying anything. Do not infer today's status from an old pause email.

Staging still needs authorized DB/Auth/Edge access, the actual API host/public key, secure server configuration, administrator bootstrap and live Turnstile hostname/action setup. Then verify real browser→Edge submission→private moderation→approval→published discovery without mocks, provider invitation/recovery/token revocation, hosted HTTP routes and sitemap generation. Publication/commercial terms, media uploads, scale/load tests and production rollout remain separate work. Nothing was pushed, deployed, charged or changed in production.
