import subprocess,json,pathlib
keys=json.loads(pathlib.Path('.local-stack/keys.json').read_text())
def run(name,image,port,env,args=[]):
 cmd=['sudo','docker','run','-d','--name',name,'--network','kdial-local','-p',port]
 for k,v in env.items():cmd+=['-e',k+'='+v]
 subprocess.run(cmd+[image]+args,check=True,stdout=subprocess.DEVNULL)
run('kdial-rest','postgrest/postgrest:v12.2.12','127.0.0.1:54323:3000',{'PGRST_DB_URI':'postgres://authenticator:local-only-api-password@kdial-db:5432/postgres','PGRST_DB_SCHEMAS':'public','PGRST_DB_ANON_ROLE':'anon','PGRST_JWT_SECRET':keys['secret'],'PGRST_DB_EXTRA_SEARCH_PATH':'public,extensions'})
