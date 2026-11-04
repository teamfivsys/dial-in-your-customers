import { test, expect } from "@playwright/test";

const csrf = "A".repeat(43);
const listing = {
  id: "550e8400-e29b-41d4-a716-446655440000", slug: "test-cafe", name: "Test Cafe",
  category_slug: "cafes", locality_slug: "kaloor", address: "10 Test Street, Kochi",
  phone: "+919876543210", whatsapp: null, website: null,
  description: "A test business description with enough detail for the form validation.",
  services: ["Coffee"], hours: [], photos: [], content_status: "draft",
  publication_status: "unpublished", payment_status: "not_reported", terms_confirmed:false, agreed_amount_minor:null, currency:"INR", bank_verified_amount_minor:null, updated_at: "2026-10-22T00:00:00.000Z",
};
const dashboard = (row = listing, categories = [{ slug: "cafes", label: "Cafés" }], localities = [{ slug: "kaloor", label: "Kaloor" }]) => ({ role: "owner", listings: [{ ...row }], taxonomy: { categories, localities }, submissions:[], reports:[], audit:[] });

test("MySQL admin UI signs in, edits a private draft and signs out without Supabase calls", async ({ page }) => {
  let currentRow = { ...listing };
  const categories = [{ slug: "cafes", label: "Cafés" }];
  const localities = [{ slug: "kaloor", label: "Kaloor" }];
  const seen: { url: string; method: string; csrf?: string }[] = [];
  await page.route("**/api/v1/admin/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    seen.push({ url: url.pathname, method: request.method(), csrf: request.headers()["x-kdial-csrf"] });
    if (url.pathname === "/api/v1/admin/session" && request.method() === "GET") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: null, csrfToken: null }) });
    }
    if (url.pathname === "/api/v1/admin/session" && request.method() === "POST") {
      const body = request.postDataJSON();
      expect(body.email).toBe("owner@example.test");
      expect(body.password).toBe("test-only-password-93!");
      return route.fulfill({ status: 200, contentType: "application/json", headers: { "Set-Cookie": "kdial_admin_session=test; Path=/; HttpOnly; SameSite=Strict" }, body: JSON.stringify({ user: { id: listing.id, email: body.email, role: "owner" }, csrfToken: csrf }) });
    }
    if (url.pathname === "/api/v1/admin/dashboard" && request.method() === "GET") {
      expect(request.headers()["x-kdial-csrf"]).toBe(csrf);
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(dashboard(currentRow, categories, localities)) });
    }
    if (url.pathname === "/api/v1/admin/listings" && request.method() === "POST") {
      expect(request.headers()["x-kdial-csrf"]).toBe(csrf);
      const body = request.postDataJSON();
      expect(body.listing_id).toBe(listing.id);
      expect(body.record.name).toBe("Test Cafe Updated");
      currentRow = { ...currentRow, ...body.record, content_status: "draft", publication_status: "unpublished", payment_status: "not_reported", terms_confirmed: false, agreed_amount_minor: null, consent_reference: null, bank_verified_amount_minor: null };
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ id: listing.id, status: "draft" }) });
    }
    if (url.pathname === "/api/v1/admin/listings/review" && request.method() === "POST") {
      const body = request.postDataJSON();
      currentRow = { ...currentRow, content_status: body.approve ? "approved" : "rejected", consent_reference: body.reference_or_reason };
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    if (url.pathname === "/api/v1/admin/listings/terms" && request.method() === "POST") {
      const body = request.postDataJSON();
      currentRow = { ...currentRow, terms_confirmed: true, agreed_amount_minor: body.amount_minor, terms_start: body.start_date, terms_end: body.end_date, package_version: body.package_version };
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    if (url.pathname === "/api/v1/admin/listings/bank-reconciliation" && request.method() === "POST") {
      const body = request.postDataJSON();
      expect(body.verified).toBe(true);
      currentRow = { ...currentRow, payment_status: "bank_verified", bank_verified_amount_minor: body.amount_minor, bank_reference: body.reconciliation_reference };
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    if (url.pathname === "/api/v1/admin/listings/publication" && request.method() === "POST") {
      const body = request.postDataJSON();
      expect(currentRow.content_status).toBe("approved");
      expect(currentRow.terms_confirmed).toBe(true);
      expect(currentRow.payment_status).toBe("bank_verified");
      currentRow = { ...currentRow, publication_status: body.action };
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    if (url.pathname === "/api/v1/admin/taxonomy" && request.method() === "POST") {
      const body = request.postDataJSON();
      const target = body.kind === "category" ? categories : localities;
      target.push({ slug: body.slug, label: body.label });
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    if (url.pathname === "/api/v1/admin/taxonomy" && request.method() === "DELETE") {
      const body = request.postDataJSON();
      const target = body.kind === "category" ? categories : localities;
      const index = target.findIndex(x => x.slug === body.slug);
      if (index >= 0) target.splice(index, 1);
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    if (url.pathname === "/api/v1/admin/session" && request.method() === "DELETE") {
      expect(request.headers()["x-kdial-csrf"]).toBe(csrf);
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    }
    if (url.pathname.startsWith("/api/v1/admin/") && ["POST","DELETE"].includes(request.method())) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(url.pathname.endsWith("payment-offer") ? { token: "550e8400-e29b-41d4-a716-446655440001" } : { ok: true }) });
    }
    return route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ error: "Not found." }) });
  });
  const nonMysqlCalls: string[] = [];
  page.on("request", request => { if (/supabase|\/rest\/v1\//i.test(request.url())) nonMysqlCalls.push(request.url()); });
  await page.goto("/admin");
  await page.getByLabel("Email").fill("owner@example.test");
  await page.getByLabel("Password").fill("test-only-password-93!");
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await expect(page.getByText("Test Cafe", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Edit draft" }).click();
  await page.getByLabel("Business name").fill("Test Cafe Updated");
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByText("Test Cafe Updated", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Select" }).click();
  await page.getByLabel("Consent reference or rejection reason").fill("Owner verified listing consent");
  await page.getByRole("button", { name: "Save content decision" }).click();
  await expect(page.getByText("Content review saved; publication is still a separate step.")).toBeVisible();
  await page.getByLabel("Package/version").fill("₹501 first-year owner-confirmed package");
  await page.getByLabel("Agreed amount in paise").fill("50100");
  await page.getByLabel("Term starts").fill("2026-10-23");
  await page.getByLabel("Term ends (exclusive)").fill("2027-10-23");
  await page.getByRole("button", { name: "Save confirmed terms" }).click();
  await page.getByLabel("Exact package inclusions").fill("One verified business profile for the first year.");
  await page.getByLabel("Cancellation/refund terms").fill("Refunds apply conditionally if service is deficient or misdescribed.");
  await page.getByRole("button", { name: "Prepare offer preview" }).click();
  await expect(page.getByText(/Customer preview: http:\/\/127\.0\.0\.1:4174\/pay\//)).toBeVisible();
  await page.getByLabel("Actual credited amount (paise)").fill("50100");
  await page.getByLabel("Private reconciliation reference or rejection reason").fill("Synthetic UI test credit verified independently");
  await page.getByRole("button", { name: "Save bank reconciliation" }).click();
  await page.getByLabel("Action").selectOption("published");
  await page.getByRole("button", { name: "Apply publication action" }).click();
  await expect(page.getByText("Publication state updated.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent audit history" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Manage the Kochi directory." })).toBeVisible();
  expect(nonMysqlCalls).toEqual([]);
  expect(seen.filter(x => x.url.endsWith("/dashboard")).length).toBeGreaterThan(0);
  expect(seen.some(x => x.url.endsWith("/listings") && x.method === "POST")).toBe(true);
});

test("MySQL admin UI keeps denied sign-in private", async ({ page }) => {
  await page.route("**/api/v1/admin/session", async route => {
    if (route.request().method() === "GET") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: null, csrfToken: null }) });
    return route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ error: "Email or password is incorrect." }) });
  });
  await page.goto("/admin");
  await page.getByLabel("Email").fill("owner@example.test");
  await page.getByLabel("Password").fill("wrong-password-93!");
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await expect(page.getByRole("alert")).toContainText("Email or password is incorrect.");
  await expect(page.getByRole("heading", { name: "Manage the Kochi directory." })).toBeVisible();
  await expect(page.getByRole("button", { name: "New private draft" })).toHaveCount(0);
});

test("MySQL admin UI manages taxonomy without falling back to Supabase", async ({ page }) => {
  const categories = [{ slug: "cafes", label: "Cafés" }];
  const localities = [{ slug: "kaloor", label: "Kaloor" }];
  await page.route("**/api/v1/admin/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === "/api/v1/admin/session" && request.method() === "GET") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: null, csrfToken: null }) });
    if (url.pathname === "/api/v1/admin/session" && request.method() === "POST") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: { id: listing.id, email: "owner@example.test", role: "owner" }, csrfToken: csrf }) });
    if (url.pathname === "/api/v1/admin/dashboard") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(dashboard(listing, categories, localities)) });
    if (url.pathname === "/api/v1/admin/taxonomy" && request.method() === "POST") { const body=request.postDataJSON(); categories.push({slug:body.slug,label:body.label}); return route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({ok:true})}); }
    if (url.pathname === "/api/v1/admin/taxonomy" && request.method() === "DELETE") { const body=request.postDataJSON(); const i=categories.findIndex(x=>x.slug===body.slug); if(i>=0)categories.splice(i,1); return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({ok:true})}); }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto("/admin");
  await page.getByLabel("Email").fill("owner@example.test");
  await page.getByLabel("Password").fill("test-only-password-93!");
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await page.getByRole("heading", { name: "Directory taxonomy" }).scrollIntoViewIfNeeded();
  await page.getByLabel("Type").selectOption("category");
  await page.getByLabel("Slug").fill("bakeries");
  await page.getByLabel("Display name").fill("Bakeries");
  await page.getByRole("button", { name: "Save taxonomy" }).click();
  await expect(page.getByText("category: Bakeries bakeries")).toBeVisible();
  const entry = page.locator("li").filter({ hasText: "Bakeries" });
  await entry.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("category: Bakeries bakeries")).toHaveCount(0);
});
