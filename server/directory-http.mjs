// Read-only HTTP rendering. This module never uses a service-role key or private tables.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function decodeBase64UrlJson(payload) {
 const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
 const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
 return JSON.parse(atob(padded));
}
function validPublicKey(key) {
 if (key?.startsWith('sb_publishable_')) return true;
 try { return decodeBase64UrlJson(key.split('.')[1]).role === 'anon'; } catch { return false; }
}
export async function publishedRecords(env = process.env, fetcher = fetch, directoryStore = null) {
 if (directoryStore) {
  const records = await directoryStore.listPublicListings();
  if (!Array.isArray(records) || records.some(b => !b || typeof b.slug !== 'string' || !slugPattern.test(b.slug) || b.status !== 'approved' || b.citySlug !== 'kochi' || typeof b.name !== 'string' || typeof b.description !== 'string')) throw new Error('Invalid public listing projection');
  return records;
 }
 if ((env.KDIAL_DIRECTORY_BACKEND_ENABLED ?? env.VITE_DIRECTORY_BACKEND_ENABLED) !== 'true') return [];
 const host = env.KDIAL_SUPABASE_URL ?? env.VITE_SUPABASE_URL;
 const key = env.KDIAL_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY;
 if (!host || !validPublicKey(key)) throw new Error('Public directory backend not configured');
 const url = new URL(host);
 // Loopback HTTP is only for this project's isolated integration tests.
 if (url.protocol !== 'https:' && !(env.KDIAL_LOCAL_TEST === 'true' && ['127.0.0.1','localhost'].includes(url.hostname))) throw new Error('HTTPS backend required');
 const headers = {'Content-Type':'application/json', apikey:key};
 if (key.split('.').length === 3) headers.Authorization = `Bearer ${key}`;
 const response = await fetcher(new URL('/rest/v1/rpc/kdial_public_listings', url), {method:'POST',headers,body:'{}',signal:AbortSignal.timeout(5000),cache:'no-store'});
 if (!response.ok) throw new Error('Published listing query failed');
 const records = await response.json();
 if (!Array.isArray(records) || records.some(b => !b || typeof b.slug !== 'string' || !slugPattern.test(b.slug) || b.status !== 'approved' || b.citySlug !== 'kochi' || typeof b.name !== 'string' || typeof b.description !== 'string')) throw new Error('Invalid public listing projection');
 return records;
}
function document(shell,{title,description,path,noindex=true,content}) {
 const canonical = `https://kdial.in${path}`;
 const head = `<title>${escape(title)}</title>\n<meta name="description" content="${escape(description)}"/>\n<link rel="canonical" href="${escape(canonical)}"/>\n<meta name="robots" content="${noindex?'noindex,follow':'index,follow,max-image-preview:large'}"/>\n<meta property="og:type" content="website"/>\n<meta property="og:title" content="${escape(title)}"/>\n<meta property="og:description" content="${escape(description)}"/>\n<meta property="og:url" content="${escape(canonical)}"/>\n<meta property="og:image" content="https://kdial.in/og-image.png"/>`;
 if (!shell.includes('<!--seo-head-start-->') || !shell.includes('<div id="root"></div>')) throw new Error('Original Vite shell required');
 return shell.replace(/<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/,()=>head).replace('<div id="root"></div>',()=>`<div id="root"><main>${content}</main></div>`);
}
export async function renderDirectoryHttp({path,shell,env=process.env,fetcher=fetch,directoryStore=null}) {
 const headers = {'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
 const notFound = () => ({status:404,headers,body:document(shell,{title:'Business not found | KDial',description:'This business listing is not available.',path:'/404',content:'<h1>Business not found</h1><p>This listing is not available.</p><a href="/directory">Browse the directory</a>'})});
 const isDirectory = path === '/directory' || path === '/business-directory-kochi';
 const match = /^\/businesses\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(path);
 if (!isDirectory && !match) return notFound();
 let records;
 try { records = await publishedRecords(env,fetcher,directoryStore); }
 catch { return {status:503,headers:{...headers,'Retry-After':'60'},body:document(shell,{title:'Directory temporarily unavailable | KDial',description:'Please try the KDial directory again shortly.',path:isDirectory?'/directory':path,content:'<h1>Directory temporarily unavailable</h1><p>Please try again shortly.</p>'})}; }
 if (isDirectory) return {status:200,headers,body:document(shell,{title:'Kochi business directory | KDial',description:'Find published Kochi businesses by service, category and locality.',path:'/directory',noindex:!records.length,content:`<h1>Kochi business directory</h1>${records.length?`<ul>${records.map(b=>`<li><a href="/businesses/${escape(b.slug)}">${escape(b.name)}</a><p>${escape(b.locality)} · ${escape(b.description)}</p></li>`).join('')}</ul>`:'<p>No published listings yet. The directory is in preparation.</p>'}`})};
 const business=records.find(b=>b.slug===match[1]);
 if (!business) return notFound();
 return {status:200,headers,body:document(shell,{title:`${business.name} | KDial`,description:business.description,path:`/businesses/${business.slug}`,noindex:false,content:`<h1>${escape(business.name)}</h1><p>${escape(business.description)}</p><p>${escape(business.address)}</p><p>${escape(business.locality)}, Kochi</p><a href="/directory">Back to directory</a>`})};
}

// Same public projection as the HTTP renderer. Never read admin/private tables or use privileged keys.
export async function renderSitemapHttp({env=process.env,fetcher=fetch,directoryStore=null}={}) {
 const headers={'Content-Type':'application/xml; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
 try {
  const records=await publishedRecords(env,fetcher,directoryStore);
  const slugs=[...new Set(records.map(b=>b.slug))].sort();
  const paths=['/',...(slugs.length?['/directory']:[]),...slugs.map(s=>`/businesses/${s}`)];
  if(paths.length>50000)throw new Error('Sitemap index required');
  const body=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p=>`  <url><loc>https://kdial.in${escape(p)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return {status:200,headers,body};
 }catch{return {status:503,headers:{...headers,'Content-Type':'text/plain; charset=utf-8','Retry-After':'60'},body:'Sitemap temporarily unavailable.'};}
}
