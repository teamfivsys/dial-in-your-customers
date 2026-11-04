import { createHash, createHmac, randomUUID } from 'node:crypto';

const HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sha = value => createHash('sha256').update(value).digest('hex');
function validateSubmission(value) {
  if(!value||typeof value!=='object'||Array.isArray(value))return {errors:['Submission must be an object.']};
  const s=k=>typeof value[k]==='string'?value[k].trim():'';
  const data={name:s('name'),category_slug:s('category_slug'),locality_slug:s('locality_slug'),address:s('address'),phone:s('phone'),whatsapp:s('whatsapp'),description:s('description'),applicant_email:s('applicant_email').toLowerCase(),consent:value.consent===true,whatsapp_consent:value.whatsapp_consent===true};
  const errors=[];
  if(data.name.length<2||data.name.length>140)errors.push('Business name must be 2–140 characters.');
  for(const k of ['category_slug','locality_slug'])if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data[k])||data[k].length>100)errors.push('Choose a valid category and neighbourhood.');
  if(data.address.length<5||data.address.length>500)errors.push('Address must be 5–500 characters.');
  if(!/^\+91[6-9][0-9]{9}$/.test(data.phone))errors.push('Enter an Indian phone number in +91 format.');
  if(data.whatsapp_consent&&!/^\+91[6-9][0-9]{9}$/.test(data.whatsapp))errors.push('Enter a valid consented WhatsApp number.');
  if(!data.whatsapp_consent)data.whatsapp='';
  if(data.description.length<20||data.description.length>2000)errors.push('Description must be 20–2,000 characters.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.applicant_email)||data.applicant_email.length>254)errors.push('Enter a valid contact email.');
  if(!data.consent)errors.push('Publication consent is required.');
  return errors.length?{errors}:{data,errors};
}
const validOrigin = (request, env) => {
  const allowed = String(env.KDIAL_APP_ORIGIN || '').trim();
  if (!allowed || !request.headers.origin) return false;
  try { return new URL(allowed).origin === new URL(request.headers.origin).origin && new URL(allowed).protocol === 'https:'; } catch { return false; }
};
async function bodyJson(request, cap) {
  let size=0; const chunks=[];
  for await (const part of request) { size+=part.length; if (size>cap) throw Object.assign(new Error('Request is too large.'),{status:413}); chunks.push(part); }
  try { const value=JSON.parse(Buffer.concat(chunks).toString('utf8')); if(!value||typeof value!=='object'||Array.isArray(value)) throw new Error(); return value; }
  catch { throw Object.assign(new Error('Invalid JSON.'),{status:400}); }
}
async function verifyCaptcha({token,request,env,action,fetcher}) {
  const secret=env.KDIAL_TURNSTILE_SECRET;
  if(!secret) throw Object.assign(new Error('Security verification is not configured.'),{status:503});
  if(typeof token!=='string'||token.length<1||token.length>2048) throw Object.assign(new Error('Complete the security check.'),{status:400});
  const origin = new URL(request.headers.origin);
  let response;
  try { response=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret,response:token,remoteip:String(request.headers['cf-connecting-ip']||'')}),signal:AbortSignal.timeout(5000)}); }
  catch { throw Object.assign(new Error('Security verification is temporarily unavailable.'),{status:503}); }
  if(!response.ok) throw Object.assign(new Error('Security verification is temporarily unavailable.'),{status:503});
  const result=await response.json();
  if(result.success!==true||result.hostname!==origin.hostname||result.action!==action) throw Object.assign(new Error('Security verification failed. Please try again.'),{status:403});
}
const idCheck=id=>{if(!UUID.test(String(id||''))) throw Object.assign(new Error('Invalid reference.'),{status:400});};

export function createMysqlPublicActionApi({pool,env=process.env,fetcher=fetch}) {
  const send=(res,status,data,extra={})=>{res.writeHead(status,{...HEADERS,...extra});res.end(data===null?undefined:JSON.stringify(data));};
  async function submission(body,request) {
    const checked=validateSubmission(body); if(!checked.data) throw Object.assign(new Error(checked.errors.join(' ')),{status:400});
    await verifyCaptcha({token:body.captcha_token,request,env,action:'submit_business',fetcher});
    const rateSecret=env.KDIAL_SUBMISSION_RATE_SECRET;
    if(!rateSecret||rateSecret.length<32) throw Object.assign(new Error('Submission verification is not configured.'),{status:503});
    const rateKey=createHmac('sha256',rateSecret).update(checked.data.applicant_email).digest('hex');
    const conn=await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute(`INSERT INTO submission_rate_windows(rate_key,started_at,submission_count) VALUES(?,UTC_TIMESTAMP(3),1) ON DUPLICATE KEY UPDATE submission_count=IF(started_at<UTC_TIMESTAMP(3)-INTERVAL 1 HOUR,1,submission_count+1),started_at=IF(started_at<UTC_TIMESTAMP(3)-INTERVAL 1 HOUR,UTC_TIMESTAMP(3),started_at)`,[rateKey]);
      const [rate]=await conn.execute('SELECT submission_count FROM submission_rate_windows WHERE rate_key=? FOR UPDATE',[rateKey]);
      const [global]=await conn.execute('SELECT COUNT(*) AS n FROM submissions WHERE created_at>UTC_TIMESTAMP(3)-INTERVAL 1 HOUR');
      if(Number(rate[0]?.submission_count)>3) throw Object.assign(new Error('Submission limit reached. Try later.'),{status:429});
      if(Number(global[0]?.n)>=200) throw Object.assign(new Error('Submission capacity reached. Try later.'),{status:429});
      const d=checked.data;
      const [cat]=await conn.execute('SELECT 1 FROM categories WHERE slug=?',[d.category_slug]);
      const [loc]=await conn.execute('SELECT 1 FROM localities WHERE slug=?',[d.locality_slug]);
      if(!cat.length||!loc.length) throw Object.assign(new Error('Choose a current category and neighbourhood.'),{status:400});
      const id=randomUUID();
      const payload={name:d.name,category_slug:d.category_slug,locality_slug:d.locality_slug,address:d.address,phone:d.phone,whatsapp:d.whatsapp_consent?d.whatsapp:null,description:d.description};
      await conn.execute('INSERT INTO submissions(id,payload,applicant_email) VALUES(?,?,?)',[id,JSON.stringify(payload),d.applicant_email]);
      await conn.execute('INSERT INTO admin_audit_events(actor_id,entity_id,action,details) VALUES(NULL,?,?,?)',[id,'submission_received',JSON.stringify({})]);
      await conn.commit(); return id;
    } catch(e){try{await conn.rollback();}catch{} throw e;} finally{conn.release();}
  }
  async function offer(token) {
    if(!UUID.test(token)) return null;
    const payee=String(env.KDIAL_UPI_PAYEE||'').trim(), upi=String(env.KDIAL_UPI_ID||'').trim(), qr=String(env.KDIAL_UPI_QR_BASE64||'').trim();
    if(!payee||!upi||!qr||qr.length>500000||!/^[A-Za-z0-9+/]+={0,2}$/.test(qr)||!/^[^@\s]{2,100}@[A-Za-z0-9.-]{2,100}$/.test(upi)) return null;
    const [rows]=await pool.execute(`SELECT l.name,l.agreed_amount_minor,l.currency,l.package_inclusions,l.cancellation_refund_terms,l.terms_start,l.terms_end,l.payment_status,l.publication_status,l.content_status,l.content_verified_by,l.content_verified_at,l.consent_reference,l.terms_confirmed FROM payment_offers o JOIN listings l ON l.id=o.listing_id WHERE o.offer_token=? AND l.terms_start<=DATE(UTC_TIMESTAMP()+INTERVAL 330 MINUTE) AND l.terms_end>DATE(UTC_TIMESTAMP()+INTERVAL 330 MINUTE) LIMIT 1`,[token]);
    const r=rows[0]; if(!r || r.content_status!=='approved'||!r.content_verified_by||!r.content_verified_at||!r.consent_reference||!r.terms_confirmed||r.currency!=='INR'||Number(r.agreed_amount_minor)!==50100||r.publication_status!=='unpublished'||['bank_verified','rejected'].includes(r.payment_status)||!r.terms_start||!r.terms_end||new Date(`${String(r.terms_end).slice(0,10)}T00:00:00+05:30`)<=new Date()||!r.package_inclusions||!r.cancellation_refund_terms) return null;
    return {business_name:r.name,amount_minor:50100,currency:'INR',package_inclusions:r.package_inclusions,cancellation_refund_terms:r.cancellation_refund_terms,first_year_label:'₹501 for the first year. The term begins on publication.',renewal_label:'₹701 for manual renewal; no automatic charge.',payee,upi_id:upi,qr_base64:qr,payment_status:'report_only'};
  }
  async function reportPayment(body,request) {
    const token=String(body.offer_token||''), ref=typeof body.evidence_reference==='string'?body.evidence_reference.trim():'';
    if(!UUID.test(token)) throw Object.assign(new Error('Invalid payment offer.'),{status:400});
    if(ref.length<3||ref.length>120||!/^[A-Za-z0-9._/-]+$/.test(ref)) throw Object.assign(new Error('Enter a valid UPI transaction reference.'),{status:400});
    await verifyCaptcha({token:body.captcha_token,request,env,action:'report_upi_payment',fetcher});
    const active=await offer(token); if(!active) throw Object.assign(new Error('The offer is no longer available or the report could not be saved.'),{status:400});
    const event=sha(`${token.toLowerCase()}\n${ref}`), [offers]=await pool.execute('SELECT listing_id FROM payment_offers WHERE offer_token=?',[token]);
    const listingId=offers[0]?.listing_id; if(!listingId) throw Object.assign(new Error('The offer is no longer available.'),{status:400});
    const conn=await pool.getConnection();
    try { await conn.beginTransaction();
      const [prior]=await conn.execute('SELECT listing_id,amount_minor,source,evidence_reference FROM payment_reports WHERE event_key=? FOR UPDATE',[event]);
      if(prior.length){const p=prior[0];if(p.listing_id!==listingId||Number(p.amount_minor)!==50100||p.source!=='manual'||p.evidence_reference!==ref)throw Object.assign(new Error('Conflicting duplicate payment report.'),{status:409});await conn.commit();return;}
      await conn.execute('INSERT INTO payment_reports(listing_id,event_key,source,amount_minor,evidence_reference,reported_by) VALUES(?,?,?,?,?,NULL)',[listingId,event,'manual',50100,ref]);
      await conn.execute(`UPDATE listings SET payment_status=IF(payment_status='bank_verified',payment_status,'reported') WHERE id=?`,[listingId]);
      await conn.execute('INSERT INTO admin_audit_events(actor_id,entity_id,action,details) VALUES(NULL,?,?,?)',[listingId,'payment_reported',JSON.stringify({source:'manual',event_key:event})]);
      await conn.commit();
    } catch(e){try{await conn.rollback();}catch{} throw e;} finally{conn.release();}
  }
  async function analytics(body,request) {
    if(!['A','B'].includes(body.variant)||!['impression','whatsapp_click'].includes(body.event)||!UUID.test(String(body.session_id||''))) throw Object.assign(new Error('Invalid event.'),{status:400});
    const path=typeof body.path==='string'&&body.path.startsWith('/')?body.path.slice(0,500):null;
    const ua=String(request.headers['user-agent']||'').slice(0,500);
    await pool.execute('INSERT INTO ab_events(variant,event,session_id,path,user_agent) VALUES(?,?,?,?,?)',[body.variant,body.event,body.session_id,path,ua]);
  }
  async function route(req,res) {
    const path=new URL(req.url||'/', 'http://localhost').pathname, method=req.method||'GET';
    try {
      if(path==='/api/v1/payment-offers'&&method==='GET') {const token=new URL(req.url,'http://localhost').searchParams.get('token')||'';const value=await offer(token);return send(res,value?200:404,value||{error:'Offer unavailable.'});}
      if(!validOrigin(req,env)) return send(res,403,{error:'Origin not allowed.'});
      if(path==='/api/v1/submissions'&&method==='POST'){const body=await bodyJson(req,16000);const id=await submission(body,req);return send(res,201,{id,status:'pending',message:'Received for review. This is not a live listing, activation or payment confirmation.'});}
      if(path==='/api/v1/payment-reports'&&method==='POST'){const body=await bodyJson(req,6000);await reportPayment(body,req);return send(res,200,{status:'reported',message:'Reference received for manual review. This is not payment confirmation.'});}
      if(path==='/api/v1/analytics'&&method==='POST'){const body=await bodyJson(req,4000);await analytics(body,req);return send(res,204,null);}
      return send(res,404,{error:'Not found.'});
    } catch(e){const status=Number.isInteger(e?.status)?e.status:500;return send(res,status,{error:status<500?e.message:'The request could not be completed.'});}
  }
  return {route,handles:path=>['/api/v1/submissions','/api/v1/payment-offers','/api/v1/payment-reports','/api/v1/analytics'].some(x=>path===x)};
}
