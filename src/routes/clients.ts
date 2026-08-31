import { Hono } from "hono";
import type { Bindings } from "../types";
import {
  authOrFail,
  superAdminOrFail,
  witraClientAccessOrFail,
  witraOrFail,
} from "../lib/middleware";
import { serializeClient } from "../lib/serialize";
import { hashPassword } from "../lib/auth";
import { isValidEmail, newId, todayIso } from "../lib/util";

const clients = new Hono<{ Bindings: Bindings }>();

clients.get("/", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let query = "SELECT * FROM clients WHERE archived = 0";
  const binds: any[] = [];
  if (session.user.role !== "Super Admin") {
    const assigned = session.user.assigned_clients;
    if (assigned.length === 0) {
      return c.json({ clients: [] });
    }
    query += ` AND id IN (${assigned.map(() => "?").join(",")})`;
    binds.push(...assigned);
  }
  query += " ORDER BY created_at DESC";

  const stmt = c.env.DB.prepare(query);
  const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();
  return c.json({ clients: (results || []).map((r: any) => serializeClient(r)) });
});

clients.post("/", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const name = String(body?.name || "").trim();
  if (!name) return c.json({ error: "Business name is required." }, 400);

  const owner = String(body?.owner || "").trim() || "—";
  const industry = String(body?.industry || "").trim() || "—";
  const location = String(body?.location || "").trim() || "—";
  const email = String(body?.portalEmail || "").trim().toLowerCase();
  const planId = String(body?.planId || "core");
  const mrr = Number.isFinite(Number(body?.mrr)) ? Math.max(0, Math.trunc(Number(body.mrr))) : 0;

  if (email && !isValidEmail(email)) {
    return c.json({ error: "Portal email is not valid." }, 400);
  }
  if (email) {
    const existingUser = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(email)
      .first();
    if (existingUser) {
      return c.json({ error: "A user with that portal email already exists." }, 409);
    }
  }
  const planRow = await c.env.DB.prepare("SELECT id FROM plans WHERE id = ?").bind(planId).first();
  if (!planRow) return c.json({ error: "Selected plan does not exist." }, 400);

  const PALETTE = ["#74254E", "#B7791F", "#2F6F5E", "#5B3A80", "#AF3E38", "#3C6E97", "#C97B3D"];
  const countRow = await c.env.DB.prepare("SELECT COUNT(*) as n FROM clients").first<any>();
  const logoColor = PALETTE[(countRow?.n || 0) % PALETTE.length];

  if (body?.portalPassword !== undefined && String(body.portalPassword).trim().length > 0 && String(body.portalPassword).trim().length < 6) {
    return c.json({ error: "Portal password must be at least 6 characters." }, 400);
  }

  const id = newId("cl");
  const renewal = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const subscriptionStart = todayIso();
  // Contract value starts at 0 — see src/lib/health.ts: it accrues honestly
  // as mrr * months actually elapsed, never assumes a full year up front.
  const contractValue = 0;

  await c.env.DB.prepare(
    `INSERT INTO clients (id, name, owner, industry, location, logo_color, plan_id, mrr, health, health_reason,
      active_services, renewal, contract_value, subscription_start, last_activity, billing_status,
      kpi_leads, kpi_conversion, kpi_cpl, kpi_roas,
      exec_content_done, exec_content_planned, exec_stories_done, exec_stories_planned, exec_offline_done, exec_offline_planned, exec_note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Onboarding', 'Just onboarded — health will be calculated once execution begins.',
      '[]', ?, ?, ?, 'Just now', 'Trial',
      0, '0%', 0, 0,
      0, 0, 0, 0, 0, 0, 'Onboarding in progress — no content calendar set up yet.')`
  )
    .bind(id, name, owner, industry, location, logoColor, planId, mrr, renewal, contractValue, subscriptionStart)
    .run();

  if (email) {
    // WITRA sets the client's portal password directly when creating the account.
    const password = String(body?.portalPassword || "").trim() || "demo123";
    const passwordHash = await hashPassword(password);
    await c.env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, name, user_type, role, client_id) VALUES (?, ?, ?, ?, 'client', 'Owner', ?)`
    )
      .bind(newId("u"), email, passwordHash, owner, id)
      .run();
  }

  await c.env.DB.prepare(
    "INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)"
  )
    .bind(newId("act"), id, `<b>${name.replace(/</g, "&lt;")}</b> was added as a new client.`)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(id).first<any>();
  return c.json({ client: serializeClient(row) }, 201);
});

// Remove (archive) a client. Soft-delete: keeps all historical data, just
// hides it from every list. Only a Super Admin may do this.
clients.delete("/:id", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT id, name FROM clients WHERE id = ?").bind(id).first<any>();
  if (!existing) return c.json({ error: "Client not found." }, 404);

  await c.env.DB.prepare("UPDATE clients SET archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  await c.env.DB.prepare("UPDATE users SET active = 0 WHERE client_id = ?").bind(id).run();
  await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
    .bind(newId("act"), id, `<b>${String(existing.name).replace(/</g, "&lt;")}</b> was removed by WITRA.`)
    .run();

  return c.json({ ok: true });
});

// Resubscribe a suspended client: restores the services they had before
// suspension, resets billing/subscription clock, and clears the warning.
clients.post("/:id/resubscribe", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(id).first<any>();
  if (!existing) return c.json({ error: "Client not found." }, 404);

  const renewal = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  await c.env.DB.prepare(
    `UPDATE clients SET
       subscription_status = 'active',
       active_services = active_services_before_suspend,
       active_services_before_suspend = '[]',
       billing_status = 'Active',
       renewal = ?,
       subscription_start = ?,
       last_expiry_notice = NULL,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(renewal, todayIso(), id)
    .run();

  await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
    .bind(newId("act"), id, `Subscription <b>renewed</b> — services reactivated.`)
    .run();
  await c.env.DB.prepare(
    "INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)"
  )
    .bind(newId("ntf"), "Your subscription has been renewed — your services are active again. Welcome back!", id)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(id).first<any>();
  return c.json({ client: serializeClient(row) });
});

clients.get("/:id", async (c) => {
  const id = c.req.param("id");
  const session = await witraClientAccessOrFail(c, id);
  if (session instanceof Response) return session;

  const row = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(id).first<any>();
  if (!row) return c.json({ error: "Client not found." }, 404);
  return c.json({ client: serializeClient(row, { includeInternal: true }) });
});

clients.put("/:id/notes", async (c) => {
  const id = c.req.param("id");
  const session = await witraClientAccessOrFail(c, id);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const notes = String(body?.notes ?? "");

  const existing = await c.env.DB.prepare("SELECT id FROM clients WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Client not found." }, 404);

  await c.env.DB.prepare(
    "UPDATE clients SET internal_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(notes, id)
    .run();
  return c.json({ ok: true });
});

clients.get("/export/csv", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let query = "SELECT * FROM clients WHERE archived = 0";
  const binds: any[] = [];
  if (session.user.role !== "Super Admin") {
    const assigned = session.user.assigned_clients;
    if (assigned.length === 0) {
      query = "SELECT * FROM clients WHERE 0 = 1";
    } else {
      query += ` AND id IN (${assigned.map(() => "?").join(",")})`;
      binds.push(...assigned);
    }
  }
  const stmt = c.env.DB.prepare(query);
  const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();

  const planRows = await c.env.DB.prepare("SELECT id, name FROM plans").all();
  const planMap: Record<string, string> = {};
  (planRows.results || []).forEach((p: any) => (planMap[p.id] = p.name));

  const header = ["Business Name", "Owner", "Industry", "Plan", "MRR", "Health", "Renewal", "Billing Status"];
  const rows = [header];
  (results || []).forEach((r: any) => {
    rows.push([
      r.name,
      r.owner,
      r.industry,
      planMap[r.plan_id] || r.plan_id,
      String(r.mrr),
      r.health,
      r.renewal,
      r.billing_status,
    ]);
  });
  const csv = rows
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  c.header("Content-Type", "text/csv; charset=utf-8");
  c.header("Content-Disposition", 'attachment; filename="witra_clients_export.csv"');
  return c.body(csv);
});

export default clients;
