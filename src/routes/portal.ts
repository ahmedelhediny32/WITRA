import { Hono } from "hono";
import type { Bindings } from "../types";
import { portalContextOrFail } from "../lib/middleware";
import { serializeClient } from "../lib/serialize";
import { toJson, newId } from "../lib/util";
import { checkAndSuspendExpired } from "../lib/health";

const portal = new Hono<{ Bindings: Bindings }>();

// Get the full client record for the active portal (client user or WITRA impersonating)
portal.get("/client", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  // Lazy expiry sweep (no cron on hosted deploy) — see src/lib/health.ts.
  await checkAndSuspendExpired(c.env.DB, newId);

  const row = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(ctx.clientId).first<any>();
  if (!row) return c.json({ error: "Client not found." }, 404);
  return c.json({ client: serializeClient(row) });
});

// Update business profile fields
portal.put("/business", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const existing = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(ctx.clientId).first<any>();
  if (!existing) return c.json({ error: "Client not found." }, 404);

  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : existing.name;
  const owner = typeof body.owner === "string" ? body.owner : existing.owner;
  const industry = typeof body.industry === "string" ? body.industry : existing.industry;
  const location = typeof body.location === "string" ? body.location : existing.location;

  await c.env.DB.prepare(
    "UPDATE clients SET name = ?, owner = ?, industry = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(name, owner, industry, location, ctx.clientId)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(ctx.clientId).first<any>();
  return c.json({ client: serializeClient(row) });
});

// Replace social links array
portal.put("/social-links", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const links = Array.isArray(body?.socialLinks) ? body.socialLinks : [];
  const cleaned = links
    .filter((l: any) => l && typeof l === "object")
    .map((l: any) => ({ platform: String(l.platform || "Instagram"), url: String(l.url || "") }));

  await c.env.DB.prepare("UPDATE clients SET social_links = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(toJson(cleaned), ctx.clientId)
    .run();

  return c.json({ socialLinks: cleaned });
});

// Update brand color / logo image (data URL, small images only — stored inline)
portal.put("/brand", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const updates: string[] = [];
  const binds: any[] = [];
  if (typeof body.logoColor === "string" && /^#[0-9a-fA-F]{6}$/.test(body.logoColor)) {
    updates.push("logo_color = ?");
    binds.push(body.logoColor);
  }
  if (typeof body.secondaryColor === "string" && /^#[0-9a-fA-F]{6}$/.test(body.secondaryColor)) {
    updates.push("secondary_color = ?");
    binds.push(body.secondaryColor);
  }
  if (typeof body.logoImage === "string") {
    if (body.logoImage.length > 2_000_000) {
      return c.json({ error: "Image is too large. Please use an image under ~1.5MB." }, 400);
    }
    updates.push("logo_image = ?");
    binds.push(body.logoImage);
  }
  if (updates.length === 0) return c.json({ error: "Nothing to update." }, 400);

  updates.push("updated_at = CURRENT_TIMESTAMP");
  await c.env.DB.prepare(`UPDATE clients SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...binds, ctx.clientId)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(ctx.clientId).first<any>();
  return c.json({ client: serializeClient(row) });
});

export default portal;
