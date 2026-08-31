import { Hono } from "hono";
import type { Bindings } from "../types";
import { authOrFail, superAdminOrFail, witraOrFail, portalContextOrFail } from "../lib/middleware";
import { hashPassword, verifyPassword } from "../lib/auth";

const settings = new Hono<{ Bindings: Bindings }>();

settings.get("/witra", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  const { results } = await c.env.DB.prepare("SELECT key, value FROM settings WHERE scope = 'witra'").all();
  const out: Record<string, string> = {};
  (results || []).forEach((r: any) => (out[r.key] = r.value));
  return c.json({ settings: out });
});

settings.put("/witra", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const entries = Object.entries(body || {}).filter(
    ([k, v]) => typeof k === "string" && typeof v === "string"
  ) as [string, string][];

  for (const [key, value] of entries) {
    await c.env.DB.prepare(
      "INSERT INTO settings (scope, key, value) VALUES ('witra', ?, ?) ON CONFLICT(scope, key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP"
    )
      .bind(key, value)
      .run();
  }
  return c.json({ ok: true });
});

// Client-scoped settings (per-tenant key/value pairs, e.g. notification prefs,
// billing info). Works for a client user or a WITRA user currently impersonating.
settings.get("/client", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare("SELECT key, value FROM settings WHERE scope = ?")
    .bind("client:" + ctx.clientId)
    .all();
  const out: Record<string, string> = {};
  (results || []).forEach((r: any) => (out[r.key] = r.value));
  return c.json({ settings: out });
});

settings.put("/client", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const entries = Object.entries(body || {}).filter(
    ([k, v]) => typeof k === "string" && typeof v === "string"
  ) as [string, string][];

  const scope = "client:" + ctx.clientId;
  for (const [key, value] of entries) {
    await c.env.DB.prepare(
      "INSERT INTO settings (scope, key, value) VALUES (?, ?, ?) ON CONFLICT(scope, key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP"
    )
      .bind(scope, key, value)
      .run();
  }
  return c.json({ ok: true });
});

// Change password for the currently authenticated user (works for both witra & client users)
settings.put("/password", async (c) => {
  const session = await authOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const currentPassword = String(body?.currentPassword || "");
  const newPassword = String(body?.newPassword || "");
  if (!currentPassword || !newPassword) {
    return c.json({ error: "Current and new password are required." }, 400);
  }
  if (newPassword.length < 6) {
    return c.json({ error: "New password must be at least 6 characters." }, 400);
  }

  const row = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(session.user.id).first<any>();
  if (!row) return c.json({ error: "User not found." }, 404);

  const valid = await verifyPassword(currentPassword, row.password_hash);
  if (!valid) return c.json({ error: "Current password is incorrect." }, 401);

  const newHash = await hashPassword(newPassword);
  await c.env.DB.prepare("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(newHash, session.user.id)
    .run();

  return c.json({ ok: true });
});

// Update the current user's own profile (name)
settings.put("/profile", async (c) => {
  const session = await authOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const name = String(body?.name || "").trim();
  if (!name) return c.json({ error: "Name is required." }, 400);

  await c.env.DB.prepare("UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(name, session.user.id)
    .run();

  return c.json({ ok: true });
});

export default settings;
