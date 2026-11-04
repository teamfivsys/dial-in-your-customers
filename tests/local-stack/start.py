import secrets,subprocess,json,base64,hmac,hashlib,time,pathlib
p=pathlib.Path('.local-stack'); secret=secrets.token_hex(32)
def jwt(role):
 enc=lambda x:base64.urlsafe_b64encode(json.dumps(x,separators=(',',':')).encode()).decode().rstrip('=')
 data=enc({'alg':'HS256','typ':'JWT'})+'.'+enc({'role':role,'iss':'supabase-demo','exp':int(time.time())+86400})
 return data+'.'+base64.urlsafe_b64encode(hmac.new(secret.encode(),data.encode(),hashlib.sha256).digest()).decode().rstrip('=')
p.joinpath('keys.json').write_text(json.dumps({'secret':secret,'anon':jwt('anon'),'service_role':jwt('service_role')})); p.joinpath('keys.json').chmod(0o600)
def run(args): return subprocess.run(['sudo','docker']+args,check=True,stdout=subprocess.DEVNULL)
run(['network','create','kdial-local'])
run(['run','-d','--name','kdial-db','--network','kdial-local','-p','127.0.0.1:54322:5432','-e','POSTGRES_PASSWORD=local-only-kdial-password','postgres:15-alpine'])
