import { renderDirectoryHttp, renderSitemapHttp } from '../../server/directory-http.mjs';

const unavailable = () => new Response('Directory temporarily unavailable.', {
  status: 503,
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'Retry-After': '60',
  },
});

async function appShell(context) {
  const shellUrl = new URL('/app-shell.html', context.request.url);
  const response = await context.env.ASSETS.fetch(shellUrl);
  if (!response.ok) throw new Error('Rendered app shell unavailable');
  return response.text();
}

export async function directoryResponse(context, path) {
  try {
    const shell = await appShell(context);
    const result = await renderDirectoryHttp({ path, shell, env: context.env });
    return new Response(result.body, { status: result.status, headers: result.headers });
  } catch {
    return unavailable();
  }
}

export async function sitemapResponse(context) {
  const result = await renderSitemapHttp({ env: context.env });
  return new Response(result.body, { status: result.status, headers: result.headers });
}
