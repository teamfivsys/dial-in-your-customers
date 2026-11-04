#!/usr/bin/env bash
set -euo pipefail
# Local PostgreSQL test database only. Never accepts a hosted URL.
DB=kdial_v1_test
sudo -u postgres dropdb --if-exists "$DB"
sudo -u postgres createdb "$DB"
sudo -u postgres psql -v ON_ERROR_STOP=1 -d "$DB" <<'SQL'
DO $$ BEGIN IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF; IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF; IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN; END IF; END $$;
CREATE SCHEMA auth;
CREATE TABLE auth.users(id uuid primary key);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon,authenticated,service_role;
SQL
for migration in supabase/migrations/*.sql; do
  sudo -u postgres psql -v ON_ERROR_STOP=1 -d "$DB" -f "$migration"
done
sudo -u postgres psql -v ON_ERROR_STOP=1 -d "$DB" -f tests/sql/directory-security.sql
