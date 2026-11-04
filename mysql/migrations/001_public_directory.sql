-- KDial MySQL read-side foundation for Hostinger Managed Node.js.
-- Apply manually to a newly provisioned database only after reviewing the SQL and taking a backup.
-- The Node server exposes only the publishability-filtered public read projection; no browser DB credentials.
-- Admin identity/session and moderated intake/manual payment workflows are added by migrations 002–004.

CREATE TABLE IF NOT EXISTS categories (
  slug VARCHAR(100) NOT NULL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  CONSTRAINT chk_categories_slug CHECK (slug REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT chk_categories_label CHECK (CHAR_LENGTH(label) BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS localities (
  slug VARCHAR(100) NOT NULL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  CONSTRAINT chk_localities_slug CHECK (slug REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT chk_localities_label CHECK (CHAR_LENGTH(label) BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO categories (slug,label) VALUES
 ('cafes','Cafés'),('restaurants','Restaurants'),('electrician','Electricians'),('dentists','Dentists'),
 ('clinics','Clinics'),('car-repair','Car repair'),('plumbers','Plumbers'),('salons','Salons'),
 ('hardware','Hardware'),('home-cleaning','Home cleaning'),('fitness','Fitness'),('education','Education'),
 ('photographers','Photographers'),('web-design','Web design');
INSERT IGNORE INTO localities (slug,label) VALUES
 ('fort-kochi','Fort Kochi'),('kaloor','Kaloor'),('edappally','Edappally'),('vyttila','Vyttila'),
 ('palarivattom','Palarivattom'),('elamakkara','Elamakkara'),('panampilly-nagar','Panampilly Nagar'),
 ('kakkanad','Kakkanad'),('ernakulam','Ernakulam'),('thevara','Thevara');

CREATE TABLE IF NOT EXISTS listings (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(140) NOT NULL,
  category_slug VARCHAR(100) NOT NULL,
  locality_slug VARCHAR(100) NOT NULL,
  address VARCHAR(500) NOT NULL,
  phone VARCHAR(13) NOT NULL,
  whatsapp VARCHAR(13) NULL,
  website VARCHAR(500) NULL,
  description VARCHAR(2000) NOT NULL,
  services JSON NOT NULL,
  hours JSON NOT NULL,
  photos JSON NOT NULL,
  content_status ENUM('draft','pending_review','approved','rejected') NOT NULL DEFAULT 'draft',
  publication_status ENUM('unpublished','published','suspended','expired') NOT NULL DEFAULT 'unpublished',
  content_verified_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  content_verified_at DATETIME(3) NULL,
  consent_reference VARCHAR(500) NULL,
  rejection_reason VARCHAR(500) NULL,
  package_version VARCHAR(200) NULL,
  agreed_amount_minor INT UNSIGNED NULL,
  currency CHAR(3) NULL,
  terms_start DATE NULL,
  terms_end DATE NULL,
  terms_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  payment_status ENUM('not_reported','reported','bank_verified','rejected') NOT NULL DEFAULT 'not_reported',
  bank_verified_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  bank_verified_at DATETIME(3) NULL,
  bank_reference VARCHAR(500) NULL,
  bank_verified_amount_minor INT UNSIGNED NULL,
  package_inclusions VARCHAR(2000) NULL,
  cancellation_refund_terms VARCHAR(1500) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_listings_category FOREIGN KEY (category_slug) REFERENCES categories(slug),
  CONSTRAINT fk_listings_locality FOREIGN KEY (locality_slug) REFERENCES localities(slug),
  CONSTRAINT chk_listing_slug CHECK (slug REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT chk_listing_name CHECK (CHAR_LENGTH(name) BETWEEN 2 AND 140),
  CONSTRAINT chk_listing_phone CHECK (phone REGEXP '^\\+91[6-9][0-9]{9}$'),
  CONSTRAINT chk_listing_whatsapp CHECK (whatsapp IS NULL OR whatsapp REGEXP '^\\+91[6-9][0-9]{9}$'),
  CONSTRAINT chk_listing_website CHECK (website IS NULL OR (website LIKE 'https://%' AND website NOT REGEXP '[[:space:]]')),
  CONSTRAINT chk_listing_description CHECK (CHAR_LENGTH(description) BETWEEN 20 AND 2000),
  CONSTRAINT chk_listing_term CHECK (terms_end IS NULL OR terms_start IS NULL OR terms_end > terms_start),
  CONSTRAINT chk_listing_services CHECK (JSON_TYPE(services)='ARRAY' AND JSON_LENGTH(services)<=30),
  CONSTRAINT chk_listing_hours CHECK (JSON_TYPE(hours)='ARRAY' AND JSON_LENGTH(hours)<=14),
  CONSTRAINT chk_listing_photos CHECK (JSON_TYPE(photos)='ARRAY' AND JSON_LENGTH(photos)<=10),
  INDEX idx_listings_publication (publication_status, content_status, name),
  INDEX idx_listings_locality (locality_slug, publication_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
