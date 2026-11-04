import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const child=spawn('pnpm',['dlx','deno@2.5.6','run','--allow-env','--allow-net','--no-prompt','supabase/functions/submit-business/index.ts'],{detached:true,stdio:['ignore','pipe','pipe'],env:{...process.env,KDial_ALLOWED_ORIGINS:'https://staging.example.invalid',TURNSTILE_SECRET_KEY:'',SUBMISSION_RATE_SECRET:''}});
let logs='';child.stderr.on('data',d=>logs+=d);
try {
 let ready=false;for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:8000');ready=true;break;}catch{await new Promise(r=>setTimeout(r,200));}}assert.ok(ready,logs);
 const url='http://127.0.0.1:8000';const origin='https://staging.example.invalid';
 const check=async(label,expected,options)=>{const r=await fetch(url,options);assert.equal(r.status,expected,label);console.log('PASS:',label,r.status);};
 await check('unknown origin denied',403,{method:'POST',headers:{Origin:'https://bad.example.invalid'}});
 await check('allowed CORS preflight',204,{method:'OPTIONS',headers:{Origin:origin}});
 await check('GET is not a submission',405,{headers:{Origin:origin}});
 await check('invalid JSON rejected',400,{method:'POST',headers:{Origin:origin},body:'{'});
 await check('null input rejected',400,{method:'POST',headers:{Origin:origin},body:'null'});
 await check('oversized payload rejected',413,{method:'POST',headers:{Origin:origin},body:'x'.repeat(17000)});
 await check('valid submission fails closed without configured verification',503,{method:'POST',headers:{Origin:origin},body:JSON.stringify({name:'Fictional edge fixture',category_slug:'cafes',locality_slug:'kaloor',address:'Fictional edge address',phone:'+919876543210',description:'Fictional test payload only.',applicant_email:'test@example.invalid',consent:true})});
}finally{try{process.kill(-child.pid,'SIGTERM');}catch{}}
