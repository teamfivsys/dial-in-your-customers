// Connected HTTP test only: run after tests/local-stack/integration.py in the isolated Docker stack.
import {readFileSync} from 'node:fs';import {createServer} from 'node:http';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import handler from '../../api/directory-route.mjs';import sitemapHandler from '../../api/sitemap.mjs';
const keys=JSON.parse(readFileSync('.local-stack/keys.json'));const state=JSON.parse(readFileSync('.local-stack/lifecycle.json'));
Object.assign(process.env,{KDIAL_DIRECTORY_BACKEND_ENABLED:'true',KDIAL_SUPABASE_URL:'http://127.0.0.1:54324',KDIAL_SUPABASE_PUBLISHABLE_KEY:keys.anon,KDIAL_LOCAL_TEST:'true'});
const server=createServer((req,res)=>{req.query={kdial_path:new URL(req.url,'http://localhost').pathname};(req.url==='/sitemap.xml'?sitemapHandler:handler)(req,res).catch(()=>{res.statusCode=500;res.end('HTTP handler failed');});});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;let passed=0;
async function check(path,status,text){const r=await fetch(base+path);assert.equal(r.status,status,path);const body=await r.text();assert.ok(body.includes(text),path+' body');passed++;console.log('PASS connected HTTP',path,status);return body;}
async function rpc(name,args,role='owner'){const r=await fetch('http://127.0.0.1:54324/rest/v1/rpc/'+name,{method:'POST',headers:{Authorization:'Bearer '+state.tokens[role],apikey:keys.anon,'Content-Type':'application/json'},body:JSON.stringify(args)});assert.ok(r.ok,await r.text());}
try{
 const directory=await check('/directory',200,'Isolated Integration Cafe');assert.ok(directory.includes('<title>Kochi business directory | KDial</title>'));
 await check('/business-directory-kochi',200,'Isolated Integration Cafe');
 const profile=await check('/businesses/integration-cafe',200,'Isolated Integration Cafe');assert.ok(profile.includes('href="https://kdial.in/businesses/integration-cafe"'));
 const liveSitemap=await check('/sitemap.xml',200,'https://kdial.in/businesses/integration-cafe');assert.ok(!/admin|demo|example.invalid/.test(liveSitemap));
 await check('/businesses/genuine-missing',404,'Business not found');
 await rpc('kdial_admin_publication',{listing_id:state.listing,action:'suspended',reason:'connected HTTP private test'},'publisher');
 await check('/businesses/integration-cafe',404,'Business not found');
 assert.ok(!(await check('/sitemap.xml',200,'https://kdial.in/</loc>')).includes('/businesses/integration-cafe'));
 await rpc('kdial_admin_publication',{listing_id:state.listing,action:'published'},'publisher');
 execFileSync('sudo',['docker','exec','kdial-db','psql','-U','postgres','-v','ON_ERROR_STOP=1','-c',`update kdial_private.listings set publication_status='expired',terms_start=current_date-20,terms_end=current_date-10 where id='${state.listing}'`],{stdio:'ignore'});
 await check('/businesses/integration-cafe',404,'Business not found');
 assert.ok(!(await check('/sitemap.xml',200,'https://kdial.in/</loc>')).includes('/businesses/integration-cafe'));
 await check('/directory',200,'No published listings yet');
 console.log('TOTAL',passed,'actual HTTP adapter + real PostgREST projection checks (no API mocks). Vercel hosted rewrites remain untested.');
}finally{server.close();}
