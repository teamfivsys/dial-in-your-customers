import { useCallback, useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, LockKeyhole, LogOut, Plus, ShieldCheck, Store } from "lucide-react";
import SEO from "@/components/seo/SEO";
import "@/styles/kdial-refresh.css";
import "@/styles/admin.css";

type Role = "owner" | "editor" | "publisher" | "finance";
type Taxon = { slug: string; label: string };
type Listing = {
  id: string; slug: string; name: string; category_slug: string; locality_slug: string;
  address: string; phone: string; whatsapp: string | null; website: string | null;
  description: string; services: string[]; hours: { days: string; opens: string; closes: string }[];
  photos: string[]; content_status: string; publication_status: string; payment_status: string; terms_confirmed:boolean; agreed_amount_minor:number|null; currency:string; bank_verified_amount_minor:number|null; updated_at: string;
};
type Session = { user: { id: string; email: string; role: Role } | null; csrfToken: string | null };
type Submission = {id:string; payload:Record<string,string>; applicant_email:string; status:string; review_reason:string|null; created_at:string};
type Dashboard = { role: Role; listings: Listing[]; taxonomy: { categories: Taxon[]; localities: Taxon[] }; submissions:Submission[]; reports:Array<Record<string,unknown>>; audit:Array<{id:number;actor_id:string|null;entity_id:string|null;action:string;created_at:string}> };
type FormValues = Pick<Listing, "slug" | "name" | "category_slug" | "locality_slug" | "address" | "phone" | "whatsapp" | "website" | "description" | "services" | "hours" | "photos">;

const emptyForm: FormValues = { slug: "", name: "", category_slug: "", locality_slug: "", address: "", phone: "", whatsapp: "", website: "", description: "", services: [], hours: [], photos: [] };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "same-origin", headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Request failed.");
  return body as T;
}

export default function MysqlAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [edit, setEdit] = useState<Listing | FormValues | null>(null);
  const [selectedId,setSelectedId]=useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.search).get("reset") || "");

  const loadDashboard = useCallback(async (token: string) => {
    const data = await request<Dashboard>("/api/v1/admin/dashboard", { headers: { "X-KDial-CSRF": token } });
    setDashboard(data);
  }, []);

  useEffect(() => {
    let mounted = true;
    request<Session>("/api/v1/admin/session").then(async value => {
      if (!mounted) return;
      setSession(value);
      setCsrf(value.csrfToken);
      if (value.user && value.csrfToken) await loadDashboard(value.csrfToken);
    }).catch(e => { if (mounted) setError(e instanceof Error ? e.message : "Could not check sign-in."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [loadDashboard]);

  async function requestPasswordReset(event: MouseEvent<HTMLButtonElement>) {
    const form=event.currentTarget.closest("form");
    const email=String(form ? new FormData(form).get("email") || "" : "").trim();
    if(!email||!/^\S+@\S+\.\S+$/.test(email)){setError("Enter your admin email first.");return;}
    setBusy(true);setError("");setNotice("");
    try{const result=await request<{message:string}>("/api/v1/admin/password-reset",{method:"POST",body:JSON.stringify({email})});setNotice(result.message);}
    catch(e){setError(e instanceof Error?e.message:"Password recovery is unavailable.");}
    finally{setBusy(false);}
  }

  async function confirmPasswordReset(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget,values=Object.fromEntries(new FormData(form));
    if(values.password!==values.confirm){setError("The two passwords don’t match.");return;}
    setBusy(true);setError("");setNotice("");
    try{await request("/api/v1/admin/password-reset/confirm",{method:"POST",body:JSON.stringify({token:resetToken,password:values.password})});setResetToken("");window.history.replaceState({},"",window.location.pathname);form.reset();setNotice("Password updated. Sign in with your new password.");}
    catch(e){setError(e instanceof Error?e.message:"This recovery link is invalid or expired.");}
    finally{setBusy(false);}
  }

  async function changePassword(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget,values=Object.fromEntries(new FormData(form));
    if(values.new_password!==values.confirm){setError("The two passwords don’t match.");return;}
    if(!csrf)return;setBusy(true);setError("");setNotice("");
    try{await request("/api/v1/admin/password",{method:"POST",headers:{"X-KDial-CSRF":csrf},body:JSON.stringify({current_password:values.current_password,new_password:values.new_password})});setSession({user:null,csrfToken:null});setCsrf(null);setDashboard(null);setEdit(null);form.reset();setNotice("Password updated; all admin sessions were signed out. Sign in again.");}
    catch(e){setError(e instanceof Error?e.message:"Password could not be updated.");}
    finally{setBusy(false);}
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setBusy(true); setError(""); setNotice("");
    try {
      const value = await request<Session>("/api/v1/admin/session", { method: "POST", body: JSON.stringify({ email: values.email, password: values.password }) });
      if (!value.user || !value.csrfToken) throw new Error("Sign-in response was incomplete.");
      setSession(value); setCsrf(value.csrfToken);
      await loadDashboard(value.csrfToken);
      form.reset();
      setNotice("Signed in to the MySQL admin workspace.");
    } catch (e) { setSession(null); setCsrf(null); setDashboard(null); setError(e instanceof Error ? e.message : "Sign-in failed."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    if (!csrf) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await request("/api/v1/admin/session", { method: "DELETE", headers: { "X-KDial-CSRF": csrf } });
      setSession({ user: null, csrfToken: null }); setCsrf(null); setDashboard(null); setEdit(null); setNotice("Signed out.");
    } catch (e) { setError(e instanceof Error ? e.message : "Sign-out failed."); }
    finally { setBusy(false); }
  }

  async function mutate(path:string,body:Record<string,unknown>,message:string,method="POST") {
    if(!csrf)return;setBusy(true);setError("");setNotice("");
    try{const result=await request<{token?:string}>(path,{method,headers:{"X-KDial-CSRF":csrf},body:JSON.stringify(body)});await loadDashboard(csrf);setNotice(result.token?`${message} Customer preview: ${window.location.origin}/pay/${result.token}`:message);}
    catch(e){setError(e instanceof Error?e.message:"The change could not be saved.");}
    finally{setBusy(false);}
  }
  async function submitMutation(event:FormEvent<HTMLFormElement>,path:string,make:(v:Record<string,FormDataEntryValue>)=>Record<string,unknown>,message:string){event.preventDefault();const v=Object.fromEntries(new FormData(event.currentTarget));await mutate(path,make(v),message);}

  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!csrf || !edit) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const record = {
      slug: String(values.slug), name: String(values.name), category_slug: String(values.category_slug), locality_slug: String(values.locality_slug),
      address: String(values.address), phone: String(values.phone), whatsapp: String(values.whatsapp), website: String(values.website),
      description: String(values.description),
      services: String(values.services).split("\n").map(x => x.trim()).filter(Boolean),
      photos: String(values.photos).split("\n").map(x => x.trim()).filter(Boolean),
      hours: String(values.hours).split("\n").map(x => x.trim()).filter(Boolean).map(line => {
        const [days, opens, closes] = line.split("|").map(x => x.trim());
        return { days, opens, closes };
      }),
    };
    setBusy(true); setError(""); setNotice("");
    try {
      await request("/api/v1/admin/listings", { method: "POST", headers: { "X-KDial-CSRF": csrf }, body: JSON.stringify({ record, listing_id: "id" in edit ? edit.id : null }) });
      await loadDashboard(csrf);
      setEdit(null); setNotice("Draft saved.");
    } catch (e) { setError(e instanceof Error ? e.message : "Draft was not saved."); }
    finally { setBusy(false); }
  }

  const canEdit = dashboard?.role === "owner" || dashboard?.role === "editor";
  const canPublish = dashboard?.role === "owner" || dashboard?.role === "publisher";
  const canFinance = dashboard?.role === "owner" || dashboard?.role === "finance";
  const isOwner = dashboard?.role === "owner";
  const activeListing=dashboard?.listings.find(x=>x.id===(selectedId||dashboard?.listings[0]?.id));
  const feedback = error || notice;
  const content = loading ? <p role="status">Checking your session…</p> : !session?.user ? <section className="ka-login"><div><p className="kd-eyebrow">KDial administration</p><h1>Manage the Kochi directory.</h1><p>MySQL sign-in is server-side. No public account registration is available.</p><span className="ka-security"><ShieldCheck/>Private, role-checked administration</span></div>{resetToken ? <form onSubmit={confirmPasswordReset}><h2>Choose a new password</h2><p>This one-time recovery link expires after 30 minutes.</p><label>New password<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><label>Confirm new password<input name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><button disabled={busy} className="kd-button">{busy ? "Updating…" : "Update password"}</button></form> : <form onSubmit={signIn}><h2>Administrator sign-in</h2><p>Use the owner account set up for this database.</p><label>Email<input name="email" type="email" autoComplete="username" required/></label><label>Password<input name="password" type="password" autoComplete="current-password" minLength={12} maxLength={128} required/></label><button disabled={busy} className="kd-button">{busy ? "Signing in…" : "Sign in securely"}</button><button type="button" className="kd-text-link" disabled={busy} onClick={requestPasswordReset}>Forgot your password?</button></form>}</section> : !dashboard ? <section className="ka-locked"><LockKeyhole size={36}/><h1>Workspace access isn’t available.</h1><p>Your session is valid, but the protected MySQL workspace did not load. No admin action is enabled.</p><button className="kd-button" disabled={busy || !csrf} onClick={() => csrf && void loadDashboard(csrf).catch(e => setError(e.message))}>Try again</button><button className="kd-button kd-button-secondary" disabled={busy} onClick={() => void signOut()}>Sign out</button></section> : <div className="ka-workspace">
    <aside className="ka-sidebar"><a className="ka-brand" href="/"><img src="/kdial-logo.png" alt="KDial"/><span>MYSQL ADMIN</span></a><nav aria-label="Admin navigation"><button className="active" aria-current="page"><Store size={19}/>Businesses</button></nav><div className="ka-sidebar-bottom"><ShieldCheck size={19}/><p>Signed in as {dashboard.role}<small>{session.user.email}</small></p><button aria-label="Sign out" disabled={busy} onClick={() => void signOut()}><LogOut size={18}/></button></div></aside>
    <main id="main-content" className="ka-main"><header className="ka-top"><span><i/>MySQL workspace</span><Link to="/directory">Public directory <ArrowUpRight size={15}/></Link></header><div className="ka-page-heading"><div><p className="kd-eyebrow">DIRECTORY ADMINISTRATION</p><h1>Businesses</h1><p>Role-checked directory, moderation and payment reconciliation workspace.</p></div>{canEdit && !edit && <button className="kd-button" onClick={() => setEdit(emptyForm)}><Plus size={17}/>New private draft</button>}</div>
    {!canEdit && <p className="ka-help" role="status">Your {dashboard.role} role can’t edit listing drafts.</p>}
    <details className="ka-panel" style={{marginBottom:20}}><summary>Account security · change password</summary><form onSubmit={changePassword}><label>Current password<input name="current_password" type="password" autoComplete="current-password" minLength={12} maxLength={128} required/></label><label>New password<input name="new_password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><label>Confirm new password<input name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><button className="kd-button" disabled={busy}>Update password and sign out other sessions</button></form></details>
    {!edit ? <div className="ka-table-wrap"><table className="ka-table"><thead><tr><th>Business</th><th>Content</th><th>Publication</th>{canEdit && <th>Action</th>}<th>Workflow</th></tr></thead><tbody>{dashboard.listings.map(row => <tr key={row.id}><td><strong>{row.name}</strong><small>{row.category_slug} · {row.locality_slug}</small></td><td><span className="ka-badge">{row.content_status}</span></td><td><span className="ka-badge">{row.publication_status}</span></td>{canEdit && <td><button className="ka-open" onClick={() => setEdit(row)}>Edit draft</button></td>}<td><button className="ka-open" onClick={()=>setSelectedId(row.id)}>Select</button></td></tr>)}</tbody></table>{dashboard.listings.length === 0 && <div className="ka-empty"><Store/><h2>No MySQL listings yet.</h2><p>Create a private draft when you have verified business details and consent.</p></div>}</div> : <section className="ka-panel"><div className="ka-section-heading"><h2>{"id" in edit ? "Edit private draft" : "Create private draft"}</h2><button type="button" onClick={() => setEdit(null)}>Close</button></div><p className="ka-help">Saving an edit returns it to draft/unpublished and clears old consent, offer and payment verification, which must be re-established.</p><form onSubmit={saveDraft}><div className="ka-form-grid"><label>Business name<input name="name" required minLength={2} maxLength={140} defaultValue={edit.name}/></label><label>URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} defaultValue={edit.slug}/></label><label>Category<select name="category_slug" required defaultValue={edit.category_slug}><option value="">Choose category</option>{dashboard.taxonomy.categories.map(x=><option key={x.slug} value={x.slug}>{x.label}</option>)}</select></label><label>Neighbourhood<select name="locality_slug" required defaultValue={edit.locality_slug}><option value="">Choose neighbourhood</option>{dashboard.taxonomy.localities.map(x=><option key={x.slug} value={x.slug}>{x.label}</option>)}</select></label><label>Phone (+91…)<input name="phone" required pattern="\+91[6-9][0-9]{9}" defaultValue={edit.phone}/></label><label>Consented WhatsApp (optional)<input name="whatsapp" pattern="\+91[6-9][0-9]{9}" defaultValue={edit.whatsapp ?? ""}/></label></div><label>Full address<input name="address" required minLength={5} maxLength={500} defaultValue={edit.address}/></label><label>Description<textarea name="description" required minLength={20} maxLength={2000} defaultValue={edit.description}/></label><label>Website (HTTPS, optional)<input name="website" type="url" pattern="https://.*" defaultValue={edit.website ?? ""}/></label><div className="ka-form-grid"><label>Services (one per line)<textarea name="services" defaultValue={edit.services.join("\n")}/></label><label>Photo HTTPS URLs (one per line)<textarea name="photos" defaultValue={edit.photos.join("\n")}/></label></div><label>Hours: Day | opens | closes (one per line)<textarea name="hours" placeholder="Monday–Friday | 09:00 | 17:00" defaultValue={edit.hours.map(x => `${x.days} | ${x.opens} | ${x.closes}`).join("\n")}/></label><button disabled={busy} className="kd-button">{busy ? "Saving…" : "Save draft"}</button></form></section>}

    {activeListing&&<section className="ka-panel" style={{marginTop:20}}><h2>Moderation & publication · {activeListing.name}</h2><p className="ka-help">Publication stays blocked until approved content/consent, current owner-confirmed INR terms, and independently verified matching bank credit are all recorded.</p>
      {canPublish&&<form onSubmit={e=>submitMutation(e,"/api/v1/admin/listings/review",v=>({listing_id:activeListing.id,approve:v.decision==="approve",reference_or_reason:v.evidence}),"Content review saved; publication is still a separate step.")}><h3>Content and consent review</h3><label>Decision<select name="decision"><option value="approve">Approve content and record consent reference</option><option value="reject">Reject content</option></select></label><label>Consent reference or rejection reason<input name="evidence" required minLength={3} maxLength={500}/></label><button className="kd-button" disabled={busy}>Save content decision</button></form>}
      {canPublish&&<form onSubmit={e=>submitMutation(e,"/api/v1/admin/listings/publication",v=>({listing_id:activeListing.id,action:v.action,reason:v.reason}),"Publication state updated.")}><h3>Publication control</h3><label>Action<select name="action"><option value="published">Publish (all server-side gates must pass)</option><option value="unpublished">Unpublish</option><option value="suspended">Suspend</option><option value="expired">Mark expired</option></select></label><label>Reason required unless publishing<input name="reason" maxLength={500}/></label><button className="kd-button" disabled={busy}>Apply publication action</button></form>}
      {isOwner&&<form onSubmit={e=>submitMutation(e,"/api/v1/admin/listings/terms",v=>({listing_id:activeListing.id,package_version:v.package_version,amount_minor:Number(v.amount_minor),start_date:v.start_date,end_date:v.end_date}),"Owner-confirmed terms saved. Any prior payment verification and offer link were cleared.")}><h3>Owner-confirmed offer terms</h3><label>Package/version<input name="package_version" required minLength={3} maxLength={200}/></label><label>Agreed amount in paise<input name="amount_minor" type="number" min="1" required/></label><div className="ka-form-grid"><label>Term starts<input name="start_date" type="date" required/></label><label>Term ends (exclusive)<input name="end_date" type="date" required/></label></div><button className="kd-button" disabled={busy}>Save confirmed terms</button></form>}
      {isOwner&&<form onSubmit={e=>submitMutation(e,"/api/v1/admin/listings/payment-offer",v=>({listing_id:activeListing.id,package_inclusions:v.package_inclusions,cancellation_refund_terms:v.cancellation_refund_terms}),"Gated customer preview link prepared.")}><h3>Gated customer offer preview</h3><label>Exact package inclusions<textarea name="package_inclusions" required minLength={10} maxLength={2000}/></label><label>Cancellation/refund terms<textarea name="cancellation_refund_terms" required minLength={10} maxLength={1500}/></label><button className="kd-button" disabled={busy}>Prepare offer preview</button><p className="ka-help">The offer is exposed only when owner-confirmed ₹501 INR terms, approved consent, unpublished state and secure UPI runtime configuration are present. Reporting never confirms payment.</p></form>}
      {canFinance&&<form onSubmit={e=>submitMutation(e,"/api/v1/admin/listings/payment-report",v=>({listing_id:activeListing.id,event_key:v.event_key,source:v.source,amount_minor:Number(v.amount_minor),evidence_reference:v.evidence_reference}),"Payment report recorded only; no payment is confirmed.")}><h3>Payment report only</h3><label>Source<select name="source"><option value="manual">Manual report</option><option value="youpi">YouPI notification</option></select></label><label>Unique report/event reference<input name="event_key" required maxLength={150}/></label><label>Reported amount (paise)<input type="number" name="amount_minor" min="1" required/></label><label>Private evidence reference<input name="evidence_reference" required maxLength={500}/></label><button className="kd-button" disabled={busy}>Record report (not paid)</button></form>}
      {canFinance&&<form onSubmit={e=>submitMutation(e,"/api/v1/admin/listings/bank-reconciliation",v=>({listing_id:activeListing.id,verified:v.decision==="verify",amount_minor:Number(v.amount_minor),reconciliation_reference:v.reference}),"Manual bank-reconciliation decision saved; publishing remains separate.")}><h3>Actual bank-credit reconciliation</h3><p className="ka-help">Check the actual bank credit independently; a screenshot, notification or payment reference is not sufficient proof.</p><label>Decision<select name="decision"><option value="verify">I verified the actual bank credit</option><option value="reject">Reject/revoke credit verification</option></select></label><label>Actual credited amount (paise)<input name="amount_minor" type="number" min="1" required/></label><label>Private reconciliation reference or rejection reason<input name="reference" required minLength={3} maxLength={500}/></label><button className="kd-button" disabled={busy}>Save bank reconciliation</button></form>}
      {isOwner&&activeListing.content_status==="draft"&&activeListing.publication_status==="unpublished"&&activeListing.payment_status==="not_reported"&&!activeListing.terms_confirmed&&<button className="kd-button kd-button-secondary" disabled={busy} onClick={()=>void mutate("/api/v1/admin/listings/delete",{listing_id:activeListing.id},"Untouched draft deleted.")}>Delete untouched draft</button>}
    </section>}
    {canEdit&&<section className="ka-panel" style={{marginTop:20}}><h2>Directory taxonomy</h2><form onSubmit={e=>submitMutation(e,"/api/v1/admin/taxonomy",v=>({kind:v.kind,slug:String(v.slug).trim().toLowerCase(),label:v.label}),"Category or locality saved.")}><label>Type<select name="kind"><option value="category">Category</option><option value="locality">Locality</option></select></label><label>Slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100}/></label><label>Display name<input name="label" required maxLength={100}/></label><button className="kd-button" disabled={busy}>Save taxonomy</button></form><ul>{[...dashboard.taxonomy.categories.map(x=>({...x,kind:"category"})),...dashboard.taxonomy.localities.map(x=>({...x,kind:"locality"}))].map(x=><li key={`${x.kind}-${x.slug}`}>{x.kind}: {x.label} <code>{x.slug}</code><button className="ka-open" disabled={busy} onClick={()=>void mutate("/api/v1/admin/taxonomy",{kind:x.kind,slug:x.slug},"Taxonomy removed.","DELETE")}>Remove</button></li>)}</ul><p className="ka-help">Removing an in-use category or locality is rejected by the database.</p></section>}
    {(canEdit)&&<section className="ka-panel" style={{marginTop:20}}><h2>Public submissions</h2>{dashboard.submissions.length===0?<p>No submissions.</p>:dashboard.submissions.map(item=><details key={item.id}><summary>{item.payload?.name||"Submission"} · {item.status} · {String(item.created_at)}</summary><p>{item.payload?.address} · {item.payload?.phone}</p><p>Contact: {item.applicant_email}</p>{item.status==="pending"&&<form onSubmit={e=>submitMutation(e,"/api/v1/admin/submissions/review",v=>({submission_id:item.id,accept:v.decision==="accept",reason:v.reason,slug:v.slug}),"Submission reviewed; an accepted submission creates an unpublished draft only.")}><label>Decision<select name="decision"><option value="accept">Accept as private draft</option><option value="reject">Reject</option></select></label><label>Draft URL slug (required when accepting)<input name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100}/></label><label>Review reason<input name="reason" required minLength={3} maxLength={500}/></label><button className="kd-button" disabled={busy}>Save review</button></form>}{item.review_reason&&<p>Review: {item.review_reason}</p>}</details>)}</section>}
    {(isOwner||canFinance)&&<section className="ka-panel" style={{marginTop:20}}><h2>Payment reports</h2>{!canFinance||dashboard.reports.length===0?<p>No reports available to this role.</p>:<ul>{dashboard.reports.map((r,i)=><li key={String(r.id??i)}>Listing {String(r.listing_id)} · {String(r.source)} · {String(r.amount_minor)} paise · {String(r.created_at)}</li>)}</ul>}</section>}
    <section className="ka-panel" style={{marginTop:20}}><h2>Recent audit history</h2><ul>{dashboard.audit.map(row=><li key={row.id}>{row.action} · {row.entity_id??"system"} · {String(row.created_at)}</li>)}</ul></section>
  </main></div>;

  return <div className="kd-site ka-root"><SEO title="KDial admin" description="Authorized KDial directory administration." canonicalUrl="https://kdial.in/admin" noIndex/>{content}{feedback && <div role={error ? "alert" : "status"} className={`ka-toast ${error ? "is-error" : ""}`}><span>{feedback}</span><button aria-label="Dismiss message" onClick={() => { setError(""); setNotice(""); }}>×</button></div>}</div>;
}
