import { Hono } from "hono";
import type { Bindings } from "../types";
import { authOrFail, superAdminOrFail, witraOrFail } from "../lib/middleware";
import { serializeService } from "../lib/serialize";
import { newId, toJson } from "../lib/util";

const services = new Hono<{ Bindings: Bindings }>();

// Any authenticated user (admin or client) can view the service catalogue.
services.get("/", async (c) => {
  const session = await authOrFail(c);
  if (session instanceof Response) return session;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM services ORDER BY created_at ASC"
  ).all();
  return c.json({ services: (results || []).map(serializeService) });
});

services.post("/", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const name = String(body?.name || "").trim();
  if (!name) return c.json({ error: "Service name is required." }, 400);

  const id = newId("svc");
  const category = String(body?.category || "");
  const headline = String(body?.headline || "");
  const whatYouGet = Array.isArray(body?.whatYouGet) ? body.whatYouGet : [];
  const price = String(body?.price || "");

  await c.env.DB.prepare(
    `INSERT INTO services (id, name, category, headline, what_you_get, why_you_need_it, price, standalone, included_in, status)
     VALUES (?, ?, ?, ?, ?, '', ?, 1, '[]', 'draft')`
  )
    .bind(id, name, category, headline, toJson(whatYouGet), price)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM services WHERE id = ?").bind(id).first<any>();
  return c.json({ service: serializeService(row) }, 201);
});

services.put("/:id", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT * FROM services WHERE id = ?")
    .bind(id)
    .first<any>();
  if (!existing) return c.json({ error: "Service not found." }, 404);

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : existing.name;
  const category = typeof body.category === "string" ? body.category : existing.category;
  const headline = typeof body.headline === "string" ? body.headline : existing.headline;
  const whatYouGet = Array.isArray(body.whatYouGet) ? body.whatYouGet : JSON.parse(existing.what_you_get);
  const price = typeof body.price === "string" ? body.price : existing.price;

  await c.env.DB.prepare(
    `UPDATE services SET name = ?, category = ?, headline = ?, what_you_get = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  )
    .bind(name, category, headline, toJson(whatYouGet), price, id)
    .run();

  const updated = await c.env.DB.prepare("SELECT * FROM services WHERE id = ?").bind(id).first<any>();
  return c.json({ service: serializeService(updated) });
});

export default services;
