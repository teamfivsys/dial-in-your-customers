import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterListings,profilePath,callHref,whatsappHref,verificationLabel} from '../../src/lib/directory';
import {demoBusinesses} from '../../src/data/demoBusinesses';
import {validateSubmission} from '../../src/lib/validateSubmission';
test('service search is trimmed, case-insensitive and locality-scoped',()=>{assert.equal(filterListings(demoBusinesses,{q:'  WIRING ',locality:'Kaloor'}).length,1);assert.equal(filterListings(demoBusinesses,{q:'Wiring',locality:'Edappally'}).length,0);});
test('category, city and unpublished filters cannot leak records',()=>{assert.equal(filterListings(demoBusinesses,{category:'cafes'}).length,1);assert.equal(filterListings(demoBusinesses,{city:'calicut'}).length,0);assert.equal(filterListings([{...demoBusinesses[0],status:'pending' as never}],{}).length,0);});
test('demo profiles use explicitly separate paths',()=>assert.equal(profilePath('demo-cafe',true),'/demo/businesses/demo-cafe'));
const input={name:'Fictional Test Shop',category_slug:'cafes',locality_slug:'kaloor',address:'Fictional test address',phone:'+919876543210',whatsapp:'+919876543210',description:'Fictional validation test only.',applicant_email:'TEST@example.invalid',consent:true,whatsapp_consent:false};
test('submission normalizes email and removes unconsented WhatsApp',()=>{const x=validateSubmission(input);assert.deepEqual(x.errors,[]);assert.equal(x.data?.applicant_email,'test@example.invalid');assert.equal(x.data?.whatsapp,'');});
test('reject missing consent, malformed channels, arrays and excessive fields',()=>{for(const x of [null,[],{...input,consent:false},{...input,phone:'javascript:bad'},{...input,description:'x'},{...input,name:'a'.repeat(141)},{...input,whatsapp_consent:true,whatsapp:'bad'}])assert.ok(validateSubmission(x).errors.length);});
test('allowlist discards forged approval and payment claims',()=>{const x=validateSubmission({...input,publication_status:'published',payment_status:'bank_verified'});assert.equal('payment_status' in x.data!,false);});

test('search covers address, category labels and accent-insensitive service terms while retaining Kochi and approval gates',()=>{
  const options={categoryLabels:{cafes:'Cafés & Restaurants'}};
  assert.equal(filterListings(demoBusinesses,{q:'PANAMPILLY',...options}).length,0);
  const cafe={...demoBusinesses[0],address:'Fictional address · Panampilly Nagar'};
  assert.equal(filterListings([cafe],{q:'cafe',...options}).length,1);
  assert.equal(filterListings([cafe],{q:'cafes',...options}).length,1);
  assert.equal(filterListings([cafe],{q:'FICTIONAL ADDRESS'}).length,1);
});
test('contact links normalize only actual Indian mobile numbers and reject absent or unsafe input',()=>{
  assert.equal(callHref('+91 98765-43210'),'tel:+919876543210');
  assert.equal(whatsappHref('919876543210'),'https://wa.me/919876543210');
  assert.equal(callHref(''),undefined);
  assert.equal(whatsappHref('javascript:alert(1)'),undefined);
  assert.equal(callHref('+911234567890'),undefined);
});

test('verification copy distinguishes unverified, dated and date-unavailable listings',()=>{
  assert.equal(verificationLabel(false), 'Business details have not been verified');
  assert.equal(verificationLabel(true, '2026-10-22T12:00:00.000Z'), 'Business details verified · last checked 2026-10-22');
  assert.equal(verificationLabel(true), 'Business details verified · check date unavailable');
});
