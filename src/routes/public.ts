import { Hono } from "hono";
import type { Bindings } from "../types";
import { witraOrFail } from "../lib/middleware";
import { newId, toJson } from "../lib/util";

const publicRoutes = new Hono<{ Bindings: Bindings }>();

publicRoutes.get("/diagnostic", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM diagnostic_leads ORDER BY created_at DESC"
  ).all();
  return c.json({ leads: results || [] });
});

publicRoutes.put("/diagnostic/:id", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;
  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT id FROM diagnostic_leads WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Diagnostic lead not found." }, 404);

  let body: any;
  try { body = await c.req.json(); } catch { return c.json({ error: "Invalid request body." }, 400); }
  const statuses = ["New", "Contacted", "Qualified", "Diagnostic Booked", "Won", "Lost"];
  const status = String(body?.status || "");
  if (!statuses.includes(status)) return c.json({ error: "Invalid lead status." }, 400);
  await c.env.DB.prepare("UPDATE diagnostic_leads SET status = ? WHERE id = ?").bind(status, id).run();
  return c.json({ ok: true });
});

publicRoutes.get("/catalog", async (c) => {
  const [services, plans] = await Promise.all([
    c.env.DB.prepare("SELECT * FROM services WHERE status != 'archived' ORDER BY created_at ASC").all(),
    c.env.DB.prepare("SELECT * FROM plans ORDER BY sort_order ASC").all()
  ]);

  return c.json({
    services: (services.results || []).map(serializePublicService),
    plans: (plans.results || []).map(serializePublicPlan)
  });
});

publicRoutes.post("/diagnostic", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const name = String(body?.name || "").trim();
  const businessName = String(body?.businessName || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const phone = String(body?.phone || "").trim();
  const challenge = String(body?.challenge || "").trim();
  if (!name || !businessName || !email || !phone || !challenge) {
    return c.json({ error: "Name, business, email, phone, and challenge are required." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "Please enter a valid email address." }, 400);
  }

  const id = newId("lead");
  await c.env.DB.prepare(
    `INSERT INTO diagnostic_leads (id, name, business_name, email, phone, industry, team_size, challenge, budget, preferred_time, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    name,
    businessName,
    email,
    phone,
    String(body?.industry || "").trim(),
    String(body?.teamSize || "").trim(),
    challenge,
    String(body?.budget || "").trim(),
    String(body?.preferredTime || "").trim(),
    "public-website"
  ).run();

  return c.json({ ok: true, leadId: id }, 201);
});

function parseJson(value: unknown, fallback: unknown[] = []) {
  try { return JSON.parse(String(value || "")); } catch { return fallback; }
}

function serializePublicService(row: any) {
  return {
    id: row.id,
    name: row.name,
    nameAr: row.name_ar || "",
    category: row.category || "",
    headline: row.headline || "",
    headlineAr: row.headline_ar || "",
    whatYouGet: parseJson(row.what_you_get),
    whatYouGetAr: parseJson(row.what_you_get_ar),
    price: row.price || "",
    standalone: Boolean(row.standalone)
  };
}

function serializePublicPlan(row: any) {
  return {
    id: row.id,
    name: row.name,
    nameAr: row.name_ar || "",
    price: row.price || "",
    entitlements: parseJson(row.entitlements),
    sortOrder: row.sort_order || 0
  };
}

export default publicRoutes;