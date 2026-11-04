import json, urllib.request, urllib.error, secrets, pathlib, subprocess, datetime
K=json.loads(pathlib.Path('.local-stack/keys.json').read_text()); base='http://127.0.0.1:54324'; count=0

def request(path,body=None,token=None,origin=None,method='POST'):
 headers={'Content-Type':'application/json','apikey':K['anon']}
 if token:headers['Authorization']='Bearer '+token
 if origin:headers['Origin']=origin
 req=urllib.request.Request(base+path,data=None if body is None else json.dumps(body).encode(),headers=headers,method=method)
 try:
  with urllib.request.urlopen(req,timeout=25) as r: status=r.status; raw=r.read().decode()
 except urllib.error.HTTPError as e:status=e.code;raw=e.read().decode()
 try: data=json.loads(raw) if raw else None
 except: data=raw
 return status,data

def ok(label,condition,detail=None):
 global count
 if not condition: raise AssertionError(label+': '+str(detail))
 count+=1; print('PASS',label,flush=True)
def rpc(name,args,token):return request('/rest/v1/rpc/'+name,args,token)
def sql(text):subprocess.run(['sudo','docker','exec','-i','kdial-db','psql','-U','postgres','-v','ON_ERROR_STOP=1','-c',text],check=True,stdout=subprocess.DEVNULL)
suffix=secrets.token_hex(3); password=secrets.token_urlsafe(25); tokens={}; ids={}
s,d=request('/auth/v1/signup',{'email':'signup-'+suffix+'@example.invalid','password':password},K['anon']);ok('public signup disabled',s==422,(s,d))
for role in ['owner','editor','publisher','finance','member']:
 email=role+'-'+suffix+'@example.invalid'
 s,d=request('/auth/v1/admin/users',{'email':email,'password':password,'email_confirm':True},K['service_role']);ok('real Auth test account created '+role,s==200,(s,d));ids[role]=d['id']
 s,d=request('/auth/v1/token?grant_type=password',{'email':email,'password':password},K['anon']);ok('real Auth password login '+role,s==200 and 'access_token' in d,(s,d));tokens[role]=d['access_token']
 if role!='member':sql("insert into kdial_private.admin_roles values ('%s','%s',now());"%(ids[role],role))
 s,d=request('/auth/v1/user',None,tokens[role],method='GET');ok('real JWT validated by Auth '+role,s==200 and d['id']==ids[role],(s,d))
s,d=rpc('kdial_admin_state',{},K['anon']);ok('anonymous admin denied',s==401,(s,d))
s,d=rpc('kdial_admin_state',{},tokens['member']);ok('signed-in non-admin denied',s==403,(s,d))
for role in ['owner','editor','publisher','finance']:
 s,d=rpc('kdial_admin_state',{},tokens[role]);ok('real JWT/PostgREST role '+role,s==200 and d['role']==role,(s,d))
s,d=request('/rest/v1/listings',None,tokens['owner'],method='GET');ok('private tables not exposed even to owner client',s==404,(s,d))
body={'name':'Isolated Integration Cafe','category_slug':'cafes','locality_slug':'fort-kochi','address':'Fictional isolated test address','phone':'+919999999999','description':'Fictional local test business for actual API integration only.','applicant_email':'applicant-'+suffix+'@example.invalid','consent':True,'whatsapp_consent':False,'captcha_token':'local-test-pass'}
s,d=request('/functions/v1/submit-business',body,origin='https://unapproved.example.invalid');ok('Edge origin denied',s==403,(s,d))
s,d=request('/functions/v1/submit-business',{**body,'captcha_token':'local-test-fail'},origin='http://127.0.0.1:4173');ok('Edge CAPTCHA rejection path',s==403,(s,d))
s,d=request('/functions/v1/submit-business',body,origin='http://127.0.0.1:4173');ok('actual Edge runtime saves submission through PostgREST',s==201 and d.get('status')=='pending',(s,d));submission=d['id']
s,d=rpc('kdial_public_listings',{},K['anon']);ok('pending submission invisible publicly',s==200 and d==[],(s,d))
s,d=rpc('kdial_admin_state',{},tokens['editor']);ok('persisted submission visible in authenticated review inbox',s==200 and any(x['id']==submission for x in d['submissions']),(s,d))
s,d=rpc('kdial_admin_review_submission',{'submission_id':submission,'accept':True,'reason':'Fictional local consent review','slug':'integration-cafe'},tokens['editor']);ok('submission becomes persisted private draft',s==200 and isinstance(d,str),(s,d));listing=d
s,d=rpc('kdial_admin_publication',{'listing_id':listing,'action':'published'},tokens['editor']);ok('editor cannot publish',s==403,(s,d))
s,d=rpc('kdial_admin_publication',{'listing_id':listing,'action':'published'},tokens['owner']);ok('draft publication gate rejects',s==400,(s,d))
s,d=rpc('kdial_admin_review_content',{'listing_id':listing,'approve':True,'reference_or_reason':'Fictional test consent evidence'},tokens['publisher']);ok('publisher content review persists',s==204,(s,d))
today=datetime.datetime.now(datetime.timezone.utc).date();end=today+datetime.timedelta(days=10)
s,d=rpc('kdial_admin_confirm_terms',{'listing_id':listing,'package_version':'fictional-test-only','amount_minor':50100,'start_date':str(today),'end_date':str(end)},tokens['owner']);ok('explicit test terms persist',s==204,(s,d))
s,d=rpc('kdial_admin_report_payment',{'listing_id':listing,'event_key':'test-'+suffix,'source':'youpi','amount_minor':50100,'evidence_reference':'fictional test notification'},tokens['finance']);ok('YouPI recorded as report',s==204,(s,d))
s,d=rpc('kdial_admin_publication',{'listing_id':listing,'action':'published'},tokens['publisher']);ok('YouPI cannot unlock publication',s==400,(s,d))
s,d=rpc('kdial_admin_verify_bank',{'listing_id':listing,'amount_minor':50100,'reconciliation_reference':'fictional test only','verified':True},tokens['publisher']);ok('publisher cannot confirm bank',s==403,(s,d))
s,d=rpc('kdial_admin_verify_bank',{'listing_id':listing,'amount_minor':50000,'reconciliation_reference':'fictional wrong amount','verified':True},tokens['finance']);ok('wrong bank amount rejected',s==400,(s,d))
s,d=rpc('kdial_admin_verify_bank',{'listing_id':listing,'amount_minor':50100,'reconciliation_reference':'fictional local credit test - not actual money','verified':True},tokens['finance']);ok('finance reconciliation persists',s==204,(s,d))
s,d=rpc('kdial_admin_publication',{'listing_id':listing,'action':'published'},tokens['publisher']);ok('authorized publication through real JWT and API',s==204,(s,d))
s,d=rpc('kdial_public_listings',{},K['anon']);ok('public discovers persisted approved listing only',s==200 and len(d)==1 and d[0]['slug']=='integration-cafe',(s,d))
pathlib.Path('.local-stack/lifecycle.json').write_text(json.dumps({'tokens':tokens,'ids':ids,'listing':listing,'suffix':suffix,'browser_email':'owner-'+suffix+'@example.invalid','browser_password':password}))
s,d=rpc('kdial_admin_publication',{'listing_id':listing,'action':'suspended','reason':'test suspension'},tokens['publisher']);ok('authorized suspension persists',s==204,(s,d))
s,d=rpc('kdial_public_listings',{},K['anon']);ok('suspension removes public discovery',s==200 and d==[],(s,d))
s,d=rpc('kdial_admin_publication',{'listing_id':listing,'action':'published'},tokens['publisher']);ok('republish after checks',s==204,(s,d))
s,d=rpc('kdial_admin_state',{},tokens['owner']);ok('actor-linked audit history persists',s==200 and any(x.get('actor_id')==ids['publisher'] and x.get('action')=='publication_published' for x in d['audit']),(s,d))
print('TOTAL',count,'connected local Auth/PostgREST/Edge assertions; CAPTCHA upstream is a fixture; no external project or real money.',flush=True)
