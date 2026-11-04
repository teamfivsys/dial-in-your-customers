import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderDirectoryHttp } from '../server/directory-http.mjs';
export default async function handler(request,response) {
 const path = request.query?.kdial_path;
 const shell = readFileSync(join(process.cwd(),'dist/app-shell.html'),'utf8');
 const result = await renderDirectoryHttp({path:typeof path==='string'?path:'/404',shell});
 response.statusCode=result.status;
 for (const [key,value] of Object.entries(result.headers)) response.setHeader(key,value);
 response.end(result.body);
}
