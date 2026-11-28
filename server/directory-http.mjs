// Read-only HTTP rendering. This module never uses a service-role key or private tables.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Short root slugs: mirror src/lib/slugs.ts exactly.
// Short = full slug with trailing district token removed, only when unique
// across all published slugs and not reserved; otherwise keep full slug.
const DISTRICT_SUFFIXES = new Set(["ernakulam","kozhikode","thrissur","kochi","alappuzha","thiruvananthapuram","cochin","kerala","kannur","kollam","malappuram","palakkad","kottayam","pathanamthitta","idukki","wayanad","kasaragod"]);
const RESERVED_SLUGS = new Set(["directory","submit-business","businesses","blog","admin","categories","business-directory-kochi","demo","pay","404","api","favicon.ico","robots.txt","sitemap","sitemap.xml","about","login","privacy","terms"]);
const CITY_SLUGS = new Set(["kochi","calicut","trivandrum","thrissur","malappuram","palakkad","kannur","kollam","alappuzha","kottayam","idukki","wayanad","pathanamthitta","kasaragod"]);
function shortCandidate(fullSlug) {
  const parts = String(fullSlug).split("-");
  if (parts.length >= 2 && DISTRICT_SUFFIXES.has(parts[parts.length - 1])) {
    const candidate = parts.slice(0, -1).join("-");
    return candidate || fullSlug;
  }
  return fullSlug;
}
function isReservedShort(short) {
  if (RESERVED_SLUGS.has(short) || CITY_SLUGS.has(short)) return true;
  if (String(short).startsWith("business-directory-")) return true;
  return false;
}
function buildShortMap(fullSlugs) {
  const normalized = [...new Set(fullSlugs)].filter(Boolean);
  const fullSet = new Set(normalized);
  const candidates = new Map();
  for (const full of normalized) candidates.set(full, shortCandidate(full));
  const counts = new Map();
  for (const candidate of candidates.values()) counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
  const map = new Map();
  for (const [full, candidate] of candidates) {
    if (candidate === full) { map.set(full, full); continue; }
    const collides = (counts.get(candidate) ?? 0) > 1 || (fullSet.has(candidate) && candidate !== full) || isReservedShort(candidate);
    map.set(full, collides ? full : candidate);
  }
  return map;
}
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
 const redirect = (to) => ({status:301,headers:{...headers,'Cache-Control':'public, max-age=86400','Location':`https://kdial.in${to}`},body:''});
 const isDirectory = path === '/directory' || path === '/business-directory-kochi';
 const legacyMatch = /^\/businesses\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(path);
 const rootMatch = /^\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(path);
 if (!isDirectory && !legacyMatch && !rootMatch) return notFound();
 let records;
 try { records = await publishedRecords(env,fetcher,directoryStore); }
 catch { return {status:503,headers:{...headers,'Retry-After':'60'},body:document(shell,{title:'Directory temporarily unavailable | KDial',description:'Please try the KDial directory again shortly.',path:isDirectory?'/directory':path,content:'<h1>Directory temporarily unavailable</h1><p>Please try again shortly.</p>'})}; }
 const shortMap = buildShortMap(records.map(b => b.slug));
 if (isDirectory) return {status:200,headers,body:document(shell,{title:'Kochi business directory | KDial',description:`Search ${records.length} published businesses in Kochi, Ernakulam, Kerala on KDial - by service, category and locality. Call and WhatsApp local shops, services and professionals near you.`,path:'/directory',noindex:!records.length,content:`<h1>Kochi business directory</h1>${records.length?`<ul>${records.map(b=>`<li><a href="/${escape(shortMap.get(b.slug) ?? b.slug)}">${escape(b.name)}</a><p>${escape(b.locality)} · ${escape(b.description)}</p></li>`).join('')}</ul>`:'<p>No published listings yet. The directory is in preparation.</p>'}`})};
 // Legacy /businesses/:slug -> permanent redirect to short root URL. Never serve duplicate content here.
 if (legacyMatch) {
  const business = records.find(b => b.slug === legacyMatch[1]);
  if (!business) return notFound();
  const short = shortMap.get(business.slug) ?? business.slug;
  return redirect(`/${short}`);
 }
 // Root /:slug (short or full). Full -> redirect to short; short -> render with canonical short.
 const incoming = rootMatch[1];
 const business = records.find(b => (shortMap.get(b.slug) ?? b.slug) === incoming || b.slug === incoming);
 if (!business) return notFound();
 const short = shortMap.get(business.slug) ?? business.slug;
 if (incoming !== short) return redirect(`/${short}`);
 return {status:200,headers,body:document(shell,{title:`${business.name} | KDial`,description:business.description,path:`/${short}`,noindex:false,content:`<h1>${escape(business.name)}</h1><p>${escape(business.description)}</p><p>${escape(business.address)}</p><p>${escape(business.locality)}, Kochi</p><a href="/directory">Back to directory</a>`})};
}

// Same public projection as the HTTP renderer. Never read admin/private tables or use privileged keys.
export async function renderSitemapHttp({env=process.env,fetcher=fetch,directoryStore=null}={}) {
 const headers={'Content-Type':'application/xml; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
 try {
  const records=await publishedRecords(env,fetcher,directoryStore);
  const slugs=[...new Set(records.map(b=>b.slug))].sort();
  const shortMap=buildShortMap(slugs);
  const shorts=[...new Set(slugs.map(s=>shortMap.get(s) ?? s))].sort();
  const paths=['/',...(shorts.length?['/directory']:[]),...shorts.map(s=>`/${s}`)];
  if(paths.length>50000)throw new Error('Sitemap index required');
  const body=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p=>`  <url><loc>https://kdial.in${escape(p)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return {status:200,headers,body};
 }catch{return {status:503,headers:{...headers,'Content-Type':'text/plain; charset=utf-8','Retry-After':'60'},body:'Sitemap temporarily unavailable.'};}
}
