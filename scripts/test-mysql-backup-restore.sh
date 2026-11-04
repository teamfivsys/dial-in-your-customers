#!/usr/bin/env bash
set -euo pipefail

# Local disposable MariaDB dump/restore test. Names are random; cleanup only drops these names.
for tool in mariadb mariadb-dump openssl; do
  command -v "$tool" >/dev/null || { echo "$tool is required." >&2; exit 2; }
done
sudo service mariadb start >/dev/null
suffix="$(openssl rand -hex 8)"
db="kdial_backup_test_${suffix}"
restore_db="kdial_restore_test_${suffix}"
user="kdial_backup_${suffix}"
password="$(openssl rand -hex 24)"
tmp="$(mktemp -d)"
chmod 700 "$tmp"
cnf="$tmp/client.cnf"
printf '[client]\nhost=127.0.0.1\nuser=%s\npassword=%s\n' "$user" "$password" > "$cnf"
chmod 600 "$cnf"
cleanup() {
  sudo mariadb -e "DROP DATABASE IF EXISTS ${db}; DROP DATABASE IF EXISTS ${restore_db}; DROP USER IF EXISTS '${user}'@'127.0.0.1';" >/dev/null 2>&1 || true
  rm -rf -- "$tmp"
}
trap cleanup EXIT
sudo mariadb -e "CREATE DATABASE ${db} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE DATABASE ${restore_db} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER '${user}'@'127.0.0.1' IDENTIFIED BY '${password}'; GRANT ALL PRIVILEGES ON ${db}.* TO '${user}'@'127.0.0.1'; GRANT ALL PRIVILEGES ON ${restore_db}.* TO '${user}'@'127.0.0.1';"
for migration in mysql/migrations/001_public_directory.sql mysql/migrations/002_admin_auth_and_draft_write.sql mysql/migrations/003_review_payment_submission_analytics.sql mysql/migrations/004_admin_password_recovery.sql; do
  sudo mariadb "$db" < "$migration"
done
# Synthetic fixture only; no customer or production data is read or copied.
sudo mariadb "$db" <<'SQL'
INSERT INTO listings (id,slug,name,category_slug,locality_slug,address,phone,description,services,hours,photos)
VALUES ('550e8400-e29b-41d4-a716-446655440000','restore-fixture','Restore Fixture','cafes','kaloor','10 Synthetic Test Street, Kochi','+919876543210','Synthetic fixture used only to verify a local database restore.','["test"]','[]','[]');
SQL
mariadb-dump --defaults-extra-file="$cnf" --single-transaction --routines --triggers --events --hex-blob --default-character-set=utf8mb4 "$db" > "$tmp/backup.sql"
[ -s "$tmp/backup.sql" ] || { echo 'Dump file is empty.' >&2; exit 1; }
mariadb --defaults-extra-file="$cnf" "$restore_db" < "$tmp/backup.sql"

tables=(categories localities listings admin_users admin_bootstrap_guard admin_sessions admin_login_attempts admin_audit_events submissions submission_rate_windows payment_offers payment_reports ab_events admin_password_reset_tokens admin_password_reset_attempts)
counts() {
  local schema="$1"
  for table in "${tables[@]}"; do
    printf '%s=' "$table"
    mariadb --defaults-extra-file="$cnf" --batch --skip-column-names "$schema" -e "SELECT COUNT(*) FROM ${table};"
  done
}
before="$(counts "$db")"
after="$(counts "$restore_db")"
[ "$before" = "$after" ] || { echo 'Backup/restore table counts differ.' >&2; diff -u <(printf '%s\n' "$before") <(printf '%s\n' "$after") || true; exit 1; }
fixture="$(mariadb --defaults-extra-file="$cnf" --batch --skip-column-names "$restore_db" -e "SELECT CONCAT(slug,':',content_status,':',publication_status) FROM listings WHERE id='550e8400-e29b-41d4-a716-446655440000';")"
[ "$fixture" = 'restore-fixture:draft:unpublished' ] || { echo 'Synthetic fixture did not restore as expected.' >&2; exit 1; }
printf 'Local MariaDB backup/restore round-trip passed: %s tables checked, synthetic fixture restored. Disposable databases and user will be removed.\n' "${#tables[@]}"
