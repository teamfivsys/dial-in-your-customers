import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomUUID, createHash } from 'node:crypto';
import { getMysqlPool, closeMysqlPool } from '../server/mysql/pool.mjs';
import { bootstrapOwner } from '../server/mysql/bootstrap-owner.mjs';
import { createMysqlAdminApi, hashPassword } from '../server/mysql/admin-api.mjs';
import { createMysqlPublicActionApi } from '../server/mysql/public-actions.mjs';

const email = process.env.KDIAL_ADMIN_TEST_EMAIL || 'owner@example.test';
const password = process.env.KDIAL_ADMIN_TEST_PASSWORD || 'test-only-password-93!';

test('MySQL admin session and draft write integration', { skip: process.env.KDIAL_MYSQL_TEST_INTEGRATION !== 'true' }, async t => {
  const pool = getMysqlPool(process.env);
  const owner = await bootstrapOwner(email, password, pool);
  assert.equal(owner.role, 'owner');
  await assert.rejects(bootstrapOwner(email, password, pool), /already been created/);

  let deliveredResetUrl='';
  const server = createServer(async (request, response) => {
    const api = createMysqlAdminApi({ pool, sendResetEmail: async ({to,resetUrl}) => { assert.equal(to,email); deliveredResetUrl=resetUrl; }, env: { ...process.env, KDIAL_LOCAL_TEST: 'true', KDIAL_APP_ORIGIN: `http://127.0.0.1:${server.address().port}` } });
    await api.route(request, response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await closeMysqlPool();
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const origin = base;
  const call = (path, options={}) => fetch(`${base}${path}`, options);

  const crossSite = await call('/api/v1/admin/session', { method:'POST', headers:{Origin:'https://evil.example','Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
  assert.equal(crossSite.status, 403);

  const anonymous = await call('/api/v1/admin/session');
  assert.equal(anonymous.status, 200);
  assert.equal((await anonymous.json()).user, null);
  const deniedDashboard = await call('/api/v1/admin/dashboard');
  assert.equal(deniedDashboard.status, 401);

  const badLogin = await call('/api/v1/admin/session', { method:'POST', headers:{Origin:origin,'Content-Type':'application/json'}, body:JSON.stringify({email,password:'incorrect-password'}) });
  assert.equal(badLogin.status, 401);
  assert.equal((await badLogin.json()).error, 'Email or password is incorrect.');

  const login = await call('/api/v1/admin/session', { method:'POST', headers:{Origin:origin,'Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
  assert.equal(login.status, 200);
  const auth = await login.json();
  assert.equal(auth.user.role, 'owner');
  assert.match(auth.csrfToken, /^[A-Za-z0-9_-]{43}$/);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const dashboard = await call('/api/v1/admin/dashboard', { headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':auth.csrfToken} });
  assert.equal(dashboard.status, 200, await dashboard.clone().text());
  assert.equal((await dashboard.json()).role, 'owner');

  const record = { slug:`integration-${randomUUID().slice(0,8)}`, name:'Integration Test Cafe', category_slug:'cafes', locality_slug:'kaloor', address:'10 Test Street, Kochi', phone:'+919876543210', whatsapp:'', website:'', description:'A test-only listing for verifying the protected MySQL write path.', services:['Coffee'], hours:[], photos:[] };
  const noCsrf = await call('/api/v1/admin/listings', { method:'POST', headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'}, body:JSON.stringify({record}) });
  assert.equal(noCsrf.status, 403);

  const saved = await call('/api/v1/admin/listings', { method:'POST', headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':auth.csrfToken,'Content-Type':'application/json'}, body:JSON.stringify({record}) });
  assert.equal(saved.status, 200, await saved.clone().text());
  const savedBody = await saved.json();
  assert.equal(savedBody.status, 'draft');
  const [rows] = await pool.execute('SELECT name,content_status,publication_status,payment_status FROM listings WHERE id=?', [savedBody.id]);
  assert.deepEqual(rows[0], { name:record.name, content_status:'draft', publication_status:'unpublished', payment_status:'not_reported' });
  const [events] = await pool.execute("SELECT action FROM admin_audit_events WHERE entity_id=? ORDER BY id DESC LIMIT 1", [savedBody.id]);
  assert.equal(events[0]?.action, 'listing_saved');

  const editedRecord = { ...record, name:'Integration Test Cafe Updated' };
  const edited = await call('/api/v1/admin/listings', { method:'POST', headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':auth.csrfToken,'Content-Type':'application/json'}, body:JSON.stringify({record:editedRecord,listing_id:savedBody.id}) });
  assert.equal(edited.status, 200, await edited.clone().text());
  const [updatedRows] = await pool.execute('SELECT name,content_status,publication_status,payment_status FROM listings WHERE id=?', [savedBody.id]);
  assert.deepEqual(updatedRows[0], { name:editedRecord.name, content_status:'draft', publication_status:'unpublished', payment_status:'not_reported' });

  const badCsrf = await call('/api/v1/admin/listings', { method:'POST', headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':`${auth.csrfToken.slice(0,-1)}x`,'Content-Type':'application/json'}, body:JSON.stringify({record}) });
  assert.equal(badCsrf.status, 403);

  // Verify the full moderated listing/payment path against disposable MariaDB.
  const adminPost=async(path,body)=>call(path,{method:'POST',headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':auth.csrfToken,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const today=new Date(Date.now()+330*60*1000).toISOString().slice(0,10);
  const endDate=new Date(Date.now()+13*24*60*60*1000+330*60*1000).toISOString().slice(0,10);
  const approved=await adminPost('/api/v1/admin/listings/review',{listing_id:savedBody.id,approve:true,reference_or_reason:'Owner verified the business supplied publication consent.'});
  assert.equal(approved.status,200,await approved.clone().text());
  const terms=await adminPost('/api/v1/admin/listings/terms',{listing_id:savedBody.id,package_version:'Integration package',amount_minor:50100,start_date:today,end_date:endDate});
  assert.equal(terms.status,200,await terms.clone().text());
  const offerPrepared=await adminPost('/api/v1/admin/listings/payment-offer',{listing_id:savedBody.id,package_inclusions:'Verified test-only package inclusion details.',cancellation_refund_terms:'Test-only conditional refund wording.'});
  assert.equal(offerPrepared.status,200,await offerPrepared.clone().text());
  const token=(await offerPrepared.json()).token;assert.match(token,/^[0-9a-f-]{36}$/i);

  const publicEnv={...process.env,KDIAL_APP_ORIGIN:'https://kdial.test',KDIAL_TURNSTILE_SECRET:'test-secret',KDIAL_SUBMISSION_RATE_SECRET:'x'.repeat(40),KDIAL_UPI_PAYEE:'KDial',KDIAL_UPI_ID:'kdial@example',KDIAL_UPI_QR_BASE64:'aGVsbG8='};
  const publicServer=createServer(async(req,res)=>{const api=createMysqlPublicActionApi({pool,env:publicEnv,fetcher:async(_url,init)=>{const values=new URLSearchParams(init.body);return new Response(JSON.stringify({success:true,hostname:'kdial.test',action:values.get('response')==='submission-token'?'submit_business':'report_upi_payment'}),{status:200,headers:{'Content-Type':'application/json'}});}});await api.route(req,res);});
  await new Promise(resolve=>publicServer.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{publicServer.closeAllConnections();await new Promise(resolve=>publicServer.close(resolve));});
  const publicCall=(path,options={})=>fetch(`http://127.0.0.1:${publicServer.address().port}${path}`,options);
  const offerView=await publicCall(`/api/v1/payment-offers?token=${token}`);assert.equal(offerView.status,200,await offerView.clone().text());
  assert.equal((await offerView.json()).payment_status,'report_only');
  const reportBody={offer_token:token,evidence_reference:`upi-${randomUUID()}`,captcha_token:'report-token'};
  const paymentReport=await publicCall('/api/v1/payment-reports',{method:'POST',headers:{Origin:'https://kdial.test','Content-Type':'application/json'},body:JSON.stringify(reportBody)});
  assert.equal(paymentReport.status,200,await paymentReport.clone().text());assert.equal((await paymentReport.json()).status,'reported');
  const dupReport=await publicCall('/api/v1/payment-reports',{method:'POST',headers:{Origin:'https://kdial.test','Content-Type':'application/json'},body:JSON.stringify(reportBody)});assert.equal(dupReport.status,200);
  const [reportedRows]=await pool.execute('SELECT payment_status FROM listings WHERE id=?',[savedBody.id]);assert.equal(reportedRows[0].payment_status,'reported');

  const badBank=await adminPost('/api/v1/admin/listings/bank-reconciliation',{listing_id:savedBody.id,verified:true,amount_minor:50000,reconciliation_reference:'test-mismatched-credit'});assert.equal(badBank.status,409);
  const goodBank=await adminPost('/api/v1/admin/listings/bank-reconciliation',{listing_id:savedBody.id,verified:true,amount_minor:50100,reconciliation_reference:'test-confirmed-bank-credit'});assert.equal(goodBank.status,200,await goodBank.clone().text());
  const publish=await adminPost('/api/v1/admin/listings/publication',{listing_id:savedBody.id,action:'published',reason:''});assert.equal(publish.status,200,await publish.clone().text());
  const [published]=await pool.execute('SELECT publication_status FROM listings WHERE id=?',[savedBody.id]);assert.equal(published[0].publication_status,'published');
  const editAfterPublish=await call('/api/v1/admin/listings',{method:'POST',headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':auth.csrfToken,'Content-Type':'application/json'},body:JSON.stringify({record:editedRecord,listing_id:savedBody.id})});assert.equal(editAfterPublish.status,200,await editAfterPublish.clone().text());
  const [resetRows]=await pool.execute('SELECT content_status,publication_status,terms_confirmed,payment_status,bank_verified_amount_minor,package_inclusions FROM listings WHERE id=?',[savedBody.id]);assert.deepEqual(resetRows[0],{content_status:'draft',publication_status:'unpublished',terms_confirmed:0,payment_status:'not_reported',bank_verified_amount_minor:null,package_inclusions:null});
  const [offersLeft]=await pool.execute('SELECT listing_id FROM payment_offers WHERE listing_id=?',[savedBody.id]);assert.equal(offersLeft.length,0);

  // Public intake requires successful Turnstile verification, is pending-only, and can only be accepted as a private draft.
  const submission={name:'Submitted Test Salon',category_slug:'salons',locality_slug:'kaloor',address:'9 Example Road, Kochi',phone:'+919876543210',whatsapp:'',description:'A fictional integration submission for safe private moderation tests.',applicant_email:'submitter@example.test',consent:true,whatsapp_consent:false,captcha_token:'submission-token'};
  const received=await publicCall('/api/v1/submissions',{method:'POST',headers:{Origin:'https://kdial.test','Content-Type':'application/json'},body:JSON.stringify(submission)});assert.equal(received.status,201,await received.clone().text());const receivedBody=await received.json();assert.equal(receivedBody.status,'pending');
  const dashboardBody=await (await call('/api/v1/admin/dashboard',{headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':auth.csrfToken}})).json();const pending=dashboardBody.submissions.find(x=>x.id===receivedBody.id);assert.equal(pending.status,'pending');assert.equal(pending.payload.whatsapp,null);
  const submissionReview=await adminPost('/api/v1/admin/submissions/review',{submission_id:receivedBody.id,accept:true,reason:'Owner reviewed fictional test intake.',slug:`submitted-${randomUUID().slice(0,8)}`});assert.equal(submissionReview.status,200,await submissionReview.clone().text());const privateDraft=(await submissionReview.json()).listing_id;
  const [privateRows]=await pool.execute('SELECT content_status,publication_status,payment_status FROM listings WHERE id=?',[privateDraft]);assert.deepEqual(privateRows[0],{content_status:'draft',publication_status:'unpublished',payment_status:'not_reported'});

  const analytics=await publicCall('/api/v1/analytics',{method:'POST',headers:{Origin:'https://kdial.test','Content-Type':'application/json'},body:JSON.stringify({variant:'A',event:'impression',session_id:randomUUID(),path:'/directory'})});assert.equal(analytics.status,204);
  const [analyticsRows]=await pool.execute('SELECT COUNT(*) AS count FROM ab_events WHERE path=?',['/directory']);assert.ok(Number(analyticsRows[0].count)>=1);

  const roleHash=await hashPassword('test-publisher-password-93!');const publisherId=randomUUID();await pool.execute('INSERT INTO admin_users(id,email,email_normalized,password_salt,password_hash,role) VALUES(?,?,?,?,?,?)',[publisherId,'publisher@example.test','publisher@example.test',roleHash.salt,roleHash.hash,'publisher']);
  const publisherLogin=await call('/api/v1/admin/session',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:'publisher@example.test',password:'test-publisher-password-93!'})});assert.equal(publisherLogin.status,200);const publisherAuth=await publisherLogin.json();const publisherCookie=publisherLogin.headers.get('set-cookie').split(';')[0];
  const publisherDashboard=await call('/api/v1/admin/dashboard',{headers:{Origin:origin,Cookie:publisherCookie,'X-KDial-CSRF':publisherAuth.csrfToken}});assert.equal(publisherDashboard.status,200);assert.deepEqual((await publisherDashboard.json()).submissions,[]);
  const publisherTerms=await call('/api/v1/admin/listings/terms',{method:'POST',headers:{Origin:origin,Cookie:publisherCookie,'X-KDial-CSRF':publisherAuth.csrfToken,'Content-Type':'application/json'},body:JSON.stringify({listing_id:privateDraft,package_version:'no',amount_minor:50100,start_date:today,end_date:endDate})});assert.equal(publisherTerms.status,403);
  const publisherReview=await call('/api/v1/admin/listings/review',{method:'POST',headers:{Origin:origin,Cookie:publisherCookie,'X-KDial-CSRF':publisherAuth.csrfToken,'Content-Type':'application/json'},body:JSON.stringify({listing_id:privateDraft,approve:true,reference_or_reason:'test'})});assert.equal(publisherReview.status,200);
  const publisherBank=await call('/api/v1/admin/listings/bank-reconciliation',{method:'POST',headers:{Origin:origin,Cookie:publisherCookie,'X-KDial-CSRF':publisherAuth.csrfToken,'Content-Type':'application/json'},body:JSON.stringify({listing_id:privateDraft,verified:true,amount_minor:50100,reconciliation_reference:'test-ref'})});assert.equal(publisherBank.status,403);

  const taxonomy=await adminPost('/api/v1/admin/taxonomy',{kind:'category',slug:'integration-category',label:'Integration Category'});assert.equal(taxonomy.status,200);
  const taxonomyDelete=await call('/api/v1/admin/taxonomy',{method:'DELETE',headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':auth.csrfToken,'Content-Type':'application/json'},body:JSON.stringify({kind:'category',slug:'integration-category'})});assert.equal(taxonomyDelete.status,200);

  const recovery=await call('/api/v1/admin/password-reset',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email})});assert.equal(recovery.status,200,await recovery.clone().text());assert.match(deliveredResetUrl,/^http:\/\/127\.0\.0\.1:/);const resetToken=new URL(deliveredResetUrl).searchParams.get('reset');assert.match(resetToken,/^[A-Za-z0-9_-]{40,60}$/);
  const [storedResetRows]=await pool.execute('SELECT token_hash,expires_at FROM admin_password_reset_tokens WHERE admin_id=?',[owner.id]);const storedReset=storedResetRows[0];assert.equal(storedReset.token_hash,createHash('sha256').update(resetToken).digest('hex'));assert.notEqual(storedReset.token_hash,resetToken);
  const resetDone=await call('/api/v1/admin/password-reset/confirm',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({token:resetToken,password:'recovered-password-93!'})});assert.equal(resetDone.status,200,await resetDone.clone().text());
  const oldReset=await call('/api/v1/admin/password-reset/confirm',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({token:resetToken,password:'another-password-93!'})});assert.equal(oldReset.status,400);
  const oldSession=await call('/api/v1/admin/dashboard',{headers:{Origin:origin,Cookie:cookie,'X-KDial-CSRF':auth.csrfToken}});assert.equal(oldSession.status,401);
  const recoveredLogin=await call('/api/v1/admin/session',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email,password:'recovered-password-93!'})});assert.equal(recoveredLogin.status,200);const recoveredAuth=await recoveredLogin.json();const recoveredCookie=recoveredLogin.headers.get('set-cookie').split(';')[0];
  const passwordChanged=await call('/api/v1/admin/password',{method:'POST',headers:{Origin:origin,Cookie:recoveredCookie,'X-KDial-CSRF':recoveredAuth.csrfToken,'Content-Type':'application/json'},body:JSON.stringify({current_password:'recovered-password-93!',new_password:'changed-password-93!'})});assert.equal(passwordChanged.status,200,await passwordChanged.clone().text());assert.match(passwordChanged.headers.get('set-cookie'),/Max-Age=0/);
  const signedOut=await call('/api/v1/admin/dashboard',{headers:{Origin:origin,Cookie:recoveredCookie,'X-KDial-CSRF':recoveredAuth.csrfToken}});assert.equal(signedOut.status,401);
  const changedLogin=await call('/api/v1/admin/session',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email,password:'changed-password-93!'})});assert.equal(changedLogin.status,200);

  const changedAuth=await changedLogin.json();const changedCookie=changedLogin.headers.get('set-cookie').split(';')[0];
  const logout = await call('/api/v1/admin/session', { method:'DELETE', headers:{Origin:origin,Cookie:changedCookie,'X-KDial-CSRF':changedAuth.csrfToken} });
  assert.equal(logout.status, 200);
  const afterLogout = await call('/api/v1/admin/listings', { method:'POST', headers:{Origin:origin,Cookie:changedCookie,'X-KDial-CSRF':changedAuth.csrfToken,'Content-Type':'application/json'}, body:JSON.stringify({record}) });
  assert.equal(afterLogout.status, 401);
});
