-- KDial directory foundation. Apply only in a separately authorized staging project.
-- All privileged state stays outside the exposed public schema.
begin;
create schema if not exists kdial_private;
revoke all on schema kdial_private from public, anon, authenticated;

create table kdial_private.admin_roles (
 user_id uuid primary key references auth.users(id), role text not null check(role in ('editor','publisher','finance','owner')),
 created_at timestamptz not null default now()
);
create table kdial_private.categories (slug text primary key check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), label text not null check(length(label) between 1 and 100));
create table kdial_private.localities (slug text primary key check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), label text not null check(length(label) between 1 and 100));
insert into kdial_private.categories values ('cafes','Cafés'),('restaurants','Restaurants'),('electrician','Electricians'),('dentists','Dentists'),('clinics','Clinics'),('car-repair','Car repair'),('plumbers','Plumbers'),('salons','Salons'),('hardware','Hardware'),('home-cleaning','Home cleaning'),('fitness','Fitness'),('education','Education'),('photographers','Photographers'),('web-design','Web design');
insert into kdial_private.localities values ('fort-kochi','Fort Kochi'),('kaloor','Kaloor'),('edappally','Edappally'),('vyttila','Vyttila'),('palarivattom','Palarivattom'),('elamakkara','Elamakkara'),('panampilly-nagar','Panampilly Nagar'),('kakkanad','Kakkanad'),('ernakulam','Ernakulam'),('thevara','Thevara');
create table kdial_private.listings (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100),
 name text not null check(length(name) between 2 and 140),
 category_slug text not null references kdial_private.categories(slug),
 locality_slug text not null references kdial_private.localities(slug),
 address text not null check(length(address) between 5 and 500),
 phone text not null check(phone ~ '^\+91[6-9][0-9]{9}$'),
 whatsapp text check(whatsapp is null or whatsapp ~ '^\+91[6-9][0-9]{9}$'),
 website text check(website is null or (length(website) <= 500 and website ~ '^https://[^[:space:]]+$')),
 description text not null check(length(description) between 20 and 2000),
 services jsonb not null default '[]', hours jsonb not null default '[]', photos jsonb not null default '[]',
 content_status text not null default 'draft' check(content_status in ('draft','pending_review','approved','rejected')),
 publication_status text not null default 'unpublished' check(publication_status in ('unpublished','published','suspended','expired')),
 content_verified_by uuid references auth.users(id), content_verified_at timestamptz, consent_reference text,
 rejection_reason text,
 package_version text, agreed_amount_minor integer check(agreed_amount_minor > 0), currency text check(currency = 'INR'),
 terms_start date, terms_end date, terms_confirmed boolean not null default false,
 payment_status text not null default 'not_reported' check(payment_status in ('not_reported','reported','bank_verified','rejected')),
 bank_verified_by uuid references auth.users(id), bank_verified_at timestamptz, bank_reference text,
 bank_verified_amount_minor integer,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(terms_end is null or terms_start is null or terms_end > terms_start),
 check(jsonb_typeof(services) = 'array' and jsonb_array_length(services) <= 30),
 check(jsonb_typeof(hours) = 'array' and jsonb_array_length(hours) <= 14),
 check(jsonb_typeof(photos) = 'array' and jsonb_array_length(photos) <= 10)
);
create table kdial_private.payment_reports (
 id uuid primary key default gen_random_uuid(), listing_id uuid not null references kdial_private.listings(id),
 event_key text not null unique check(length(event_key) between 1 and 150),
 source text not null check(source in ('manual','youpi')), amount_minor integer not null check(amount_minor>0),
 evidence_reference text not null check(length(evidence_reference) between 1 and 500),
 reported_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create table kdial_private.audit_events (
 id bigint generated always as identity primary key, actor_id uuid, entity_id uuid, action text not null,
 details jsonb not null default '{}', created_at timestamptz not null default now()
);
create table kdial_private.submission_rate_windows (rate_key text primary key, started_at timestamptz not null, count integer not null);
alter table kdial_private.submission_rate_windows enable row level security;
create table kdial_private.submissions (
 id uuid primary key default gen_random_uuid(), payload jsonb not null, applicant_email text not null,
 consent_at timestamptz not null default now(), status text not null default 'pending' check(status in ('pending','accepted','rejected')),
 review_reason text, reviewed_by uuid references auth.users(id), reviewed_at timestamptz, listing_id uuid references kdial_private.listings(id),
 created_at timestamptz not null default now()
);
-- Defense in depth: the schema is not exposed and no browser role has table grants.
alter table kdial_private.admin_roles enable row level security;
alter table kdial_private.categories enable row level security;
alter table kdial_private.localities enable row level security;
alter table kdial_private.listings enable row level security;
alter table kdial_private.payment_reports enable row level security;
alter table kdial_private.audit_events enable row level security;
alter table kdial_private.submissions enable row level security;
revoke all on all tables in schema kdial_private from public, anon, authenticated;
revoke all on all sequences in schema kdial_private from public, anon, authenticated;

create function kdial_private.require_role(allowed text[]) returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or not exists(select 1 from kdial_private.admin_roles where user_id=auth.uid() and role=any(allowed)) then
  raise exception 'Admin authorization required' using errcode='42501';
 end if;
end $$;
create function kdial_private.audit(entity uuid, action_name text, data jsonb default '{}') returns void language sql security definer set search_path = '' as $$
 insert into kdial_private.audit_events(actor_id,entity_id,action,details) values(auth.uid(),entity,action_name,data);
$$;
create function kdial_private.publishable(b kdial_private.listings) returns boolean language sql stable set search_path = '' as $$
 select b.content_status='approved' and b.content_verified_by is not null and b.content_verified_at is not null
 and coalesce(length(b.consent_reference),0)>0 and b.terms_confirmed and coalesce(length(b.package_version),0)>0
 and b.agreed_amount_minor>0 and b.currency='INR' and b.terms_start<=(now() at time zone 'Asia/Kolkata')::date and b.terms_end>(now() at time zone 'Asia/Kolkata')::date
 and b.payment_status='bank_verified' and b.bank_verified_by is not null and b.bank_verified_at is not null
 and coalesce(length(b.bank_reference),0)>0 and b.bank_verified_amount_minor=b.agreed_amount_minor;
$$;
create function kdial_private.enforce_publication() returns trigger language plpgsql set search_path = '' as $$
begin
 if new.publication_status='published' and not coalesce(kdial_private.publishable(new),false) then
  raise exception 'Publication requires approved content, consent, confirmed current terms and manually verified bank credit' using errcode='23514';
 end if;
 new.updated_at=now(); return new;
end $$;
create trigger enforce_listing_publication before insert or update on kdial_private.listings for each row execute function kdial_private.enforce_publication();

create function public.kdial_public_taxonomy() returns jsonb language sql stable security definer set search_path = '' as $$
 select jsonb_build_object('categories',coalesce((select jsonb_agg(to_jsonb(c) order by c.label) from kdial_private.categories c),'[]'),
 'localities',coalesce((select jsonb_agg(to_jsonb(l) order by l.label) from kdial_private.localities l),'[]'));
$$;
create function public.kdial_public_listings() returns jsonb language sql stable security definer set search_path = '' as $$
 select coalesce(jsonb_agg(jsonb_build_object(
 'slug',b.slug,'name',b.name,'categorySlug',b.category_slug,'citySlug','kochi','locality',l.label,
 'address',b.address,'phone',b.phone,'whatsapp',b.whatsapp,'website',b.website,
 'description',b.description,'services',b.services,'hours',b.hours,'photos',b.photos,
 'verified',true,'status','approved','updatedAt',to_char(b.updated_at,'YYYY-MM-DD')
 ) order by b.name),'[]') from kdial_private.listings b join kdial_private.localities l on b.locality_slug=l.slug
 where b.publication_status='published' and kdial_private.publishable(b);
$$;
create function public.kdial_admin_state() returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
 perform kdial_private.require_role(array['editor','publisher','finance','owner']);
 return jsonb_build_object('role',(select role from kdial_private.admin_roles where user_id=auth.uid()),
 'listings',coalesce((select jsonb_agg((case when exists(select 1 from kdial_private.admin_roles where user_id=auth.uid() and role in ('finance','owner')) then to_jsonb(b) else to_jsonb(b)-'bank_reference'-'bank_verified_amount_minor' end) order by updated_at desc) from kdial_private.listings b),'[]'),
 'submissions',coalesce((select jsonb_agg(to_jsonb(s) order by created_at desc) from kdial_private.submissions s),'[]'),
 'reports',case when exists(select 1 from kdial_private.admin_roles where user_id=auth.uid() and role in ('finance','owner')) then coalesce((select jsonb_agg(to_jsonb(r) order by created_at desc) from kdial_private.payment_reports r),'[]') else '[]'::jsonb end,
 'audit',coalesce((select jsonb_agg((to_jsonb(a)-'details') order by id desc) from (select * from kdial_private.audit_events order by id desc limit 100) a),'[]'),
 'taxonomy',public.kdial_public_taxonomy());
end $$;
create function public.kdial_admin_save_taxonomy(kind text, slug text, label text) returns void language plpgsql security definer set search_path = '' as $$
begin
 perform kdial_private.require_role(array['editor','owner']);
 if kind='category' then insert into kdial_private.categories values(slug,trim(label)) on conflict on constraint categories_pkey do update set label=excluded.label;
 elsif kind='locality' then insert into kdial_private.localities values(slug,trim(label)) on conflict on constraint localities_pkey do update set label=excluded.label;
 else raise exception 'Unknown taxonomy kind'; end if;
 perform kdial_private.audit(null,'taxonomy_saved',jsonb_build_object('kind',kind,'slug',slug));
end $$;
create function public.kdial_admin_delete_taxonomy(kind text, slug_value text) returns void language plpgsql security definer set search_path = '' as $$
begin
 perform kdial_private.require_role(array['editor','owner']);
 if kind='category' then delete from kdial_private.categories where slug=slug_value;
 elsif kind='locality' then delete from kdial_private.localities where slug=slug_value;
 else raise exception 'Unknown taxonomy kind'; end if;
 perform kdial_private.audit(null,'taxonomy_deleted',jsonb_build_object('kind',kind,'slug',slug_value));
end $$;
create function kdial_private.validate_listing_arrays(record jsonb) returns void language plpgsql set search_path = '' as $$
declare a jsonb; item jsonb; key text;
begin
 foreach key in array array['services','photos','hours'] loop
  a=coalesce(record->key,'[]');
  if jsonb_typeof(a)<>'array' or jsonb_array_length(a)>(case when key='services' then 30 when key='photos' then 10 else 14 end) then raise exception 'Invalid listing arrays'; end if;
  for item in select value from jsonb_array_elements(a) loop
   if key='services' and (jsonb_typeof(item)<>'string' or length(item#>>'{}') not between 1 and 120) then raise exception 'Invalid service'; end if;
   if key='photos' and (jsonb_typeof(item)<>'string' or (item#>>'{}') !~ '^https://[^[:space:]]+$' or length(item#>>'{}')>1000) then raise exception 'Photos must use approved HTTPS URLs'; end if;
   if key='hours' and (jsonb_typeof(item)<>'object' or coalesce(length(item->>'days'),0) not between 1 and 80 or coalesce(item->>'opens','') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' or coalesce(item->>'closes','') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$') then raise exception 'Invalid supplied hours'; end if;
  end loop;
 end loop;
end $$;
-- Allowlisted listing fields only. Client-supplied approval/payment/role flags are ignored.
create function public.kdial_admin_save_listing(record jsonb, listing_id uuid default null) returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
 perform kdial_private.require_role(array['editor','owner']);
 perform kdial_private.validate_listing_arrays(record);
 if listing_id is null then
 insert into kdial_private.listings(slug,name,category_slug,locality_slug,address,phone,whatsapp,website,description,services,hours,photos)
 values(record->>'slug',trim(record->>'name'),record->>'category_slug',record->>'locality_slug',trim(record->>'address'),record->>'phone',nullif(record->>'whatsapp',''),nullif(record->>'website',''),trim(record->>'description'),coalesce(record->'services','[]'),coalesce(record->'hours','[]'),coalesce(record->'photos','[]')) returning id into result;
 else
 update kdial_private.listings set slug=record->>'slug',name=trim(record->>'name'),category_slug=record->>'category_slug',locality_slug=record->>'locality_slug',address=trim(record->>'address'),phone=record->>'phone',whatsapp=nullif(record->>'whatsapp',''),website=nullif(record->>'website',''),description=trim(record->>'description'),services=coalesce(record->'services','[]'),hours=coalesce(record->'hours','[]'),photos=coalesce(record->'photos','[]'),content_status='draft',publication_status='unpublished',content_verified_by=null,content_verified_at=null,consent_reference=null,rejection_reason=null where id=listing_id returning id into result;
 if result is null then raise exception 'Listing not found'; end if;
 end if;
 perform kdial_private.audit(result,'listing_saved'); return result;
end $$;
create function public.kdial_admin_review_content(listing_id uuid, approve boolean, reference_or_reason text) returns void language plpgsql security definer set search_path = '' as $$
begin
 perform kdial_private.require_role(array['publisher','owner']);
 if coalesce(length(trim(reference_or_reason)),0) not between 3 and 500 then raise exception 'Content-check consent reference or rejection reason required'; end if;
 update kdial_private.listings set content_status=case when approve then 'approved' else 'rejected' end,
 content_verified_by=case when approve then auth.uid() else null end,content_verified_at=case when approve then now() else null end,
 consent_reference=case when approve then reference_or_reason else null end,rejection_reason=case when approve then null else reference_or_reason end,
 publication_status='unpublished' where id=listing_id;
 if not found then raise exception 'Listing not found'; end if;
 perform kdial_private.audit(listing_id,case when approve then 'content_approved' else 'content_rejected' end,jsonb_build_object('reference_or_reason',reference_or_reason));
end $$;
create function public.kdial_admin_confirm_terms(listing_id uuid, package_version text, amount_minor integer, start_date date, end_date date) returns void language plpgsql security definer set search_path = '' as $$
begin
 perform kdial_private.require_role(array['owner']);
 if coalesce(length(trim(package_version)),0) not between 3 and 200 or coalesce(amount_minor,0)<=0 or start_date is null or end_date is null or end_date<=start_date then raise exception 'Explicit agreed package, amount and term dates required'; end if;
 update kdial_private.listings set package_version=kdial_admin_confirm_terms.package_version,agreed_amount_minor=amount_minor,currency='INR',terms_start=start_date,terms_end=end_date,terms_confirmed=true,payment_status='not_reported',bank_verified_by=null,bank_verified_at=null,bank_reference=null,bank_verified_amount_minor=null,publication_status='unpublished' where id=listing_id;
 if not found then raise exception 'Listing not found'; end if;
 perform kdial_private.audit(listing_id,'terms_confirmed',jsonb_build_object('package_version',package_version,'amount_minor',amount_minor,'start_date',start_date,'end_date',end_date));
end $$;
create function public.kdial_admin_report_payment(listing_id uuid, event_key text, source text, amount_minor integer, evidence_reference text) returns void language plpgsql security definer set search_path = '' as $$
declare existing kdial_private.payment_reports;
begin
 perform kdial_private.require_role(array['finance','owner']);
 select * into existing from kdial_private.payment_reports r where r.event_key=kdial_admin_report_payment.event_key;
 if found then
  if existing.listing_id<>listing_id or existing.amount_minor<>amount_minor or existing.source<>source or existing.evidence_reference<>evidence_reference then raise exception 'Conflicting duplicate payment report'; end if;
  return;
 end if;
 insert into kdial_private.payment_reports(listing_id,event_key,source,amount_minor,evidence_reference,reported_by) values(listing_id,event_key,source,amount_minor,evidence_reference,auth.uid());
 update kdial_private.listings set payment_status=case when payment_status='bank_verified' then payment_status else 'reported' end where id=listing_id;
 perform kdial_private.audit(listing_id,'payment_reported',jsonb_build_object('source',source,'event_key',event_key));
end $$;
create function public.kdial_admin_verify_bank(listing_id uuid, amount_minor integer, reconciliation_reference text, verified boolean) returns void language plpgsql security definer set search_path = '' as $$
declare b kdial_private.listings;
begin
 perform kdial_private.require_role(array['finance','owner']);
 if coalesce(length(trim(reconciliation_reference)),0) not between 3 and 500 then raise exception 'Manual actual-bank-credit reconciliation reference or rejection reason required'; end if;
 select * into b from kdial_private.listings where id=listing_id for update;
 if not found then raise exception 'Listing not found'; end if;
 if verified and (not b.terms_confirmed or amount_minor is distinct from b.agreed_amount_minor) then raise exception 'Credit must match the explicitly agreed amount'; end if;
 update kdial_private.listings set payment_status=case when verified then 'bank_verified' else 'rejected' end,
 bank_verified_by=case when verified then auth.uid() else null end,bank_verified_at=case when verified then now() else null end,
 bank_reference=reconciliation_reference,bank_verified_amount_minor=case when verified then amount_minor else null end,publication_status='unpublished' where id=listing_id;
 perform kdial_private.audit(listing_id,case when verified then 'bank_credit_verified' else 'bank_credit_rejected' end,jsonb_build_object('reference',reconciliation_reference,'amount_minor',amount_minor));
end $$;
create function public.kdial_admin_publication(listing_id uuid, action text, reason text default '') returns void language plpgsql security definer set search_path = '' as $$
begin
 perform kdial_private.require_role(array['publisher','owner']);
 if action is null or action not in ('published','suspended','expired','unpublished') then raise exception 'Invalid publication state'; end if;
 if action<>'published' and coalesce(length(trim(reason)),0)<3 then raise exception 'Reason required'; end if;
 update kdial_private.listings set publication_status=action where id=listing_id;
 if not found then raise exception 'Listing not found'; end if;
 perform kdial_private.audit(listing_id,'publication_'||action,jsonb_build_object('reason',reason));
end $$;
create function public.kdial_admin_delete_draft(listing_id uuid) returns void language plpgsql security definer set search_path = '' as $$
begin
 perform kdial_private.require_role(array['owner']);
 if not exists(select 1 from kdial_private.listings b where b.id=listing_id and b.publication_status='unpublished' and b.content_status='draft' and b.payment_status='not_reported' and not b.terms_confirmed) then raise exception 'Only untouched unpublished drafts can be deleted; suspend other listings'; end if;
 delete from kdial_private.listings where id=listing_id;
 perform kdial_private.audit(listing_id,'draft_deleted');
end $$;
-- The Edge Function validates CAPTCHA/consent and rate limits before calling this service-only RPC.
create function public.kdial_receive_submission(payload jsonb, applicant_email text, rate_key text) returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid; window_count integer;
begin
 if coalesce(length(rate_key),0) <> 64 then raise exception 'Invalid rate-limit key'; end if;
 insert into kdial_private.submission_rate_windows values(rate_key,now(),1) on conflict on constraint submission_rate_windows_pkey do update set count=case when submission_rate_windows.started_at < now()-interval '1 hour' then 1 else submission_rate_windows.count+1 end, started_at=case when submission_rate_windows.started_at < now()-interval '1 hour' then now() else submission_rate_windows.started_at end returning count into window_count;
 if window_count>3 then raise exception 'Submission limit reached. Try later.'; end if;
 if (select count(*) from kdial_private.submissions where created_at>now()-interval '1 hour')>=200 then raise exception 'Submission capacity reached. Try later.'; end if;
 if coalesce(length(payload->>'name'),0) not between 2 and 140 or coalesce(length(payload->>'description'),0) not between 20 and 2000 or coalesce(length(payload->>'address'),0) not between 5 and 500 or coalesce(payload->>'phone','') !~ '^\+91[6-9][0-9]{9}$' or coalesce(applicant_email,'') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid submission'; end if;
 if not exists(select 1 from kdial_private.categories where slug=payload->>'category_slug') or not exists(select 1 from kdial_private.localities where slug=payload->>'locality_slug') then raise exception 'Unknown category or locality'; end if;
 if payload->>'consent' is distinct from 'true' then raise exception 'Publication consent required'; end if;
 insert into kdial_private.submissions(payload,applicant_email) values(jsonb_build_object('name',payload->>'name','category_slug',payload->>'category_slug','locality_slug',payload->>'locality_slug','address',payload->>'address','phone',payload->>'phone','whatsapp',case when payload->>'whatsapp_consent'='true' then payload->>'whatsapp' else null end,'description',payload->>'description'),applicant_email) returning id into result;
 perform kdial_private.audit(result,'submission_received'); return result;
end $$;
create function public.kdial_admin_review_submission(submission_id uuid, accept boolean, reason text, slug text default null) returns uuid language plpgsql security definer set search_path = '' as $$
declare s kdial_private.submissions; result uuid;
begin
 perform kdial_private.require_role(array['editor','owner']);
 if coalesce(length(trim(reason)),0) not between 3 and 500 then raise exception 'Review reason required'; end if;
 select * into s from kdial_private.submissions where id=submission_id for update;
 if not found or s.status<>'pending' then raise exception 'Pending submission not found'; end if;
 if accept then result=public.kdial_admin_save_listing(s.payload || jsonb_build_object('slug',slug),null); end if;
 update kdial_private.submissions set status=case when accept then 'accepted' else 'rejected' end,review_reason=reason,reviewed_by=auth.uid(),reviewed_at=now(),listing_id=result where id=submission_id;
 perform kdial_private.audit(submission_id,case when accept then 'submission_accepted_as_draft' else 'submission_rejected' end,jsonb_build_object('reason',reason,'listing_id',result)); return result;
end $$;
-- Lock down function execution defaults explicitly, including helper functions.
revoke all on all functions in schema kdial_private from public, anon, authenticated;
revoke all on function public.kdial_public_taxonomy() from public;
revoke all on function public.kdial_public_listings() from public;
grant execute on function public.kdial_public_taxonomy(), public.kdial_public_listings() to anon, authenticated;
-- Grant only admin RPCs to authenticated; each function checks server-maintained membership/role.
do $$ declare f record; begin
 for f in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'kdial_admin_%' loop
  execute format('revoke all on function %s from public, anon',f.signature);
  execute format('grant execute on function %s to authenticated',f.signature);
 end loop;
end $$;
revoke all on function public.kdial_receive_submission(jsonb,text,text) from public,anon,authenticated;
grant execute on function public.kdial_receive_submission(jsonb,text,text) to service_role;
commit;
