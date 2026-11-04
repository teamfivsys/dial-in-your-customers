// LOCAL TEST HARNESS ONLY: runtime/REST/Auth are real; third-party CAPTCHA remains a controlled fixture.
const originalFetch=globalThis.fetch;
globalThis.fetch=async (input:RequestInfo|URL,init?:RequestInit)=>{
 if(String(input)==='https://challenges.cloudflare.com/turnstile/v0/siteverify'){
  const params=new URLSearchParams(String(init?.body));
  return Response.json({success:params.get('response')==='local-test-pass',hostname:'127.0.0.1',action:'submit_business'});
 }
 return originalFetch(input,init);
};
await import('/work/supabase/functions/submit-business/index.ts');
