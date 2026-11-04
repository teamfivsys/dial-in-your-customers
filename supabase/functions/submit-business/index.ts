import { createClient } from "npm:@supabase/supabase-js@2.110.0";
import { validateSubmission } from "../_shared/validateSubmission.ts";
// Deploy with verify_jwt=false only after origin/CAPTCHA/production checks pass.
// No unauthenticated client can call the service-only database RPC directly.
Deno.serve(async (request:Request) => {
 const allowedOrigins=(Deno.env.get("KDial_ALLOWED_ORIGINS")??"").split(",").map(x=>x.trim()).filter(Boolean);
 const origin=request.headers.get("Origin")??"";
 const headers={"Content-Type":"application/json","Access-Control-Allow-Origin":allowedOrigins.includes(origin)?origin:"null","Vary":"Origin","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
 const reply=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers});
 if(!allowedOrigins.includes(origin))return reply(403,{error:"Origin not allowed."});
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(request.method!=="POST")return reply(405,{error:"POST required."});
 try {
  const text=await request.text();
  if(new TextEncoder().encode(text).byteLength>16000)return reply(413,{error:"Submission is too large."});
  let body:Record<string,unknown>;try{body=JSON.parse(text);}catch{return reply(400,{error:"Invalid JSON."});}
  const checked=validateSubmission(body);
  if(!checked.data)return reply(400,{error:checked.errors.join(" ")});
  const secret=Deno.env.get("TURNSTILE_SECRET_KEY");
  const rateSecret=Deno.env.get("SUBMISSION_RATE_SECRET");
  if(!secret||!rateSecret)return reply(503,{error:"Submission verification is not configured."});
  if(typeof body.captcha_token!=="string"||body.captcha_token.length>2048)return reply(400,{error:"Complete the security check."});
  const challenge=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:new URLSearchParams({secret,response:body.captcha_token})});
  if(!challenge.ok)return reply(503,{error:"Security verification is temporarily unavailable."});
  const result=await challenge.json();
  if(result.success!==true||result.hostname!==new URL(origin).hostname||result.action!=="submit_business")return reply(403,{error:"Security verification failed. Please try again."});
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(rateSecret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const signature=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(checked.data.applicant_email));
  const rateKey=Array.from(new Uint8Array(signature),n=>n.toString(16).padStart(2,"0")).join("");
  const client=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
  const {applicant_email,...payload}=checked.data;
  const {data,error}=await client.rpc("kdial_receive_submission",{payload,applicant_email,rate_key:rateKey});
  if(error)return reply(400,{error:"We couldn’t accept the submission. Check its details or try again later."});
  return reply(201,{id:data,status:"pending",message:"Received for review. This is not a published listing or payment confirmation."});
 }catch{return reply(500,{error:"Submission could not be saved. Please try again."});}
});
