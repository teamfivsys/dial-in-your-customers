import { directoryResponse } from '../lib/directory-response.js';
export const onRequest = context => {
  const path = new URL(context.request.url).searchParams.get('kdial_path') || '/404';
  return directoryResponse(context, path);
};
