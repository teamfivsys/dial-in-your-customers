import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { renderDirectoryHttp } from '../server/directory-http.mjs';
const shell=readFileSync('dist/app-shell.html','utf8');
const env={KDIAL_DIRECTORY_BACKEND_ENABLED:'true',KDIAL_SUPABASE_URL:'https://fixture.invalid',KDIAL_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture'};
const published={slug:'fixture-cafe',name:'Fixture <Cafe>',description:'Fictional & permitted <description>',address:'Test address',locality:'Kaloor',citySlug:'kochi',status:'approved'};
// Same published-only projection contract as the real SQL function; no private rows returned.
const fetcher=async(url,options)=>{assert.equal(new URL(url).pathname,'/rest/v1/rpc/kdial_public_listings');assert.equal(options.headers.apikey,'sb_publishable_fixture');return Response.json([published]);};
const server=createServer(async(req,res)=>{const out=await renderDirectoryHttp({path:new URL(req.url,'http://localhost').pathname,shell,env,fetcher});res.writeHead(out.status,out.headers);res.end(out.body);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
try {
 for(const path of ['/directory','/business-directory-kochi'])await test(`${path} direct HTTP 200 with directory metadata`,async()=>{const r=await fetch(base+path);const html=await r.text();assert.equal(r.status,200);assert.match(html,/<title>Kochi business directory \| KDial<\/title>/);assert.match(html,/rel="canonical" href="https:\/\/kdial.in\/directory"/);assert.doesNotMatch(html,/Kerala business<br/);assert.match(html,/Fixture &lt;Cafe&gt;/);});
 await test('short root profile 200, escaped body and exact canonical',async()=>{const r=await fetch(base+'/fixture-cafe');const h=await r.text();assert.equal(r.status,200);assert.match(h,/<title>Fixture &lt;Cafe&gt; \| KDial<\/title>/);assert.match(h,/href="https:\/\/kdial.in\/fixture-cafe"/);assert.doesNotMatch(h,/<Cafe>/);assert.equal((h.match(/rel="canonical"/g)||[]).length,1);assert.match(r.headers.get('cache-control'),/no-store/);});
 await test('legacy /businesses/ 301-redirects to short root (no duplicate)',async()=>{const r=await fetch(base+'/businesses/fixture-cafe',{redirect:'manual'});assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://kdial.in/fixture-cafe');});
 await test('full-root slug redirects to short when district suffix present',async()=>{const districtFetcher=async()=>Response.json([{...published,slug:'fixture-cafe-ernakulam'}]);const out=await renderDirectoryHttp({path:'/fixture-cafe-ernakulam',shell,env,fetcher:districtFetcher});assert.equal(out.status,301);assert.equal(out.headers['Location'],'https://kdial.in/fixture-cafe');const out2=await renderDirectoryHttp({path:'/fixture-cafe',shell,env,fetcher:districtFetcher});assert.equal(out2.status,200);assert.match(out2.body,/href="https:\/\/kdial.in\/fixture-cafe"/);});
 for(const slug of ['missing','private','expired'])await test(`${slug} slug gets real HTTP 404 and no public content`,async()=>{const r=await fetch(base+'/businesses/'+slug);const h=await r.text();assert.equal(r.status,404);assert.match(h,/noindex,follow/);assert.doesNotMatch(h,/Fixture &lt;Cafe&gt;/);});
 await test('bad route cannot become homepage 200',async()=>{assert.equal((await fetch(base+'/unknown')).status,404);});
 await test('upstream failure returns 503, not a false missing listing',async()=>{const out=await renderDirectoryHttp({path:'/businesses/fixture-cafe',shell,env,fetcher:async()=>new Response('',{status:500})});assert.equal(out.status,503);});
 await test('service credential rejected before fetch',async()=>{let calls=0;const e={...env,KDIAL_SUPABASE_PUBLISHABLE_KEY:`x.${Buffer.from(JSON.stringify({role:'service_role'})).toString('base64url')}.x`};const out=await renderDirectoryHttp({path:'/directory',shell,env:e,fetcher:()=>{calls++;}});assert.equal(out.status,503);assert.equal(calls,0);});
 await test('disabled backend keeps directory honest and profile unavailable',async()=>{assert.equal((await renderDirectoryHttp({path:'/directory',shell,env:{}})).status,200);assert.equal((await renderDirectoryHttp({path:'/businesses/fixture-cafe',shell,env:{}})).status,404);assert.equal((await renderDirectoryHttp({path:'/fixture-cafe',shell,env:{}})).status,404);});
} finally {server.closeAllConnections();await new Promise(r=>server.close(r));}
