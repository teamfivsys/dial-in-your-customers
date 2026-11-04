import { sitemapResponse } from '../lib/directory-response.js';
export const onRequest = context => sitemapResponse(context);
