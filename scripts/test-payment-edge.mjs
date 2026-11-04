import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const child=spawn('pnpm',['dlx','deno@2.5.6','run','--allow-env','--allow-net','--no-prompt','supabase/functions/report-upi-payment/index.ts'],{detached:true,stdio:['ignore','pipe','pipe'],env:{...process.env,KDial_ALLOWED_ORIGINS:'https://staging.example.invalid',TURNSTILE_SECRET_KEY:'',SUPABASE_SERVICE_ROLE_KEY:'',SUPABASE_URL:''}});
let logs='';child.stderr.on('data',d=>logs+=d);
try {
 let ready=false;for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:8000');ready=true;break;}catch{await new Promise(r=>setTimeout(r,200));}}assert.ok(ready,logs);
 const url='http://127.0.0.1:8000';const origin='https://staging.example.invalid';
 const check=async(label,expected,options)=>{const r=await fetch(url,options);assert.equal(r.status,expected,label);console.log('PASS:',label,r.status);};
 const json={headers:{Origin:origin,'Content-Type':'application/json'}};
 await check('unknown origin denied',403,{method:'POST',headers:{Origin:'https://bad.example.invalid'},body:'{}'});
 await check('allowed CORS preflight',204,{method:'OPTIONS',headers:{Origin:origin}});
 await check('GET is not a payment report',405,{headers:{Origin:origin}});
 await check('invalid JSON rejected',400,{method:'POST',headers:json.headers,body:'{'});
 await check('invalid offer token rejected',400,{method:'POST',headers:json.headers,body:JSON.stringify({offer_token:'not-a-token',evidence_reference:'ABC123',captcha_token:'fixture'})});
 await check('invalid payment reference rejected',400,{method:'POST',headers:json.headers,body:JSON.stringify({offer_token:'123e4567-e89b-42d3-a456-426614174000',evidence_reference:'x',captcha_token:'fixture'})});
 await check('reporting fails closed without security and database configuration',503,{method:'POST',headers:json.headers,body:JSON.stringify({offer_token:'123e4567-e89b-42d3-a456-426614174000',evidence_reference:'TEST123',captcha_token:'fixture'})});
}finally{try{process.kill(-child.pid,'SIGTERM');}catch{}}
