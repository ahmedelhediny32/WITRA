import { Hono } from "hono";
import type { Bindings } from "../types";
import { portalContextOrFail, witraOrFail } from "../lib/middleware";
import { serializeActivity } from "../lib/serialize";

const activities = new Hono<{ Bindings: Bindings }>();

activities.get("/", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let query = "SELECT * FROM activities";
  const binds: any[] = [];
  if (session.user.role !== "Super Admin") {
    const assigned = session.user.assigned_clients;
    if (assigned.length === 0) return c.json({ activities: [] });
    query += ` WHERE client_id IN (${assigned.map(() => "?").join(",")})`;
    binds.push(...assigned);
  }
  query += " ORDER BY created_at DESC LIMIT 200";
  const stmt = c.env.DB.prepare(query);
  const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();
  return c.json({ activities: (results || []).map(serializeActivity) });
});

activities.get("/mine", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE client_id = ? ORDER BY created_at DESC LIMIT 100"
  )
    .bind(ctx.clientId)
    .all();
  return c.json({ activities: (results || []).map(serializeActivity) });
});

export default activities;
