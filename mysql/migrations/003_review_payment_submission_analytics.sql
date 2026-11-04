-- MySQL equivalents of KDial's moderated intake, manual payment reporting and A/B event records.
-- No payment destination or customer/business data is seeded here.
CREATE TABLE submissions (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  payload JSON NOT NULL,
  applicant_email VARCHAR(254) NOT NULL,
  consent_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  review_reason VARCHAR(500) NULL,
  reviewed_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  reviewed_at DATETIME(3) NULL,
  listing_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_submissions_reviewer FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  CONSTRAINT fk_submissions_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL,
  INDEX idx_submissions_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE submission_rate_windows (
  rate_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  started_at DATETIME(3) NOT NULL,
  submission_count INT UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payment_offers (
  listing_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  offer_token CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_payment_offer_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payment_reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  listing_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  event_key VARCHAR(150) NOT NULL UNIQUE,
  source ENUM('manual','youpi') NOT NULL,
  amount_minor INT UNSIGNED NOT NULL,
  evidence_reference VARCHAR(500) NOT NULL,
  reported_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_payment_reports_listing FOREIGN KEY (listing_id) REFERENCES listings(id),
  CONSTRAINT fk_payment_reports_user FOREIGN KEY (reported_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_payment_reports_listing (listing_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ab_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  variant ENUM('A','B') NOT NULL,
  event ENUM('impression','whatsapp_click') NOT NULL,
  session_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  path VARCHAR(500) NULL,
  user_agent VARCHAR(500) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_ab_events_event_created (event, created_at),
  INDEX idx_ab_events_variant (variant, event)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
