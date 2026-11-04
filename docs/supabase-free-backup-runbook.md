# KDial — Supabase Free backup and restore runbook

Checked against Supabase’s backup documentation on October 23, 2026. This is a prepared procedure, not a completed backup or restore test.

## Current KDial state

The dashboard project “KDial Production” (`mbxjtdtephnhpqquyhqr`, Mumbai, Free) showed no migrations, zero public tables, zero Auth users and no available backups when checked on October 22. Supabase Free has no automated project backups; Supabase recommends regular CLI exports kept off-site. The repository’s `supabase/config.toml` still names a different legacy project (`ypjtbhtbtcdpxazyfccz`). Its directory migration is explicitly marked staging-only, and a later payment migration embeds a temporary QR image. Do not run `supabase db push` or apply those files to production as-is.

## Make a manual logical backup

Use an authorized workstation with the Supabase CLI, Docker and `psql` installed. In the Supabase dashboard, open the intended project and copy its database connection string from **Connect** (use the session pooler by default). Keep the URL private; never paste it into chat, source control or this document.

```bash
set -euo pipefail
umask 077
BACKUP_DIR="$HOME/kdial-backups/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BACKUP_DIR"
read -rsp 'Supabase database URL: ' DB_URL
printf '\n'
supabase db dump --db-url "$DB_URL" -f "$BACKUP_DIR/roles.sql" --role-only
supabase db dump --db-url "$DB_URL" -f "$BACKUP_DIR/schema.sql"
supabase db dump --db-url "$DB_URL" -f "$BACKUP_DIR/data.sql" --use-copy --data-only -x 'storage.buckets_vectors' -x 'storage.vector_indexes'
unset DB_URL
sha256sum "$BACKUP_DIR"/*.sql
ls -lh "$BACKUP_DIR"
```

Check that all three files exist, are non-empty, and the command completed without errors. `umask 077` restricts local file permissions; it does not encrypt the files. Encrypt the backup before placing it in an owner-controlled off-site location, and keep the decryption key separately. Do not put these dumps in the application repository. Database dumps do not include the bytes of files stored through Supabase Storage; if KDial uses Storage, back those objects up separately.

## Rehearse restoration safely

Restore only into a separate, newly created test project—not KDial Production. Enable any required non-default extensions first, and obtain that test project’s own connection string. Supabase’s documented logical restore sequence is:

```bash
read -rsp 'Test project database URL: ' RESTORE_DB_URL
printf '\n'
psql \
  --single-transaction \
  --variable ON_ERROR_STOP=1 \
  --file "$BACKUP_DIR/roles.sql" \
  --file "$BACKUP_DIR/schema.sql" \
  --command 'SET session_replication_role = replica' \
  --file "$BACKUP_DIR/data.sql" \
  --dbname "$RESTORE_DB_URL"
unset RESTORE_DB_URL
```

Confirm `psql` exits successfully, then check representative tables, row counts and sign-in/admin behavior in the test project. A restore rehearsal is not complete until those checks pass. Keep any restore test isolated from production.

## Before the first production schema change

1. Reconcile the repository’s legacy project reference with the intended “KDial Production” project; pass an explicit project reference for any CLI action.
2. Review a clean forward-only production migration set. Exclude the embedded temporary payment asset and do not enable customer-facing payment until its terms and settlement path are separately approved.
3. Establish the owner/admin bootstrap procedure and verify access without sharing credentials.
4. Complete a backup and a successful restore rehearsal before enabling the live directory backend.
5. Only then review and approve the production schema change. No production SQL or deployment was run while preparing this guide.

### Scope and limits

This procedure creates logical SQL exports; it is not Supabase’s automated backup service or point-in-time recovery. It does not include Storage object bytes, Edge Function secrets, hosting configuration or a tested KDial production migration. The current blank project has no business data to recover, so the immediate value is establishing and rehearsing the process before production data exists.
