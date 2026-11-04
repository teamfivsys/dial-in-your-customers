#!/usr/bin/env bash
set -euo pipefail
command -v mariadb >/dev/null || { echo 'MariaDB client is required.' >&2; exit 2; }
command -v openssl >/dev/null || { echo 'OpenSSL is required.' >&2; exit 2; }
sudo service mariadb start >/dev/null
suffix="${RANDOM}${RANDOM}"
db="kdial_migration_test_${suffix}"
user="kdial_test_${suffix}"
password="$(openssl rand -hex 24)"
cleanup() {
  sudo mariadb -e "DROP DATABASE IF EXISTS ${db}; DROP USER IF EXISTS '${user}'@'127.0.0.1';" >/dev/null 2>&1 || true
}
trap cleanup EXIT
sudo mariadb -e "CREATE DATABASE ${db} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER '${user}'@'127.0.0.1' IDENTIFIED BY '${password}'; GRANT ALL PRIVILEGES ON ${db}.* TO '${user}'@'127.0.0.1';"
sudo mariadb "${db}" < mysql/migrations/001_public_directory.sql
sudo mariadb "${db}" < mysql/migrations/002_admin_auth_and_draft_write.sql
sudo mariadb "${db}" < mysql/migrations/003_review_payment_submission_analytics.sql
sudo mariadb "${db}" < mysql/migrations/004_admin_password_recovery.sql
KDIAL_MYSQL_HOST=127.0.0.1 KDIAL_MYSQL_PORT=3306 KDIAL_MYSQL_USER="${user}" KDIAL_MYSQL_PASSWORD="${password}" KDIAL_MYSQL_DATABASE="${db}" KDIAL_MYSQL_TLS=false KDIAL_LOCAL_TEST=true KDIAL_MYSQL_TEST_INTEGRATION=true pnpm exec node --test tests/mysql-admin-integration.test.mjs
