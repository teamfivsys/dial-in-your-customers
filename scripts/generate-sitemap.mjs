import {rmSync} from 'node:fs';
// The hosted sitemap is generated at request time from the published-only RPC.
// A stale static file would shadow Vercel rewrites and retain suspended/expired slugs.
rmSync('public/sitemap.xml',{force:true});
console.log('Sitemap uses dynamic /api/sitemap; no stale static artifact');
