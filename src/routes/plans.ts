import { Hono } from "hono";
import type { Bindings } from "../types";
import { authOrFail, superAdminOrFail } from "../lib/middleware";
import { serializeEntitlementLabel, serializePlan } from "../lib/serialize";
import { toJson } from "../lib/util";

const plans = new Hono<{ Bindings: Bindings }>();

// Reading the plan catalog / entitlement labels must be allowed for ANY
// authenticated user, not just WITRA staff: the client portal itself
// (Dashboard, Subscription, Content Planner, Reports & Performance, ...)
// calls this to check plan entitlements for the signed-in client. Gating
// it to witraOrFail broke the entire client-facing portal — every page
// that calls getPlans() would fail with "This action requires a WITRA
// staff account." Only writing (PUT below) stays Super-Admin-only.
plans.get("/", async (c) => {
  const session = await authOrFail(c);
  if (session instanceof Response) return session;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM plans ORDER BY sort_order ASC"
  ).all();
  return c.json({ plans: (results || []).map(serializePlan) });
});

plans.get("/entitlements", async (c) => {
  const session = await authOrFail(c);
  if (session instanceof Response) return session;
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM entitlement_labels ORDER BY sort_order ASC"
  ).all();
  return c.json({ entitlements: (results || []).map(serializeEntitlementLabel) });
});

plans.put("/:id", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  const id = c.req.param("id");
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const existing = await c.env.DB.prepare("SELECT * FROM plans WHERE id = ?")
    .bind(id)
    .first<any>();
  if (!existing) return c.json({ error: "Plan not found." }, 404);

  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : existing.name;
  const price = typeof body.price === "string" && body.price.trim() ? body.price.trim() : existing.price;
  const entitlements = Array.isArray(body.entitlements) ? body.entitlements : JSON.parse(existing.entitlements);

  await c.env.DB.prepare(
    "UPDATE plans SET name = ?, price = ?, entitlements = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(name, price, toJson(entitlements), id)
    .run();

  const updated = await c.env.DB.prepare("SELECT * FROM plans WHERE id = ?").bind(id).first<any>();
  return c.json({ plan: serializePlan(updated) });
});

export default plans;
