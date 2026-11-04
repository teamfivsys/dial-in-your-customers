import subprocess,json,pathlib
keys=json.loads(pathlib.Path('.local-stack/keys.json').read_text())
def run(name,image,port,env,args=[]):
 cmd=['sudo','docker','run','-d','--name',name,'--network','kdial-local','-p',port]
 for k,v in env.items():cmd+=['-e',k+'='+v]
 subprocess.run(cmd+[image]+args,check=True,stdout=subprocess.DEVNULL)
run('kdial-auth','supabase/gotrue:v2.177.0','127.0.0.1:54321:9999',{'GOTRUE_API_HOST':'0.0.0.0','GOTRUE_API_PORT':'9999','API_EXTERNAL_URL':'http://127.0.0.1:54321','GOTRUE_SITE_URL':'http://127.0.0.1:4173','GOTRUE_DB_DRIVER':'postgres','GOTRUE_DB_DATABASE_URL':'postgres://supabase_auth_admin:local-only-auth-password@kdial-db:5432/postgres?sslmode=disable','GOTRUE_JWT_SECRET':keys['secret'],'GOTRUE_JWT_EXP':'3600','GOTRUE_JWT_AUD':'authenticated','GOTRUE_JWT_DEFAULT_GROUP_NAME':'authenticated','GOTRUE_JWT_ADMIN_ROLES':'service_role','GOTRUE_DISABLE_SIGNUP':'true','GOTRUE_MAILER_AUTOCONFIRM':'true'})
