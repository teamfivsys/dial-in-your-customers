-- MySQL-side admin identity/session foundation and audited draft-write path.
-- Review, submission, manual payment and offer tables are added by migrations 003–004.
-- Apply only to a new/disposable database after reviewing compatibility with Hostinger's MySQL version.

CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  email_normalized VARCHAR(254) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL UNIQUE,
  password_salt BINARY(16) NOT NULL,
  password_hash BINARY(64) NOT NULL,
  role ENUM('owner','editor','publisher','finance') NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT chk_admin_email CHECK (email REGEXP '^[^[:space:]@]+@[^[:space:]@]+\\.[^[:space:]@]+$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_bootstrap_guard (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  completed_at DATETIME(3) NULL,
  CONSTRAINT chk_admin_bootstrap_singleton CHECK (id=1)
) ENGINE=InnoDB;
INSERT IGNORE INTO admin_bootstrap_guard(id,completed_at) VALUES (1,NULL);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  admin_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_admin_sessions_user FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_admin_sessions_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  email_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  window_started_at DATETIME(3) NOT NULL,
  attempts SMALLINT UNSIGNED NOT NULL,
  INDEX idx_admin_login_window (window_started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_audit_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  actor_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  entity_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  action VARCHAR(80) NOT NULL,
  details JSON NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_admin_audit_actor FOREIGN KEY (actor_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_admin_audit_entity (entity_id,created_at),
  INDEX idx_admin_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
