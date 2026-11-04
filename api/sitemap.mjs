import {renderSitemapHttp} from '../server/directory-http.mjs';
export default async function handler(_request,response){
 const result=await renderSitemapHttp();response.statusCode=result.status;
 for(const [name,value] of Object.entries(result.headers))response.setHeader(name,value);
 response.end(result.body);
}
