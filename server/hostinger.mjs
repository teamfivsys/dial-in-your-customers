import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDirectoryHttp, renderSitemapHttp } from './directory-http.mjs';
import { createMysqlDirectoryStoreFromEnv } from './mysql/directory.mjs';
import { createMysqlAdminApi } from './mysql/admin-api.mjs';
import { createMysqlPublicActionApi } from './mysql/public-actions.mjs';
import { getMysqlPool, closeMysqlPool } from './mysql/pool.mjs';

const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'], ['.gif', 'image/gif'], ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'], ['.jpeg', 'image/jpeg'], ['.jpg', 'image/jpeg'], ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'], ['.map', 'application/json; charset=utf-8'], ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'], ['.txt', 'text/plain; charset=utf-8'], ['.webmanifest', 'application/manifest+json'],
  ['.webp', 'image/webp'], ['.woff', 'font/woff'], ['.woff2', 'font/woff2'], ['.xml', 'application/xml; charset=utf-8'],
]);
const HTML_SHELL_ROUTES = new Set(['/demo/directory', '/admin', '/submit-business', '/404', '/blog', '/categories']);
const CLIENT_ROUTE_PATTERNS = [
  /^\/demo\/businesses\/[^/]+$/, /^\/blog\/[^/]+$/, /^\/pay\/[^/]+$/,
  /^\/business-directory-[^/]+$/, /^\/categories\/[^/]+$/,
  /^\/[A-Za-z0-9_-]+$/, /^\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/,
];
const isClientRoute = path => HTML_SHELL_ROUTES.has(path) || CLIENT_ROUTE_PATTERNS.some(pattern => pattern.test(path));
const isInside = (root, target) => {
  const fromRoot = relative(root, target);
  return fromRoot === '' || (!fromRoot.startsWith(`..${sep}`) && fromRoot !== '..' && !fromRoot.startsWith(sep));
};

function send(response, status, headers, body, method) {
  response.writeHead(status, headers);
  response.end(method === 'HEAD' ? undefined : body);
}

export function createHostingerServer({
  distDir = resolve(process.cwd(), 'dist'),
  env = process.env,
  fetcher = fetch,
  directoryStore: suppliedDirectoryStore = null,
} = {}) {
  const rootPromise = realpath(distDir);
  const shellPromise = readFile(resolve(distDir, 'app-shell.html'), 'utf8');
  let directoryStorePromise = suppliedDirectoryStore ? Promise.resolve(suppliedDirectoryStore) : null;
  const getDirectoryStore = () => directoryStorePromise ??= createMysqlDirectoryStoreFromEnv(env);
  return createServer(async (request, response) => {
    const method = request.method || 'GET';
    let url;
    let pathname;
    try {
      url = new URL(request.url || '/', 'http://localhost');
      pathname = decodeURIComponent(url.pathname);
      if (pathname.includes('\0')) throw new URIError('Invalid path');
    } catch {
      send(response, 400, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' }, 'Invalid request path.', method);
      return;
    }

    if (pathname.startsWith('/api/v1/admin/')) {
      try {
        const adminApi = createMysqlAdminApi({ pool: getMysqlPool(env), env });
        await adminApi.route(request, response);
      } catch {
        send(response, 503, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }, JSON.stringify({ error: 'Admin service is temporarily unavailable.' }), method);
      }
      return;
    }
    if (['/api/v1/submissions','/api/v1/payment-offers','/api/v1/payment-reports','/api/v1/analytics'].includes(pathname)) {
      try { const api=createMysqlPublicActionApi({pool:getMysqlPool(env),env,fetcher}); await api.route(request,response); }
      catch { send(response,503,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},JSON.stringify({error:'Public action service is temporarily unavailable.'}),method); }
      return;
    }
    if (method !== 'GET' && method !== 'HEAD') {
      send(response, 405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' }, 'Method not allowed.', method);
      return;
    }

    try {
      if (pathname === '/api/v1/directory' || pathname === '/api/v1/taxonomy') {
        const store = await getDirectoryStore();
        const data = pathname.endsWith('/directory') ? await store.listPublicListings() : await store.getPublicTaxonomy();
        send(response, 200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' }, JSON.stringify(data), method);
        return;
      }
      if (pathname === '/sitemap.xml' || pathname === '/api/sitemap') {
        const result = await renderSitemapHttp({ env, fetcher, directoryStore: await getDirectoryStore() });
        send(response, result.status, result.headers, result.body, method);
        return;
      }
      if (pathname === '/directory' || pathname === '/business-directory-kochi' || pathname === '/api/directory-route' || /^\/businesses\//.test(pathname)) {
        let renderPath = pathname;
        if (pathname === '/api/directory-route') {
          const requestedPath = url.searchParams.get('kdial_path');
          renderPath = typeof requestedPath === 'string' ? requestedPath : '/404';
        }
        const shell = await shellPromise;
        const result = await renderDirectoryHttp({ path: renderPath, shell, env, fetcher, directoryStore: await getDirectoryStore() });
        send(response, result.status, result.headers, result.body, method);
        return;
      }

      const root = await rootPromise;
      const decodedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
      const candidate = resolve(root, decodedPath || 'index.html');
      if (!isInside(root, candidate)) {
        send(response, 404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' }, 'Not found.', method);
        return;
      }

      let target = candidate;
      try {
        const realTarget = await realpath(candidate);
        if (!isInside(root, realTarget)) throw new Error('Path outside static root');
        const info = await stat(realTarget);
        if (info.isDirectory()) target = resolve(realTarget, 'index.html');
        else target = realTarget;
        const finalTarget = await realpath(target);
        if (!isInside(root, finalTarget) || !(await stat(finalTarget)).isFile()) throw new Error('Invalid static target');
        const body = await readFile(finalTarget);
        const type = MIME_TYPES.get(extname(finalTarget).toLowerCase()) || 'application/octet-stream';
        const isHtml = type.startsWith('text/html');
        const hashedAsset = /-[A-Za-z0-9_-]{8,}\.[^/]+$/.test(finalTarget);
        send(response, 200, {
          'Content-Type': type,
          'Cache-Control': isHtml ? 'no-cache' : hashedAsset ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
          'X-Content-Type-Options': 'nosniff',
        }, body, method);
        return;
      } catch (error) {
        if (error?.code !== 'ENOENT' && error?.code !== 'ENOTDIR') throw error;
      }

      if (pathname.startsWith('/api/')) {
        send(response, 404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' }, 'Not found.', method);
        return;
      }
      if (isClientRoute(pathname) || pathname === '/') {
        const body = await readFile(resolve(root, 'index.html'));
        send(response, 200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' }, body, method);
        return;
      }
      send(response, 404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' }, 'Not found.', method);
    } catch {
      if (pathname === '/api/v1/directory' || pathname === '/api/v1/taxonomy') {
        send(response, 503, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '60', 'X-Content-Type-Options': 'nosniff' }, JSON.stringify({error:'Directory data is temporarily unavailable.'}), method);
        return;
      }
      send(response, 500, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }, 'The site could not complete this request.', method);
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const port = Number.parseInt(process.env.PORT || '3000', 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port');
  const host = process.env.HOST || '0.0.0.0';
  const server = createHostingerServer();
  server.listen(port, host, () => console.log(`KDial server listening on ${host}:${port}`));
  for (const signal of ['SIGTERM', 'SIGINT']) {
    process.once(signal, () => server.close(async error => {
      if (error) process.exitCode = 1;
      try { await closeMysqlPool(); } catch { process.exitCode = 1; }
    }));
  }
}
