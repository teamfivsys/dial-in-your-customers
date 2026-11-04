import json,subprocess,pathlib
keys=json.loads(pathlib.Path('.local-stack/keys.json').read_text());cmd=['sudo','docker','run','-d','--name','kdial-edge','--network','kdial-local','-p','127.0.0.1:54325:9000','-v',str(pathlib.Path.cwd())+':/work:ro']
for k,v in {'SUPABASE_URL':'http://kdial-gateway:8000','SUPABASE_SERVICE_ROLE_KEY':keys['service_role'],'KDial_ALLOWED_ORIGINS':'http://127.0.0.1:4173','TURNSTILE_SECRET_KEY':'local-fixture-only','SUBMISSION_RATE_SECRET':keys['secret']}.items():cmd+=['-e',k+'='+v]
subprocess.run(cmd+['supabase/edge-runtime:v1.67.4','start','--main-service','/work/.local-stack/main'],check=True,stdout=subprocess.DEVNULL)
