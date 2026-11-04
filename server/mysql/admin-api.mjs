import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = 'kdial_admin_session';
const SESSION_SECONDS = 8 * 60 * 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHONE_RE = /^\+91[6-9][0-9]{9}$/;
const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };

const sha256 = value => createHash('sha256').update(value).digest('hex');
function cookieValue(header, name) {
  for (const part of String(header ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return '';
}
function cookie(token, secure) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure ? '; Secure' : ''}`;
}
function clearCookie(secure) { return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`; }
function validateListing(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error('Invalid listing.');
  const str = (key, min, max, optional = false) => {
    const value = record[key] == null ? '' : String(record[key]).trim();
    if (optional && value === '') return null;
    if (value.length < min || value.length > max) throw new Error(`Invalid ${key.replaceAll('_', ' ')}.`);
    return value;
  };
  const slug = str('slug', 1, 100); if (!SLUG_RE.test(slug)) throw new Error('Invalid listing slug.');
  const name = str('name', 2, 140);
  const category = str('category_slug', 1, 100); if (!SLUG_RE.test(category)) throw new Error('Invalid category.');
  const locality = str('locality_slug', 1, 100); if (!SLUG_RE.test(locality)) throw new Error('Invalid locality.');
  const address = str('address', 5, 500);
  const phone = str('phone', 13, 13); if (!PHONE_RE.test(phone)) throw new Error('Invalid phone.');
  const whatsapp = str('whatsapp', 13, 13, true); if (whatsapp && !PHONE_RE.test(whatsapp)) throw new Error('Invalid WhatsApp number.');
  const website = str('website', 0, 500, true); if (website && (!website.startsWith('https://') || /\s/.test(website))) throw new Error('Website must use HTTPS.');
  const description = str('description', 20, 2000);
  const arr = (key, max, validate) => {
    const value = record[key] == null ? [] : record[key];
    if (!Array.isArray(value) || value.length > max || !value.every(validate)) throw new Error(`Invalid ${key}.`);
    return value;
  };
  const services = arr('services', 30, x => typeof x === 'string' && x.trim().length > 0 && x.trim().length <= 120).map(x => x.trim());
  const photos = arr('photos', 10, x => typeof x === 'string' && x.length <= 1000 && /^https:\/\/[^\s]+$/.test(x));
  const hours = arr('hours', 14, x => x && typeof x === 'object' && typeof x.days === 'string' && x.days.trim().length > 0 && x.days.length <= 80 && /^([01]\d|2[0-3]):[0-5]\d$/.test(x.opens) && /^([01]\d|2[0-3]):[0-5]\d$/.test(x.closes))
    .map(x => ({ days: x.days.trim(), opens: x.opens, closes: x.closes }));
  return { slug, name, category_slug: category, locality_slug: locality, address, phone, whatsapp, website, description, services, photos, hours };
}

export function createMysqlAdminApi({ pool, env = process.env, sendResetEmail = null }) {
  if (!pool || typeof pool.execute !== 'function') throw new TypeError('A MySQL pool is required');
  const secureCookie = env.KDIAL_LOCAL_TEST !== 'true';
  const smtpPort = Number(env.KDIAL_SMTP_PORT || 587);
  const smtpReady = Boolean(env.KDIAL_SMTP_HOST && env.KDIAL_SMTP_USER && env.KDIAL_SMTP_PASSWORD && env.KDIAL_SMTP_FROM && Number.isInteger(smtpPort) && smtpPort > 0 && smtpPort <= 65535);
  const mailer = sendResetEmail || (smtpReady ? (async ({ to, resetUrl }) => {
    const transport = nodemailer.createTransport({
      host: env.KDIAL_SMTP_HOST, port: smtpPort, secure: smtpPort === 465,
      requireTLS: smtpPort !== 465, auth: { user: env.KDIAL_SMTP_USER, pass: env.KDIAL_SMTP_PASSWORD },
      tls: { rejectUnauthorized: true }, connectionTimeout: 8_000, greetingTimeout: 8_000, socketTimeout: 12_000,
    });
    try {
      await transport.sendMail({
        from: env.KDIAL_SMTP_FROM, to, subject: 'Reset your KDial admin password',
        text: `A password reset was requested for your KDial admin account. This link expires in 30 minutes and can be used once:\n\n${resetUrl}\n\nIf you did not request this, ignore this message.`,
      });
    } finally { transport.close(); }
  }) : null);
  function verifyOrigin(request) {
    const expected = env.KDIAL_APP_ORIGIN;
    const actual = request.headers.origin;
    if (!expected || !actual) return false;
    try {
      const expectedUrl = new URL(expected);
      const actualUrl = new URL(actual);
      if (env.KDIAL_LOCAL_TEST !== 'true' && expectedUrl.protocol !== 'https:') return false;
      return actualUrl.origin === expectedUrl.origin;
    } catch { return false; }
  }
  async function readJson(request, limit = 32_000) {
    let bytes = 0; const chunks = [];
    for await (const chunk of request) { bytes += chunk.length; if (bytes > limit) throw Object.assign(new Error('Request too large.'), { status: 413 }); chunks.push(chunk); }
    try { const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(); return parsed; }
    catch { throw Object.assign(new Error('Invalid JSON.'), { status: 400 }); }
  }
  const csrfFor = token => createHmac('sha256', token).update('kdial-csrf-v1').digest('base64url');
  async function getSession(request) {
    const token = cookieValue(request.headers.cookie, SESSION_COOKIE);
    if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
    const tokenHash = sha256(token);
    const [rows] = await pool.execute(`SELECT u.id,u.email,u.role FROM admin_sessions s JOIN admin_users u ON u.id=s.admin_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP(3) AND u.active=1`, [tokenHash]);
    return rows?.[0] ? { token, tokenHash, csrfToken: csrfFor(token), user: { id: rows[0].id, email: rows[0].email, role: rows[0].role } } : null;
  }
  function csrfMatches(request, session) {
    const actual = String(request.headers['x-kdial-csrf'] ?? '');
    const expected = session.csrfToken;
    if (!/^[A-Za-z0-9_-]{43}$/.test(actual)) return false;
    return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
  }
  async function requireSession(request, allowedRoles = null) {
    const session = await getSession(request);
    if (!session) throw Object.assign(new Error('Sign in required.'), { status: 401 });
    if (allowedRoles && !allowedRoles.includes(session.user.role)) throw Object.assign(new Error('Not authorized.'), { status: 403 });
    if (!verifyOrigin(request) || !csrfMatches(request, session)) throw Object.assign(new Error('Request verification failed.'), { status: 403 });
    return session;
  }
  async function recordAudit(conn, actorId, entityId, action, details = {}) {
    await conn.execute('INSERT INTO admin_audit_events (actor_id,entity_id,action,details) VALUES (?,?,?,?)', [actorId, entityId, action, JSON.stringify(details)]);
  }
  async function saveTaxonomy(session, kind, slugValue, labelValue) {
    if (!['category', 'locality'].includes(kind)) throw Object.assign(new Error('Unknown taxonomy kind.'), { status: 400 });
    const slug = String(slugValue ?? '').trim();
    const label = String(labelValue ?? '').trim();
    if (!SLUG_RE.test(slug) || slug.length > 100) throw Object.assign(new Error('Invalid taxonomy slug.'), { status: 400 });
    if (label.length < 1 || label.length > 100) throw Object.assign(new Error('Display name must be 1–100 characters.'), { status: 400 });
    const table = kind === 'category' ? 'categories' : 'localities';
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute(`INSERT INTO ${table} (slug,label) VALUES (?,?) ON DUPLICATE KEY UPDATE label=VALUES(label)`, [slug, label]);
      await recordAudit(conn, session.user.id, null, 'taxonomy_saved', { kind, slug });
      await conn.commit();
    } catch (error) { try { await conn.rollback(); } catch {} throw error; }
    finally { conn.release(); }
  }

  async function deleteTaxonomy(session, kind, slugValue) {
    if (!['category', 'locality'].includes(kind)) throw Object.assign(new Error('Unknown taxonomy kind.'), { status: 400 });
    const slug = String(slugValue ?? '').trim();
    if (!SLUG_RE.test(slug) || slug.length > 100) throw Object.assign(new Error('Invalid taxonomy slug.'), { status: 400 });
    const table = kind === 'category' ? 'categories' : 'localities';
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.execute(`DELETE FROM ${table} WHERE slug=?`, [slug]);
      if (!result.affectedRows) throw Object.assign(new Error('Taxonomy entry not found.'), { status: 404 });
      await recordAudit(conn, session.user.id, null, 'taxonomy_deleted', { kind, slug });
      await conn.commit();
    } catch (error) {
      try { await conn.rollback(); } catch {}
      if (error?.code === 'ER_ROW_IS_REFERENCED_2' || error?.errno === 1451) throw Object.assign(new Error('This category or locality is used by a listing and cannot be removed.'), { status: 409 });
      throw error;
    } finally { conn.release(); }
  }

  async function reviewContent(session, listingId, approve, referenceOrReason) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(listingId ?? ''))) throw Object.assign(new Error('Invalid listing id.'), { status: 400 });
    if (typeof approve !== 'boolean') throw Object.assign(new Error('Choose approve or reject.'), { status: 400 });
    const evidence = String(referenceOrReason ?? '').trim();
    if (evidence.length < 3 || evidence.length > 500) throw Object.assign(new Error(approve ? 'A consent reference is required.' : 'A rejection reason is required.'), { status: 400 });
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.execute('SELECT id FROM listings WHERE id=? FOR UPDATE', [listingId]);
      if (!rows.length) throw Object.assign(new Error('Listing not found.'), { status: 404 });
      await conn.execute(`UPDATE listings SET content_status=?,content_verified_by=?,content_verified_at=?,consent_reference=?,rejection_reason=?,publication_status='unpublished' WHERE id=?`, [approve ? 'approved' : 'rejected', approve ? session.user.id : null, approve ? new Date() : null, approve ? evidence : null, approve ? null : evidence, listingId]);
      await recordAudit(conn, session.user.id, listingId, approve ? 'content_approved' : 'content_rejected', { reference_or_reason: evidence });
      await conn.commit();
    } catch (error) { try { await conn.rollback(); } catch {} throw error; }
    finally { conn.release(); }
  }

  async function changePublication(session, listingId, action, reason) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(listingId ?? ''))) throw Object.assign(new Error('Invalid listing id.'), { status: 400 });
    if (!['published', 'unpublished', 'suspended', 'expired'].includes(action)) throw Object.assign(new Error('Invalid publication action.'), { status: 400 });
    const note = String(reason ?? '').trim();
    if (action !== 'published' && (note.length < 3 || note.length > 500)) throw Object.assign(new Error('A short reason is required when removing publication.'), { status: 400 });
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.execute(`SELECT id,content_status,content_verified_by,content_verified_at,consent_reference,terms_confirmed,package_version,agreed_amount_minor,currency,terms_start,terms_end,payment_status,bank_verified_by,bank_verified_at,bank_reference,bank_verified_amount_minor FROM listings WHERE id=? FOR UPDATE`, [listingId]);
      const row = rows[0];
      if (!row) throw Object.assign(new Error('Listing not found.'), { status: 404 });
      if (action === 'published') {
        const [eligibleRows] = await conn.execute(`SELECT (content_status='approved' AND content_verified_by IS NOT NULL AND content_verified_at IS NOT NULL AND COALESCE(CHAR_LENGTH(consent_reference),0)>0 AND terms_confirmed=1 AND COALESCE(CHAR_LENGTH(package_version),0)>0 AND agreed_amount_minor>0 AND currency='INR' AND terms_start<=DATE(UTC_TIMESTAMP()+INTERVAL 330 MINUTE) AND terms_end>DATE(UTC_TIMESTAMP()+INTERVAL 330 MINUTE) AND payment_status='bank_verified' AND bank_verified_by IS NOT NULL AND bank_verified_at IS NOT NULL AND COALESCE(CHAR_LENGTH(bank_reference),0)>0 AND bank_verified_amount_minor=agreed_amount_minor) AS publishable FROM listings WHERE id=?`, [listingId]);
        if (!eligibleRows[0]?.publishable) throw Object.assign(new Error('Cannot publish yet: verified business consent, confirmed current terms and manually verified matching bank credit are all required.'), { status: 409 });
      }
      await conn.execute('UPDATE listings SET publication_status=? WHERE id=?', [action, listingId]);
      await recordAudit(conn, session.user.id, listingId, `publication_${action}`, { reason: note });
      await conn.commit();
    } catch (error) { try { await conn.rollback(); } catch {} throw error; }
    finally { conn.release(); }
  }

  async function confirmTerms(session, body) {
    const id=String(body.listing_id||'');
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw Object.assign(new Error('Invalid listing id.'),{status:400});
    const version=String(body.package_version||'').trim(), amount=Number(body.amount_minor), start=String(body.start_date||''), end=String(body.end_date||'');
    if(version.length<3||version.length>200||!Number.isSafeInteger(amount)||amount<=0||!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end)||end<=start) throw Object.assign(new Error('Enter the agreed package, amount and valid term dates.'),{status:400});
    const conn=await pool.getConnection();
    try { await conn.beginTransaction();
      const [rows]=await conn.execute('SELECT id FROM listings WHERE id=? FOR UPDATE',[id]); if(!rows.length)throw Object.assign(new Error('Listing not found.'),{status:404});
      await conn.execute(`UPDATE listings SET package_version=?,agreed_amount_minor=?,currency='INR',terms_start=?,terms_end=?,terms_confirmed=1,payment_status='not_reported',bank_verified_by=NULL,bank_verified_at=NULL,bank_reference=NULL,bank_verified_amount_minor=NULL,publication_status='unpublished' WHERE id=?`,[version,amount,start,end,id]);
      await conn.execute('DELETE FROM payment_offers WHERE listing_id=?',[id]);
      await conn.execute('UPDATE listings SET package_inclusions=NULL,cancellation_refund_terms=NULL WHERE id=?',[id]);
      await recordAudit(conn,session.user.id,id,'terms_confirmed',{package_version:version,amount_minor:amount,start_date:start,end_date:end}); await conn.commit();
    }catch(e){try{await conn.rollback()}catch{} throw e}finally{conn.release()}
  }
  async function reportPaymentAdmin(session, body) {
    const id=String(body.listing_id||''), event=String(body.event_key||'').trim(), source=String(body.source||''), amount=Number(body.amount_minor), reference=String(body.evidence_reference||'').trim();
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)||event.length<1||event.length>150||!['manual','youpi'].includes(source)||!Number.isSafeInteger(amount)||amount<=0||reference.length<1||reference.length>500) throw Object.assign(new Error('Enter a valid payment report.'),{status:400});
    const conn=await pool.getConnection(); try{await conn.beginTransaction();
      const [existing]=await conn.execute('SELECT listing_id,amount_minor,source,evidence_reference FROM payment_reports WHERE event_key=? FOR UPDATE',[event]);
      if(existing.length){const r=existing[0];if(r.listing_id!==id||Number(r.amount_minor)!==amount||r.source!==source||r.evidence_reference!==reference)throw Object.assign(new Error('This report reference already exists with different details.'),{status:409});await conn.commit();return;}
      const [rows]=await conn.execute('SELECT id FROM listings WHERE id=? FOR UPDATE',[id]);if(!rows.length)throw Object.assign(new Error('Listing not found.'),{status:404});
      await conn.execute('INSERT INTO payment_reports(listing_id,event_key,source,amount_minor,evidence_reference,reported_by) VALUES(?,?,?,?,?,?)',[id,event,source,amount,reference,session.user.id]);
      await conn.execute(`UPDATE listings SET payment_status=IF(payment_status='bank_verified',payment_status,'reported') WHERE id=?`,[id]);
      await recordAudit(conn,session.user.id,id,'payment_reported',{source,event_key:event}); await conn.commit();
    }catch(e){try{await conn.rollback()}catch{} throw e}finally{conn.release()}
  }
  async function verifyBank(session, body) {
    const id=String(body.listing_id||''), amount=Number(body.amount_minor), ref=String(body.reconciliation_reference||'').trim(), verified=body.verified;
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)||!Number.isSafeInteger(amount)||amount<=0||ref.length<3||ref.length>500||typeof verified!=='boolean')throw Object.assign(new Error('Enter the actual credit amount and a reconciliation reference or reason.'),{status:400});
    const conn=await pool.getConnection(); try{await conn.beginTransaction();
      const [rows]=await conn.execute('SELECT id,terms_confirmed,agreed_amount_minor FROM listings WHERE id=? FOR UPDATE',[id]); const row=rows[0]; if(!row)throw Object.assign(new Error('Listing not found.'),{status:404});
      if(verified&&(!row.terms_confirmed||Number(row.agreed_amount_minor)!==amount))throw Object.assign(new Error('Verified credit must match the explicitly agreed amount.'),{status:409});
      await conn.execute(`UPDATE listings SET payment_status=?,bank_verified_by=?,bank_verified_at=?,bank_reference=?,bank_verified_amount_minor=?,publication_status='unpublished' WHERE id=?`,[verified?'bank_verified':'rejected',verified?session.user.id:null,verified?new Date():null,ref,verified?amount:null,id]);
      await recordAudit(conn,session.user.id,id,verified?'bank_credit_verified':'bank_credit_rejected',{reference:ref,amount_minor:amount}); await conn.commit();
    }catch(e){try{await conn.rollback()}catch{} throw e}finally{conn.release()}
  }
  async function configureOffer(session, body) {
    const id=String(body.listing_id||''), inclusions=String(body.package_inclusions||'').trim(), refund=String(body.cancellation_refund_terms||'').trim();
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)||inclusions.length<10||inclusions.length>2000||refund.length<10||refund.length>1500)throw Object.assign(new Error('Provide exact package inclusions and cancellation/refund wording.'),{status:400});
    const token=randomUUID(), conn=await pool.getConnection();
    try{await conn.beginTransaction();
      const [rows]=await conn.execute(`SELECT content_status,content_verified_by,content_verified_at,consent_reference,terms_confirmed,currency,agreed_amount_minor,publication_status FROM listings WHERE id=? FOR UPDATE`,[id]); const r=rows[0];
      if(!r)throw Object.assign(new Error('Listing not found.'),{status:404});
      if(r.content_status!=='approved'||!r.content_verified_by||!r.content_verified_at||!r.consent_reference||!r.terms_confirmed||r.currency!=='INR'||Number(r.agreed_amount_minor)!==50100||r.publication_status!=='unpublished')throw Object.assign(new Error('Offer preview requires approved business consent, exact ₹501 first-year INR terms and an unpublished listing.'),{status:409});
      await conn.execute('UPDATE listings SET package_inclusions=?,cancellation_refund_terms=? WHERE id=?',[inclusions,refund,id]);
      await conn.execute('INSERT INTO payment_offers(listing_id,offer_token) VALUES(?,?) ON DUPLICATE KEY UPDATE offer_token=VALUES(offer_token),created_at=CURRENT_TIMESTAMP(3)',[id,token]);
      await recordAudit(conn,session.user.id,id,'customer_payment_offer_prepared',{amount_minor:50100,destination:'configured_upi'}); await conn.commit(); return token;
    }catch(e){try{await conn.rollback()}catch{} throw e}finally{conn.release()}
  }
  async function reviewSubmission(session, body) {
    const id=String(body.submission_id||''), accept=body.accept, reason=String(body.reason||'').trim(), slug=String(body.slug||'').trim();
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)||typeof accept!=='boolean'||reason.length<3||reason.length>500||(accept&&!SLUG_RE.test(slug)))throw Object.assign(new Error('Choose an outcome, reason and a valid listing slug when accepting.'),{status:400});
    const conn=await pool.getConnection(); try{await conn.beginTransaction();
      const [rows]=await conn.execute('SELECT id,payload,status FROM submissions WHERE id=? FOR UPDATE',[id]);const s=rows[0]; if(!s||s.status!=='pending')throw Object.assign(new Error('Pending submission not found.'),{status:404});
      let listingId=null;
      if(accept){let payload=s.payload;if(typeof payload==='string')payload=JSON.parse(payload); const record=validateListing({...payload,slug,whatsapp:payload.whatsapp||'',website:'',services:[],photos:[],hours:[]});
        const [cat]=await conn.execute('SELECT slug FROM categories WHERE slug=?',[record.category_slug]);const [loc]=await conn.execute('SELECT slug FROM localities WHERE slug=?',[record.locality_slug]);if(!cat.length||!loc.length)throw Object.assign(new Error('Submission category or locality is no longer available.'),{status:409});
        listingId=randomUUID();await conn.execute(`INSERT INTO listings (id,slug,name,category_slug,locality_slug,address,phone,whatsapp,website,description,services,hours,photos) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,[listingId,record.slug,record.name,record.category_slug,record.locality_slug,record.address,record.phone,record.whatsapp,record.website,record.description,'[]','[]','[]']);
        await recordAudit(conn,session.user.id,listingId,'listing_saved',{source_submission:id});
      }
      await conn.execute('UPDATE submissions SET status=?,review_reason=?,reviewed_by=?,reviewed_at=UTC_TIMESTAMP(3),listing_id=? WHERE id=?',[accept?'accepted':'rejected',reason,session.user.id,listingId,id]);
      await recordAudit(conn,session.user.id,id,accept?'submission_accepted_as_draft':'submission_rejected',{reason,listing_id:listingId}); await conn.commit(); return listingId;
    }catch(e){try{await conn.rollback()}catch{} throw e}finally{conn.release()}
  }
  async function deleteDraft(session,id) {
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(id||'')))throw Object.assign(new Error('Invalid listing id.'),{status:400});
    const conn=await pool.getConnection();try{await conn.beginTransaction();const [rows]=await conn.execute(`SELECT id FROM listings WHERE id=? AND publication_status='unpublished' AND content_status='draft' AND payment_status='not_reported' AND terms_confirmed=0 FOR UPDATE`,[id]);if(!rows.length)throw Object.assign(new Error('Only untouched unpublished drafts can be deleted; suspend other listings.'),{status:409});await conn.execute('DELETE FROM listings WHERE id=?',[id]);await recordAudit(conn,session.user.id,id,'draft_deleted',{});await conn.commit();}catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
  }
  async function saveDraft(session, record, listingId) {
    const data = validateListing(record);
    const id = listingId == null ? randomUUID() : String(listingId);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw Object.assign(new Error('Invalid listing id.'), { status: 400 });
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [categories] = await conn.execute('SELECT slug FROM categories WHERE slug=?', [data.category_slug]);
      const [localities] = await conn.execute('SELECT slug FROM localities WHERE slug=?', [data.locality_slug]);
      if (!categories.length || !localities.length) throw Object.assign(new Error('Choose a current category and locality.'), { status: 400 });
      if (listingId == null) {
        await conn.execute(`INSERT INTO listings (id,slug,name,category_slug,locality_slug,address,phone,whatsapp,website,description,services,hours,photos) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [id,data.slug,data.name,data.category_slug,data.locality_slug,data.address,data.phone,data.whatsapp,data.website,data.description,JSON.stringify(data.services),JSON.stringify(data.hours),JSON.stringify(data.photos)]);
      } else {
        const [existing] = await conn.execute('SELECT id FROM listings WHERE id=? FOR UPDATE', [id]);
        if (!existing.length) throw Object.assign(new Error('Listing not found.'), { status: 404 });
        await conn.execute(`UPDATE listings SET slug=?,name=?,category_slug=?,locality_slug=?,address=?,phone=?,whatsapp=?,website=?,description=?,services=?,hours=?,photos=?,content_status='draft',publication_status='unpublished',content_verified_by=NULL,content_verified_at=NULL,consent_reference=NULL,rejection_reason=NULL,terms_confirmed=0,package_version=NULL,agreed_amount_minor=NULL,currency='INR',terms_start=NULL,terms_end=NULL,payment_status='not_reported',bank_verified_by=NULL,bank_verified_at=NULL,bank_reference=NULL,bank_verified_amount_minor=NULL,package_inclusions=NULL,cancellation_refund_terms=NULL WHERE id=?`, [data.slug,data.name,data.category_slug,data.locality_slug,data.address,data.phone,data.whatsapp,data.website,data.description,JSON.stringify(data.services),JSON.stringify(data.hours),JSON.stringify(data.photos),id]);
        await conn.execute('DELETE FROM payment_offers WHERE listing_id=?',[id]);
      }
      await recordAudit(conn, session.user.id, id, 'listing_saved', { listing_id: id });
      await conn.commit();
      return id;
    } catch (error) { try { await conn.rollback(); } catch {} throw error; }
    finally { conn.release(); }
  }
  async function requestPasswordReset(email) {
    const emailKey=sha256(email);
    await pool.execute(`INSERT INTO admin_password_reset_attempts(email_key,window_started_at,attempts) VALUES(?,UTC_TIMESTAMP(3),1) ON DUPLICATE KEY UPDATE attempts=IF(window_started_at<UTC_TIMESTAMP(3)-INTERVAL 15 MINUTE,1,attempts+1),window_started_at=IF(window_started_at<UTC_TIMESTAMP(3)-INTERVAL 15 MINUTE,UTC_TIMESTAMP(3),window_started_at)`,[emailKey]);
    const [limits]=await pool.execute('SELECT attempts FROM admin_password_reset_attempts WHERE email_key=?',[emailKey]);
    if(Number(limits[0]?.attempts)>3)throw Object.assign(new Error('Too many recovery requests. Try again later.'),{status:429});
    if(!mailer)throw Object.assign(new Error('Password recovery email is not configured.'),{status:503});
    const [users]=await pool.execute('SELECT id,email FROM admin_users WHERE email_normalized=? AND active=1 LIMIT 1',[email]);
    const user=users[0];
    if(user){
      const raw=randomBytes(32).toString('base64url'), tokenHash=sha256(raw), conn=await pool.getConnection();
      try{await conn.beginTransaction();await conn.execute('DELETE FROM admin_password_reset_tokens WHERE admin_id=?',[user.id]);await conn.execute('INSERT INTO admin_password_reset_tokens(token_hash,admin_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(3),INTERVAL 30 MINUTE))',[tokenHash,user.id]);await conn.execute("INSERT INTO admin_audit_events(actor_id,entity_id,action,details) VALUES(NULL,?,'password_reset_requested',JSON_OBJECT())",[user.id]);await conn.commit();}
      catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
      const resetUrl=new URL('/admin',env.KDIAL_APP_ORIGIN);resetUrl.searchParams.set('reset',raw);
      try{await mailer({to:user.email,resetUrl:resetUrl.toString()});}
      catch{await pool.execute('DELETE FROM admin_password_reset_tokens WHERE token_hash=?',[tokenHash]);throw Object.assign(new Error('Password recovery email could not be sent. Try again later.'),{status:503});}
    }
    return {message:'If this email belongs to an active KDial admin, a one-time recovery link will arrive.'};
  }
  async function confirmPasswordReset(token,password) {
    if(!/^[A-Za-z0-9_-]{40,60}$/.test(token)||typeof password!=='string'||password.length<12||password.length>128)throw Object.assign(new Error('Use a valid recovery link and a 12–128 character password.'),{status:400});
    const {salt,hash}=await hashPassword(password), conn=await pool.getConnection(), tokenHash=sha256(token);
    try{await conn.beginTransaction();const [rows]=await conn.execute('SELECT admin_id FROM admin_password_reset_tokens WHERE token_hash=? AND expires_at>UTC_TIMESTAMP(3) FOR UPDATE',[tokenHash]);const row=rows[0];if(!row)throw Object.assign(new Error('This recovery link is invalid or expired. Request a new one.'),{status:400});await conn.execute('UPDATE admin_users SET password_salt=?,password_hash=?,updated_at=UTC_TIMESTAMP(3) WHERE id=? AND active=1',[salt,hash,row.admin_id]);await conn.execute('DELETE FROM admin_sessions WHERE admin_id=?',[row.admin_id]);await conn.execute('DELETE FROM admin_password_reset_tokens WHERE admin_id=?',[row.admin_id]);const [emailRows]=await conn.execute('SELECT SHA2(email_normalized,256) AS email_key FROM admin_users WHERE id=?',[row.admin_id]);if(emailRows[0])await conn.execute('DELETE FROM admin_password_reset_attempts WHERE email_key=?',[emailRows[0].email_key]);await conn.execute("INSERT INTO admin_audit_events(actor_id,entity_id,action,details) VALUES(NULL,?,'password_reset_completed',JSON_OBJECT())",[row.admin_id]);await conn.commit();}
    catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
    return {ok:true};
  }
  async function changePassword(session,body) {
    const current=typeof body.current_password==='string'?body.current_password:'', next=typeof body.new_password==='string'?body.new_password:'';
    if(current.length<12||current.length>128||next.length<12||next.length>128||current===next)throw Object.assign(new Error('Enter your current password and a different 12–128 character new password.'),{status:400});
    const [rows]=await pool.execute('SELECT password_salt,password_hash FROM admin_users WHERE id=? AND active=1',[session.user.id]);const user=rows[0];if(!user)throw Object.assign(new Error('Account is unavailable.'),{status:401});
    const actual=await scrypt(current,Buffer.from(user.password_salt),64,{N:16384,r:8,p:1,maxmem:64*1024*1024});const expected=Buffer.from(user.password_hash);const valid=timingSafeEqual(actual,expected);actual.fill(0);if(!valid)throw Object.assign(new Error('Current password is incorrect.'),{status:403});
    const {salt,hash}=await hashPassword(next),conn=await pool.getConnection();
    try{await conn.beginTransaction();await conn.execute('UPDATE admin_users SET password_salt=?,password_hash=?,updated_at=UTC_TIMESTAMP(3) WHERE id=?',[salt,hash,session.user.id]);await conn.execute('DELETE FROM admin_sessions WHERE admin_id=?',[session.user.id]);await recordAudit(conn,session.user.id,session.user.id,'password_changed',{});await conn.commit();}
    catch(e){try{await conn.rollback()}catch{}throw e}finally{conn.release()}
    return {ok:true};
  }

  async function route(request, response) {
    const method = request.method || 'GET';
    const path = new URL(request.url || '/', 'http://localhost').pathname;
    const send = (status, body, extra = {}) => { response.writeHead(status, { ...jsonHeaders, ...extra }); response.end(body === null ? undefined : JSON.stringify(body)); };
    try {
      if (path === '/api/v1/admin/password-reset' && method === 'POST') {
        if (!verifyOrigin(request)) return send(403, { error: 'Request verification failed.' });
        const body=await readJson(request,8_000), email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
        if(!EMAIL_RE.test(email)||email.length>254)return send(400,{error:'Enter a valid email address.'});
        return send(200,await requestPasswordReset(email));
      }
      if (path === '/api/v1/admin/password-reset/confirm' && method === 'POST') {
        if (!verifyOrigin(request)) return send(403, { error: 'Request verification failed.' });
        const body=await readJson(request,8_000);return send(200,await confirmPasswordReset(String(body.token||''),body.password));
      }
      if (path === '/api/v1/admin/password' && method === 'POST') {
        const session=await requireSession(request);const body=await readJson(request,8_000);await changePassword(session,body);return send(200,{ok:true,signed_out:true},{'Set-Cookie':clearCookie(secureCookie)});
      }
      if (path === '/api/v1/admin/session' && method === 'POST') {
        if (!verifyOrigin(request)) return send(403, { error: 'Request verification failed.' });
        const body = await readJson(request, 8_000);
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';
        if (!EMAIL_RE.test(email) || password.length < 12 || password.length > 128) return send(400, { error: 'Enter a valid email and password.' });
        const emailKey = sha256(email);
        await pool.execute(`INSERT INTO admin_login_attempts(email_key,window_started_at,attempts) VALUES(?,UTC_TIMESTAMP(3),1) ON DUPLICATE KEY UPDATE attempts=IF(window_started_at<UTC_TIMESTAMP(3)-INTERVAL 15 MINUTE,1,attempts+1),window_started_at=IF(window_started_at<UTC_TIMESTAMP(3)-INTERVAL 15 MINUTE,UTC_TIMESTAMP(3),window_started_at)`, [emailKey]);
        const [limitRows] = await pool.execute('SELECT attempts FROM admin_login_attempts WHERE email_key=?', [emailKey]);
        if (limitRows[0]?.attempts > 5) return send(429, { error: 'Sign-in is temporarily unavailable. Try again later.' });
        const [rows] = await pool.execute('SELECT id,email,role,password_salt,password_hash FROM admin_users WHERE email_normalized=? AND active=1 LIMIT 1', [email]);
        const user = rows?.[0];
        const salt = user ? Buffer.from(user.password_salt) : Buffer.alloc(16, 7);
        const expected = user ? Buffer.from(user.password_hash) : Buffer.alloc(64, 0);
        const actual = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
        const valid = user && timingSafeEqual(actual, expected);
        actual.fill(0);
        if (!valid) return send(401, { error: 'Email or password is incorrect.' });
        const rawToken = randomBytes(32).toString('base64url');
        const csrf = csrfFor(rawToken);
        await pool.execute('INSERT INTO admin_sessions(token_hash,admin_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(3),INTERVAL 8 HOUR))', [sha256(rawToken), user.id]);
        await pool.execute('DELETE FROM admin_login_attempts WHERE email_key=?', [emailKey]);
        return send(200, { user: { id: user.id, email: user.email, role: user.role }, csrfToken: csrf }, { 'Set-Cookie': cookie(rawToken, secureCookie) });
      }
      if (path === '/api/v1/admin/session' && method === 'GET') {
        const session = await getSession(request);
        if (!session) return send(200, { user: null, csrfToken: null }, { 'Set-Cookie': clearCookie(secureCookie) });
        // CSRF material is exposed only to the same-origin caller under SameSite=Strict.
        return send(200, { user: session.user, csrfToken: session.csrfToken });
      }
      if (path === '/api/v1/admin/session' && method === 'DELETE') {
        const session = await requireSession(request);
        await pool.execute('DELETE FROM admin_sessions WHERE token_hash=?', [session.tokenHash]);
        return send(200, { ok: true }, { 'Set-Cookie': clearCookie(secureCookie) });
      }
      if (path === '/api/v1/admin/dashboard' && method === 'GET') {
        const session = await requireSession(request, ['owner','editor','publisher','finance']);
        const role=session.user.role;
        const [listingRows] = await pool.execute(`SELECT id,slug,name,category_slug,locality_slug,address,phone,whatsapp,website,description,services,hours,photos,content_status,publication_status,payment_status,content_verified_by,content_verified_at,consent_reference,rejection_reason,terms_confirmed,package_version,agreed_amount_minor,currency,terms_start,terms_end,bank_verified_by,bank_verified_at,bank_reference,bank_verified_amount_minor,package_inclusions,cancellation_refund_terms,updated_at FROM listings ORDER BY updated_at DESC LIMIT 1000`);
        const [categories] = await pool.execute('SELECT slug,label FROM categories ORDER BY label ASC LIMIT 500');
        const [localities] = await pool.execute('SELECT slug,label FROM localities ORDER BY label ASC LIMIT 500');
        const parseJson=value=>{if(typeof value==='string'){try{return JSON.parse(value)}catch{return null}}return value};
        // Submission payloads include applicant contact details; only the roles that can review them may read them.
        let subRows=[];
        if(role==='owner'||role==='editor'){const [rows]=await pool.execute(`SELECT id,payload,applicant_email,consent_at,status,review_reason,reviewed_by,reviewed_at,listing_id,created_at FROM submissions ORDER BY created_at DESC LIMIT 500`);subRows=rows||[];}
        const [auditRows]=await pool.execute(`SELECT id,actor_id,entity_id,action,created_at FROM admin_audit_events ORDER BY id DESC LIMIT 100`);
        let reports=[];
        if(role==='owner'||role==='finance'){const [r]=await pool.execute(`SELECT id,listing_id,event_key,source,amount_minor,evidence_reference,reported_by,created_at FROM payment_reports ORDER BY created_at DESC LIMIT 500`);reports=r||[];}
        return send(200, { role, listings: (listingRows || []).map(row => ({
          ...row,
          ...(role === 'owner' || role === 'finance' ? {} : { bank_reference: null, bank_verified_by: null, bank_verified_at: null, bank_verified_amount_minor: null, agreed_amount_minor:null, package_version:null, terms_start:null, terms_end:null, package_inclusions:null, cancellation_refund_terms:null }),
          services: parseJson(row.services)||[], hours: parseJson(row.hours)||[], photos: parseJson(row.photos)||[],
          updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
        })), submissions:(subRows||[]).map(r=>({...r,payload:parseJson(r.payload)})), reports, audit:auditRows||[], taxonomy: { categories: categories || [], localities: localities || [] } });
      }
      if (path === '/api/v1/admin/taxonomy' && method === 'POST') {
        const session = await requireSession(request, ['owner','editor']);
        const body = await readJson(request, 4_000);
        await saveTaxonomy(session, body.kind, body.slug, body.label);
        return send(200, { ok: true });
      }
      if (path === '/api/v1/admin/taxonomy' && method === 'DELETE') {
        const session = await requireSession(request, ['owner','editor']);
        const body = await readJson(request, 2_000);
        await deleteTaxonomy(session, body.kind, body.slug);
        return send(200, { ok: true });
      }
      if (path === '/api/v1/admin/listings/review' && method === 'POST') {
        const session = await requireSession(request, ['owner','publisher']);
        const body = await readJson(request, 4_000);
        await reviewContent(session, body.listing_id, body.approve, body.reference_or_reason);
        return send(200, { ok: true, content_status: body.approve ? 'approved' : 'rejected' });
      }
      if (path === '/api/v1/admin/listings/publication' && method === 'POST') {
        const session = await requireSession(request, ['owner','publisher']);
        const body = await readJson(request, 4_000);
        await changePublication(session, body.listing_id, body.action, body.reason);
        return send(200, { ok: true, publication_status: body.action });
      }
      if (path === '/api/v1/admin/listings' && method === 'POST') {
        const session = await requireSession(request, ['owner','editor']);
        const body = await readJson(request, 16_000);
        const id = await saveDraft(session, body.record, body.listing_id ?? null);
        return send(200, { id, status: 'draft' });
      }
      if (path === '/api/v1/admin/listings/terms' && method === 'POST') {
        const session = await requireSession(request, ['owner']); const body=await readJson(request,5000); await confirmTerms(session,body); return send(200,{ok:true,terms_confirmed:true});
      }
      if (path === '/api/v1/admin/listings/payment-report' && method === 'POST') {
        const session = await requireSession(request, ['owner','finance']); const body=await readJson(request,5000); await reportPaymentAdmin(session,body); return send(200,{ok:true,payment_status:'reported'});
      }
      if (path === '/api/v1/admin/listings/bank-reconciliation' && method === 'POST') {
        const session = await requireSession(request, ['owner','finance']); const body=await readJson(request,5000); await verifyBank(session,body); return send(200,{ok:true});
      }
      if (path === '/api/v1/admin/listings/payment-offer' && method === 'POST') {
        const session = await requireSession(request, ['owner']); const body=await readJson(request,8000); const token=await configureOffer(session,body); return send(200,{token});
      }
      if (path === '/api/v1/admin/submissions/review' && method === 'POST') {
        const session = await requireSession(request, ['owner','editor']); const body=await readJson(request,8000); const listing_id=await reviewSubmission(session,body); return send(200,{ok:true,listing_id});
      }
      if (path === '/api/v1/admin/listings/delete' && method === 'POST') {
        const session = await requireSession(request, ['owner']); const body=await readJson(request,2000); await deleteDraft(session,body.listing_id); return send(200,{ok:true});
      }
      return send(404, { error: 'Not found.' });
    } catch (error) {
      const status = Number.isInteger(error?.status) ? error.status : 500;
      const message = status < 500 ? error.message : 'The request could not be completed.';
      return send(status, { error: message });
    }
  }
  return { handles: path => path.startsWith('/api/v1/admin/'), route };
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return { salt, hash };
}

export { SESSION_COOKIE, SESSION_SECONDS, validateListing, sha256 };
