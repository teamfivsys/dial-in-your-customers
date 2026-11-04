import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createMysqlDirectoryStore, PUBLISHABLE_WHERE } from '../server/mysql/directory.mjs';

test('MySQL public read projection is parameter-free, bounded and enforces every publication gate', async () => {
  const calls = [];
  const pool = { execute: async (sql, params) => {
    calls.push({sql, params});
    if (sql.includes('INNER JOIN localities')) return [[{
      slug:'fixture-cafe',name:'Fixture Cafe',category_slug:'cafes',locality_label:'Kaloor',address:'Test address',
      phone:'+919876543210',whatsapp:null,website:null,description:'A useful local cafe description',services:'["Coffee"]',
      hours:'[]',photos:'[]',content_verified_at:new Date('2026-10-22T12:00:00Z'),
    }], []];
    if (sql.includes('FROM categories')) return [[{slug:'cafes',label:'Cafés'}], []];
    if (sql.includes('FROM localities')) return [[{slug:'kaloor',label:'Kaloor'}], []];
    throw new Error('Unexpected query');
  }};
  const store = createMysqlDirectoryStore(pool);
  const listings = await store.listPublicListings();
  assert.equal(listings.length, 1);
  assert.equal(listings[0].status, 'approved');
  assert.equal(listings[0].verified, true);
  assert.equal(listings[0].locality, 'Kaloor');
  assert.equal(listings[0].services[0], 'Coffee');
  assert.equal(listings[0].verifiedAt, '2026-10-22T12:00:00.000Z');
  assert.equal('updatedAt' in listings[0], false);
  assert.equal(calls[0].params, undefined);
  assert.match(calls[0].sql, /LIMIT 5000/);
  const publicSelect = calls[0].sql.split('FROM listings')[0];
  assert.match(publicSelect, /b\.description,b\.services,b\.hours,b\.photos,b\.content_verified_at/);
  assert.doesNotMatch(publicSelect, /b\.updated_at/);
  assert.doesNotMatch(publicSelect, /bank_reference|consent_reference|agreed_amount_minor|bank_verified_amount_minor/);
  for (const gate of ['publication_status = \'published\'', 'content_status = \'approved\'', 'content_verified_by IS NOT NULL', 'consent_reference', 'terms_confirmed = 1', 'terms_start <= DATE(UTC_TIMESTAMP() + INTERVAL 330 MINUTE)', 'terms_end > DATE(UTC_TIMESTAMP() + INTERVAL 330 MINUTE)', 'payment_status = \'bank_verified\'', 'bank_verified_by IS NOT NULL', 'bank_verified_amount_minor = b.agreed_amount_minor']) assert.ok(PUBLISHABLE_WHERE.includes(gate), `Missing gate ${gate}`);
  assert.deepEqual(await store.getPublicTaxonomy(), {categories:[{slug:'cafes',label:'Cafés'}],localities:[{slug:'kaloor',label:'Kaloor'}]});
});

test('invalid MySQL rows fail closed rather than becoming public listings', async () => {
  const store = createMysqlDirectoryStore({execute:async()=>[[{slug:'Not valid',name:'Example',category_slug:'x',locality_label:'x',address:'x',phone:'x',description:'x',services:'not-json',hours:'[]',photos:'[]',content_verified_at:new Date('2026-10-22T12:00:00Z')}],[]]});
  await assert.rejects(store.listPublicListings(), /Invalid MySQL public listing projection/);
});

test('MySQL schema carries publication gates while the public projection excludes sensitive fields', async () => {
  const sql = await readFile(new URL('../mysql/migrations/001_public_directory.sql', import.meta.url), 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS listings/);
  assert.match(sql, /bank_verified_amount_minor/);
  assert.match(sql, /INSERT IGNORE INTO categories/);
  assert.doesNotMatch(sql, /INSERT\s+INTO listings/i);
  assert.match(sql, /Admin identity\/session and moderated intake\/manual payment workflows are added by migrations 002–004/i);
  assert.doesNotMatch(sql, /full review, submission, payment and offer workflows are not implemented/i);
});
