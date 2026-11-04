import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHostingerServer } from '../server/hostinger.mjs';

const shell = '<!doctype html><html><head><!--seo-head-start--><title>Original</title><!--seo-head-end--></head><body><div id="root"></div></body></html>';
const fixtureBusiness = { slug: 'fixture-cafe', name: 'Fixture Cafe', description: 'A fixture listing', address: 'Test address', locality: 'Kaloor', citySlug: 'kochi', status: 'approved' };
const env = {};
const directoryStore = {
  listPublicListings: async () => [{ ...fixtureBusiness, categorySlug: 'cafes', phone: '+919876543210', services: [], hours: [], photos: [], verified: true, updatedAt: '2026-10-22' }],
  getPublicTaxonomy: async () => ({ categories: [{slug:'cafes',label:'Cafés'}], localities: [{slug:'kaloor',label:'Kaloor'}] }),
};

await test('Hostinger managed Node server serves the Vite site and existing route handlers', async t => {
  const root = await mkdtemp(join(tmpdir(), 'kdial-hostinger-'));
  let server;
  try {
    await mkdir(join(root, 'assets'));
    await writeFile(join(root, 'index.html'), '<!doctype html><html><body><div id="root">App shell</div></body></html>');
    await writeFile(join(root, 'app-shell.html'), shell);
    await writeFile(join(root, 'assets', 'app-12345678.js'), 'console.log("fixture")');
    server = createHostingerServer({ distDir: root, env, directoryStore });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const get = (path, options) => fetch(`${base}${path}`, options);

    await t.test('serves the Vite home page and immutable hashed assets', async () => {
      const home = await get('/');
      assert.equal(home.status, 200);
      assert.match(home.headers.get('content-type'), /text\/html/);
      assert.equal(await home.text(), '<!doctype html><html><body><div id="root">App shell</div></body></html>');
      const asset = await get('/assets/app-12345678.js');
      assert.equal(asset.status, 200);
      assert.match(asset.headers.get('content-type'), /javascript/);
      assert.match(asset.headers.get('cache-control'), /immutable/);
    });

    await t.test('renders direct directory and profile routes using the public SEO renderer', async () => {
      const directory = await get('/directory');
      assert.equal(directory.status, 200);
      assert.match(await directory.text(), /Kochi business directory/);
      const alias = await get('/business-directory-kochi');
      assert.equal(alias.status, 200);
      assert.match(await alias.text(), /Kochi business directory/);
      const profile = await get('/businesses/fixture-cafe');
      assert.equal(profile.status, 200);
      assert.match(await profile.text(), /Fixture Cafe/);
      assert.match(profile.headers.get('cache-control'), /no-store/);
      assert.equal((await get('/businesses/missing')).status, 404);
    });

    await t.test('serves the sitemap and existing API compatibility endpoints', async () => {
      for (const path of ['/sitemap.xml', '/api/sitemap']) {
        const response = await get(path);
        assert.equal(response.status, 200);
        assert.match(response.headers.get('content-type'), /application\/xml/);
        assert.match(await response.text(), /https:\/\/kdial\.in\//);
      }
      const api = await get('/api/directory-route?kdial_path=%2Fdirectory');
      assert.equal(api.status, 200);
      assert.match(await api.text(), /Kochi business directory/);
      const records = await get('/api/v1/directory');
      assert.equal(records.status, 200);
      assert.deepEqual(await records.json(), await directoryStore.listPublicListings());
      const taxonomy = await get('/api/v1/taxonomy');
      assert.equal(taxonomy.status, 200);
      assert.deepEqual(await taxonomy.json(), await directoryStore.getPublicTaxonomy());
    });

    await t.test('serves client-side app routes and rejects unknown paths and APIs', async () => {
      for (const path of ['/admin', '/submit-business', '/demo/directory', '/demo/businesses/fixture-cafe', '/blog', '/blog/fixture-post', '/pay/opaque-token', '/categories', '/categories/restaurants', '/kochi/restaurants', '/kochi']) {
        const response = await get(path);
        assert.equal(response.status, 200, path);
        assert.match(await response.text(), /App shell/);
      }
      assert.equal((await get('/api/not-a-route')).status, 404);
      assert.equal((await get('/not/a/route')).status, 404);
    });

    await t.test('supports HEAD and rejects methods outside the read-only route surface', async () => {
      const head = await get('/directory', { method: 'HEAD' });
      assert.equal(head.status, 200);
      assert.equal(head.headers.get('content-type'), 'text/html; charset=utf-8');
      assert.equal(await head.text(), '');
      const post = await get('/directory', { method: 'POST' });
      assert.equal(post.status, 405);
      assert.equal(post.headers.get('allow'), 'GET, HEAD');
    });

    await t.test('blocks encoded traversal outside the built static root', async () => {
      const response = await get('/%2e%2e%2foutside');
      assert.equal(response.status, 404);
      assert.doesNotMatch(await response.text(), /secret/);
    });
  } finally {
    if (server?.listening) {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    }
    await rm(root, { recursive: true, force: true });
  }
});
