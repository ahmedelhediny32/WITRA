import { Hono } from "hono";
import type { Bindings } from "../types";
import { witraOrFail, portalContextOrFail } from "../lib/middleware";
import { serializeNotification } from "../lib/serialize";

const notifications = new Hono<{ Bindings: Bindings }>();

// WITRA: global notification feed (service requests, upgrade requests, etc.)
notifications.get("/", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM notifications WHERE target_user_type = 'witra' ORDER BY created_at DESC LIMIT 30"
  ).all();
  return c.json({ notifications: (results || []).map(serializeNotification) });
});

notifications.put("/read-all", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  await c.env.DB.prepare(
    "UPDATE notifications SET read = 1 WHERE target_user_type = 'witra'"
  ).run();
  return c.json({ ok: true });
});

// CLIENT PORTAL: this client's own notifications (request approved/rejected, etc.)
notifications.get("/mine", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM notifications WHERE target_user_type = 'client' AND client_id = ? ORDER BY created_at DESC LIMIT 30"
  )
    .bind(ctx.clientId)
    .all();
  return c.json({ notifications: (results || []).map(serializeNotification) });
});

notifications.put("/mine/read-all", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  await c.env.DB.prepare(
    "UPDATE notifications SET read = 1 WHERE target_user_type = 'client' AND client_id = ?"
  )
    .bind(ctx.clientId)
    .run();
  return c.json({ ok: true });
});

export default notifications;
