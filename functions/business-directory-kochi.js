import { directoryResponse } from './lib/directory-response.js';
export const onRequest = context => directoryResponse(context, '/business-directory-kochi');
