# Cloudflare Pages deployment path (local preparation only)

This repository keeps its Vercel configuration and adds a Cloudflare Pages Functions path for the existing Vite build. The Pages Functions render `/sitemap.xml`, `/directory`, `/business-directory-kochi`, `/businesses/:slug`, and the existing `/api/sitemap` and `/api/directory-route` endpoints from the same public-only Supabase listing projection. The Vite SPA routes `/demo/directory`, `/demo/businesses/:slug`, `/admin`, `/submit-business`, and `/404` are rewritten to `index.html` by `public/_redirects`.

## Pages project settings

- Build command: `pnpm build`
- Build output directory: `dist`
- Functions directory: repository-root `functions/` (Cloudflare Pages detects it automatically)
- Install command: `pnpm install --frozen-lockfile`
- Node version: use the version required by `package.json` (`>=22.12.0`)

`public/_routes.json` limits function invocations to the server-rendered routes; other static assets and SPA routes stay on the static asset path. `app-shell.html` is loaded from the Pages asset binding at request time. The API uses only the existing publishable/anon Supabase key and public RPC; it does not use a service-role key or read private tables.

If the public listing backend is enabled in the Pages environment, configure these runtime variables using the existing safe deployment process: `KDIAL_DIRECTORY_BACKEND_ENABLED`, `KDIAL_SUPABASE_URL`, and `KDIAL_SUPABASE_PUBLISHABLE_KEY`. Keep backend access disabled until the reviewed database and public RPC are ready. Never place a service-role key in Pages variables for this rendering path.

## Local verification

Run `pnpm build`, `pnpm test:pages`, and the existing `pnpm test:http` and `pnpm test:sitemap`. These commands only build and test local files; this preparation did not connect a Cloudflare account, deploy, or modify Supabase or production.
