# KDial MySQL migration status

## What is implemented locally

The branch `wabi/hostinger-mysql-backend` contains a Hostinger-oriented Node.js/MySQL candidate. It moves directory and the current administration, intake, and manual payment-report flows onto server-side MySQL APIs. MySQL credentials are read only by the Node server; browser code calls same-origin endpoints and never receives the database password.

- Migrations `mysql/migrations/001_public_directory.sql` through `004_admin_password_recovery.sql` create taxonomy, listings, admin identity/sessions, audit, moderated submissions, payment offers/reports, analytics, and password-reset storage. Standard taxonomy values are seeded; no real business or customer data is seeded.
- Public directory reads and server-rendered directory/sitemap use a narrow MySQL projection. A listing is returned only when the backend's consent/content, current-term, amount and manually verified bank-credit gates pass.
- The MySQL admin supports first-owner bootstrap, server-side login/session/logout, role-checked workspace access, draft create/edit, taxonomy create/delete, content review, owner-confirmed terms, publication state changes, submission review, payment-offer preview setup, payment-report recording, bank reconciliation, audit history, password change and password recovery. Admin changes are validated, protected by origin/session-bound CSRF checks and audited. Role checks and publication gates are enforced on the server, not only in the UI.
- Public submission intake and customer payment-report pages use server-side validation, Turnstile verification, rate controls and MySQL persistence. A report is only a report; it never marks money as received. Publication still requires a separate authorized human reconciliation of actual bank credit.
- In MySQL build mode, directory/admin/payment/submission UI uses the MySQL APIs. The legacy Supabase browser client is dynamically loaded only in the non-MySQL adapter. MySQL admin and public-action routes do not fall back to Supabase if configuration or a database call fails; they fail closed. MySQL mode does not send A/B analytics to Supabase.
- `server/mysql/bootstrap-owner.mjs` creates the first owner once, prompting for a password without echoing it. Additional admin accounts/role assignments require deliberate database-side provisioning by an authorized operator; there is no public registration or in-app role-management screen.

## Important limits before production

This is a local migration candidate, not a deployed or production-verified system. No production database/data migration, hosting purchase, external account change or deployment occurred. The repository's prior non-MySQL/Supabase adapter and SQL/functions remain for other deployment targets; the MySQL branch is a separate adapter, not a deletion of all Supabase source code.

- Public Hostinger docs currently list Node 22/24, ZIP deployment, Managed MySQL and daily/on-demand backups; the MySQL connection guide uses `127.0.0.1:3306` and does not specify TLS behavior. Code now defaults to verified TLS for remote databases and permits TLS-off only for literal loopback addresses. The exact plan's runtime, local TLS behavior, database version, limits and actual backup/restore are not validated without a provisioned account.
- No production-data export/import or dual-run reconciliation has been performed. Migration DDL has been exercised on disposable local MariaDB, but the existing user must still arrange a reviewed, backed-up data migration before changing live traffic.
- Local dump/restore testing does not prove Hostinger's backup retention, restore access, point-in-time recovery or service recovery time. Follow Hostinger's account-specific backup/export guidance and perform an isolated restore with the actual provisioned database before launch.
- The first owner is bootstrapped interactively. Staff creation/role changes need a separately authorized database operator; never expose the DB credential or bootstrap command to the browser. Password recovery requires SMTP variables; when SMTP is absent the server fails closed. Public submissions and payment reports require Turnstile plus a sufficiently strong server-side rate-limit secret. Customer offer previews require the intended UPI display settings; unset configuration does not produce an active payment offer.
- Payment collection remains manual UPI with customer-submitted evidence and independent manual bank reconciliation. There is no payment processor/webhook, automatic payment confirmation, automated refund or payment guarantee. A missing integration/configuration must not be represented as available.
- This work has not been deployed or reviewed as a production security certification. Review privacy/retention, operational monitoring, account recovery, role assignment, incident response and real-world legal/business terms before launch.

## Local verification performed

These checks passed against the current local source; they do not certify a Hostinger account or production environment.

- `pnpm check` passed: lint had no errors (14 existing Fast Refresh warnings), typecheck, unit tests, production build/prerender, SEO, dependency hardening, HTTP routes and sitemap tests.
- A separate production build with `VITE_DIRECTORY_API_MODE=hostinger-mysql VITE_DIRECTORY_BACKEND_ENABLED=false pnpm build` passed; the built browser assets contained no server database/SMTP/Turnstile credential assignment markers. This verifies the client build path only, not server or Hostinger runtime configuration.
- `pnpm test:mysql-config` verifies certificate-checked TLS by default and forbids TLS-off on non-loopback database hosts; literal loopback support matches Hostinger's published connection instructions.
- `pnpm test:mysql`, `pnpm test:hostinger`, `pnpm test:pages`, `pnpm test:edge`, and `pnpm test:payment-edge` passed. The edge suites confirm missing security/runtime configuration fails closed.
- `pnpm test:mysql-admin-integration` passed against a disposable local MariaDB database. It covers migrations, first-owner bootstrap, authentication/session and CSRF checks, protected draft writes, moderation/terms/payment/report/reconciliation/publication, taxonomy, intake, analytics and recovery. It also checks that publisher dashboard responses do not expose applicant submissions. Test-created database/user resources are removed.
- `pnpm test:mysql-ui` passed the local browser login, content/terms/offer/reconciliation/publication, draft editing, taxonomy and logout flows, including no Supabase requests in MySQL mode.
- `pnpm test:submission-ui` passed responsive Turnstile and mocked API submission browser tests. The DB-backed API behavior is covered separately by the MariaDB integration suite.
- `pnpm test:mysql-backup-restore` passed a local MariaDB dump/restore round-trip for 15 tables with a synthetic fixture. It does not test Hostinger backup/restore facilities.
- `pnpm test:security` passed against the retained local PostgreSQL/Supabase policy suite. It is not a MySQL test.
- `git diff --check` passed after the final source changes.

A clean local run proves only the tested local paths. It does not mean existing production records have been migrated or that a Hostinger deployment is working.
