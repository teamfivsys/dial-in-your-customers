import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { onRequest as directory } from '../functions/directory.js';
import { onRequest as businessDirectory } from '../functions/business-directory-kochi.js';
import { onRequest as business } from '../functions/businesses/[slug].js';
import { onRequest as sitemap } from '../functions/sitemap.xml.js';
import { onRequest as apiDirectory } from '../functions/api/directory-route.js';
import { onRequest as apiSitemap } from '../functions/api/sitemap.js';

const shell = '<!doctype html><html><head><!--seo-head-start--><title>Original</title><!--seo-head-end--></head><body><div id="root"></div></body></html>';
const env = { KDIAL_DIRECTORY_BACKEND_ENABLED: 'false' };
const assets = { fetch: async input => {
  assert.equal(new URL(input).pathname, '/app-shell.html');
  return new Response(shell, { status: 200, headers: { 'Content-Type': 'text/html' } });
} };
function context(path, params = {}, query = '') {
  return { request: new Request(`https://kdial.example${path}${query}`), params, env: { ...env, ASSETS: assets } };
}

for (const [name, handler, ctx, expectedPath, expectedStatus] of [
  ['directory', directory, context('/directory'), '/directory', 200],
  ['Kochi alias', businessDirectory, context('/business-directory-kochi'), '/directory', 200],
  ['API directory compatibility', apiDirectory, context('/api/directory-route', {}, '?kdial_path=%2Fdirectory'), '/directory', 200],
  ['unknown API path fails closed', apiDirectory, context('/api/directory-route', {}, '?kdial_path=%2Felsewhere'), '/404', 404],
  ['missing business remains not found', business, context('/businesses/missing', { slug: 'missing' }), '/404', 404],
]) {
  test(`Pages ${name} route renders existing SEO shell`, async () => {
    const response = await handler(ctx);
    const html = await response.text();
    assert.equal(response.status, expectedStatus);
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.match(html, new RegExp(`rel="canonical" href="https://kdial\\.in${expectedPath.replaceAll('/', '\\/')}"`));
    assert.match(html, /<div id="root"><main>/);
    if (expectedStatus === 404) assert.match(html, /noindex,follow/);
  });
}

test('Pages sitemap route uses public no-store XML renderer', async () => {
  for (const handler of [sitemap, apiSitemap]) {
    const response = await handler(context('/sitemap.xml'));
    const xml = await response.text();
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/xml/);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.match(xml, /https:\/\/kdial\.in\//);
    assert.doesNotMatch(xml, /\/admin|\/submit-business|\/demo/);
  }
});

test('Pages shell failure returns a generic retryable response without leaking details', async () => {
  const response = await directory({
    ...context('/directory'), env: { ...env, ASSETS: { fetch: async () => new Response('private asset diagnostic', { status: 404 }) } },
  });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('retry-after'), '60');
  assert.equal(await response.text(), 'Directory temporarily unavailable.');
});

test('Pages invocation allowlist and SPA rewrites cover required paths only', () => {
  const routes = JSON.parse(readFileSync('public/_routes.json', 'utf8'));
  assert.deepEqual(routes.include, ['/sitemap.xml', '/directory', '/business-directory-kochi', '/businesses/*', '/api/sitemap', '/api/directory-route']);
  assert.deepEqual(routes.exclude, []);
  const redirects = readFileSync('public/_redirects', 'utf8');
  for (const route of ['/demo/directory', '/demo/businesses/*', '/admin', '/submit-business', '/404']) {
    assert.match(redirects, new RegExp(`^${route.replaceAll('*', '\\*').replaceAll('/', '\\/')} /index\\.html 200$`, 'm'));
  }
  assert.doesNotMatch(redirects, /^\/(?:directory|business-directory-kochi|businesses\/)/m);
});
