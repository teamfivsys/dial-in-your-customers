#!/usr/bin/env bash
set -euo pipefail
# Disposable loopback-only Docker stack. No remote target is accepted.
cd "$(dirname "$0")/.."
for name in kdial-db kdial-auth kdial-rest kdial-edge kdial-gateway; do
 if sudo docker container inspect "$name" >/dev/null 2>&1; then echo "Stop existing isolated $name before running this test; nothing removed." >&2; exit 1; fi
done
cleanup() { sudo docker rm -f kdial-gateway kdial-edge kdial-rest kdial-auth kdial-db >/dev/null 2>&1 || true; sudo docker network rm kdial-local >/dev/null 2>&1 || true; rm -rf .local-stack; }
trap cleanup EXIT
mkdir -p .local-stack/main artifacts
for image in postgres:15-alpine supabase/gotrue:v2.177.0 postgrest/postgrest:v12.2.12 supabase/edge-runtime:v1.67.4 nginx:1.27-alpine; do sudo docker pull "$image" >/dev/null; done
python3 tests/local-stack/start.py
for i in $(seq 1 30); do sudo docker exec kdial-db pg_isready -U postgres >/dev/null 2>&1 && break; sleep 1; done
sudo docker exec -i kdial-db psql -U postgres -v ON_ERROR_STOP=1 <<'SQL'
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create role authenticator login password 'local-only-api-password' noinherit;
grant anon,authenticated,service_role to authenticator;
create role supabase_auth_admin login password 'local-only-auth-password' createrole;
alter role supabase_auth_admin set search_path = auth;
grant all on database postgres to supabase_auth_admin;
create schema auth authorization supabase_auth_admin;
grant usage on schema public to anon,authenticated,service_role;
create extension if not exists pgcrypto;
SQL
python3 tests/local-stack/auth.py
for i in $(seq 1 40); do curl -fs http://127.0.0.1:54321/health >/dev/null && break; sleep 1; done
curl -fs http://127.0.0.1:54321/health >/dev/null
sudo docker exec -i kdial-db psql -U postgres -v ON_ERROR_STOP=1 < supabase/migrations/20261019090000_kdial_directory.sql
python3 tests/local-stack/rest.py
cp tests/local-stack/edge-main.ts .local-stack/main/index.ts
cp tests/local-stack/nginx.conf .local-stack/nginx.conf
python3 tests/local-stack/edge.py
sudo docker run -d --name kdial-gateway --network kdial-local -p 127.0.0.1:54324:8000 -v "$PWD/.local-stack/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:1.27-alpine >/dev/null
for i in $(seq 1 30); do curl -fs http://127.0.0.1:54324/rest/v1/ >/dev/null && break; sleep 1; done
# Await module-cache startup by requesting a forbidden Origin; never resubmit an intake request.
for i in $(seq 1 30); do status=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:54325/ || true); [ "$status" = 403 ] && break; sleep 1; done
python3 tests/local-stack/integration.py | tee artifacts/connected-local-stack.log
python3 tests/local-stack/auth-security.py | tee artifacts/connected-auth-security.log
node tests/local-stack/http-connected.mjs | tee artifacts/connected-http-routes.log
pnpm exec playwright test --config=playwright.connected.config.ts | tee artifacts/connected-browser.log
