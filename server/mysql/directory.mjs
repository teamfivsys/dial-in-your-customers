const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseJson(value, fallback) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string') return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

function toListing(row) {
  return {
    slug: row.slug,
    name: row.name,
    categorySlug: row.category_slug,
    citySlug: 'kochi',
    locality: row.locality_label,
    address: row.address,
    phone: row.phone,
    whatsapp: row.whatsapp || undefined,
    website: row.website || undefined,
    description: row.description,
    services: parseJson(row.services, []),
    hours: parseJson(row.hours, []),
    photos: parseJson(row.photos, []),
    verified: true,
    status: 'approved',
    verifiedAt: row.content_verified_at ? (row.content_verified_at instanceof Date ? row.content_verified_at.toISOString() : String(row.content_verified_at)) : undefined,
  };
}

const PUBLISHABLE_WHERE = `
  b.publication_status = 'published'
  AND b.content_status = 'approved'
  AND b.content_verified_by IS NOT NULL
  AND b.content_verified_at IS NOT NULL
  AND COALESCE(CHAR_LENGTH(b.consent_reference), 0) > 0
  AND b.terms_confirmed = 1
  AND COALESCE(CHAR_LENGTH(b.package_version), 0) > 0
  AND b.agreed_amount_minor > 0
  AND b.currency = 'INR'
  AND b.terms_start <= DATE(UTC_TIMESTAMP() + INTERVAL 330 MINUTE)
  AND b.terms_end > DATE(UTC_TIMESTAMP() + INTERVAL 330 MINUTE)
  AND b.payment_status = 'bank_verified'
  AND b.bank_verified_by IS NOT NULL
  AND b.bank_verified_at IS NOT NULL
  AND COALESCE(CHAR_LENGTH(b.bank_reference), 0) > 0
  AND b.bank_verified_amount_minor = b.agreed_amount_minor`;

export function createMysqlDirectoryStore(pool) {
  if (!pool || typeof pool.execute !== 'function') throw new TypeError('A MySQL pool is required');
  return {
    async listPublicListings() {
      const [rows] = await pool.execute(`
        SELECT b.slug,b.name,b.category_slug,l.label AS locality_label,b.address,b.phone,b.whatsapp,b.website,
               b.description,b.services,b.hours,b.photos,b.content_verified_at
        FROM listings b
        INNER JOIN localities l ON l.slug = b.locality_slug
        WHERE ${PUBLISHABLE_WHERE}
        ORDER BY b.name ASC
        LIMIT 5000`);
      if (!Array.isArray(rows)) throw new Error('Invalid MySQL listing result');
      const listings = rows.map(toListing);
      if (listings.some(item => !slugPattern.test(item.slug) || typeof item.name !== 'string')) throw new Error('Invalid MySQL public listing projection');
      return listings;
    },
    async getPublicTaxonomy() {
      const [categoryRows] = await pool.execute('SELECT slug,label FROM categories ORDER BY label ASC LIMIT 500');
      const [localityRows] = await pool.execute('SELECT slug,label FROM localities ORDER BY label ASC LIMIT 500');
      const valid = rows => Array.isArray(rows) && rows.every(row => slugPattern.test(row.slug) && typeof row.label === 'string');
      if (!valid(categoryRows) || !valid(localityRows)) throw new Error('Invalid MySQL taxonomy result');
      return { categories: categoryRows, localities: localityRows };
    },
  };
}

export function createMysqlDirectoryStoreFromEnv(env = process.env) {
  return import('./pool.mjs').then(({ getMysqlPool }) => createMysqlDirectoryStore(getMysqlPool(env)));
}

export function mysqlDirectoryRoutes(store) {
  return new Map([
    ['/api/v1/directory', () => store.listPublicListings()],
    ['/api/v1/taxonomy', () => store.getPublicTaxonomy()],
  ]);
}

export { PUBLISHABLE_WHERE };
