import { directoryResponse } from '../lib/directory-response.js';
export const onRequest = context => directoryResponse(context, `/businesses/${context.params.slug}`);
