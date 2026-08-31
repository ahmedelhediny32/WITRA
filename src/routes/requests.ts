import { Hono } from "hono";
import type { Bindings } from "../types";
import { portalContextOrFail, witraOrFail } from "../lib/middleware";
import { serviceRequest } from "../lib/serialize";
import { newId, todayIso } from "../lib/util";
import { witraCanAccessClient } from "../lib/auth";

const requests = new Hono<{ Bindings: Bindings }>();

/** Notify the WITRA team (shows up in the admin bell). */
async function notifyWitra(db: D1Database, clientId: string, text: string): Promise<void> {
  await db
    .prepare("INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'witra', ?)")
    .bind(newId("ntf"), text, clientId)
    .run();
}

/** Notify a specific client (shows up in that client's portal bell). */
async function notifyClient(db: D1Database, clientId: string, text: string): Promise<void> {
  await db
    .prepare("INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)")
    .bind(newId("ntf"), text, clientId)
    .run();
}

// WITRA: list all service requests (scoped to assigned clients for team members)
requests.get("/", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let query = "SELECT * FROM service_requests";
  const binds: any[] = [];
  if (session.user.role !== "Super Admin") {
    const assigned = session.user.assigned_clients;
    if (assigned.length === 0) return c.json({ requests: [] });
    query += ` WHERE client_id IN (${assigned.map(() => "?").join(",")})`;
    binds.push(...assigned);
  }
  query += " ORDER BY created_at DESC";
  const stmt = c.env.DB.prepare(query);
  const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();
  return c.json({ requests: (results || []).map(serviceRequest) });
});

// WITRA: approve/reject a request
requests.put("/:id", async (c) => {
  const id = c.req.param("id");
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  const existing = await c.env.DB.prepare("SELECT * FROM service_requests WHERE id = ?")
    .bind(id)
    .first<any>();
  if (!existing) return c.json({ error: "Request not found." }, 404);

  if (!witraCanAccessClient(session.user, existing.client_id)) {
    return c.json({ error: "You do not have access to this client." }, 403);
  }

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const status = String(body?.status || "");
  if (!["Approved", "Rejected", "Reviewing"].includes(status)) {
    return c.json({ error: "Invalid status." }, 400);
  }
  const notes = typeof body?.notes === "string" ? body.notes : existing.notes;
  const previousStatus = existing.status;

  await c.env.DB.prepare(
    "UPDATE service_requests SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(status, notes, id)
    .run();

  if (status === "Approved" && previousStatus !== "Approved") {
    const client = await c.env.DB.prepare("SELECT * FROM clients WHERE id = ?")
      .bind(existing.client_id)
      .first<any>();
    if (client) {
      if (existing.request_type === "upgrade" && existing.target_plan_id) {
        await c.env.DB.prepare("UPDATE clients SET plan_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
          .bind(existing.target_plan_id, client.id)
          .run();
      } else {
        const service = await c.env.DB.prepare("SELECT id FROM services WHERE name = ?")
          .bind(existing.service_name)
          .first<any>();
        if (service) {
          const activeServices: string[] = JSON.parse(client.active_services || "[]");
          if (!activeServices.includes(service.id)) {
            activeServices.push(service.id);
            await c.env.DB.prepare(
              "UPDATE clients SET active_services = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            )
              .bind(JSON.stringify(activeServices), client.id)
              .run();
          }
        }
      }
      await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
        .bind(
          newId("act"),
          client.id,
          `<b>${existing.service_name}</b> request was approved by WITRA.`
        )
        .run();
      await notifyClient(c.env.DB, client.id, `Your request for <b>${existing.service_name}</b> was approved.`);
    }
  } else if (status === "Rejected" && previousStatus !== "Rejected") {
    // Previously this branch did nothing at all — no activity entry, no notification.
    // A rejected request silently sat there with no trace for either side.
    await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
      .bind(
        newId("act"),
        existing.client_id,
        `<b>${existing.service_name}</b> request was rejected by WITRA.`
      )
      .run();
    await notifyClient(
      c.env.DB,
      existing.client_id,
      `Your request for <b>${existing.service_name}</b> was rejected.${notes ? " Note: " + notes : ""}`
    );
  }

  const updated = await c.env.DB.prepare("SELECT * FROM service_requests WHERE id = ?")
    .bind(id)
    .first<any>();
  return c.json({ request: serviceRequest(updated) });
});

// CLIENT PORTAL: list this client's requests
requests.get("/mine", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM service_requests WHERE client_id = ? ORDER BY created_at DESC"
  )
    .bind(ctx.clientId)
    .all();
  return c.json({ requests: (results || []).map(serviceRequest) });
});

// CLIENT PORTAL: request a locked service
requests.post("/service", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const serviceId = String(body?.serviceId || "");
  const service = await c.env.DB.prepare("SELECT * FROM services WHERE id = ?")
    .bind(serviceId)
    .first<any>();
  if (!service) return c.json({ error: "Service not found." }, 404);

  const id = newId("req");
  await c.env.DB.prepare(
    `INSERT INTO service_requests (id, client_id, service_name, requested_date, status, notes, request_type)
     VALUES (?, ?, ?, ?, 'Requested', '', 'service')`
  )
    .bind(id, ctx.clientId, service.name, todayIso())
    .run();

  await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
    .bind(id + "_act", ctx.clientId, `Service request for <b>${service.name}</b> submitted.`)
    .run();

  // This was the missing link: nothing ever wrote to the notifications table,
  // so the WITRA admin bell had no way of ever lighting up.
  const client = await c.env.DB.prepare("SELECT name FROM clients WHERE id = ?").bind(ctx.clientId).first<any>();
  await notifyWitra(
    c.env.DB,
    ctx.clientId,
    `<b>${client ? client.name : "A client"}</b> requested <b>${service.name}</b>.`
  );

  const row = await c.env.DB.prepare("SELECT * FROM service_requests WHERE id = ?").bind(id).first<any>();
  return c.json({ request: serviceRequest(row) }, 201);
});

// CLIENT PORTAL: request a plan upgrade
requests.post("/upgrade", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const targetPlanId = String(body?.targetPlanId || "");
  const plan = await c.env.DB.prepare("SELECT * FROM plans WHERE id = ?").bind(targetPlanId).first<any>();
  if (!plan) return c.json({ error: "Plan not found." }, 404);

  const id = newId("req");
  await c.env.DB.prepare(
    `INSERT INTO service_requests (id, client_id, service_name, requested_date, status, notes, request_type, target_plan_id)
     VALUES (?, ?, ?, ?, 'Requested', '', 'upgrade', ?)`
  )
    .bind(id, ctx.clientId, `Upgrade to ${plan.name}`, todayIso(), targetPlanId)
    .run();

  // This route previously logged nothing at all — no activity, no notification —
  // unlike the /service route right above it. Same treatment now for both.
  const client = await c.env.DB.prepare("SELECT name FROM clients WHERE id = ?").bind(ctx.clientId).first<any>();
  await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
    .bind(id + "_act", ctx.clientId, `Upgrade request to <b>${plan.name}</b> submitted.`)
    .run();
  await notifyWitra(
    c.env.DB,
    ctx.clientId,
    `<b>${client ? client.name : "A client"}</b> requested an upgrade to <b>${plan.name}</b>.`
  );

  const row = await c.env.DB.prepare("SELECT * FROM service_requests WHERE id = ?").bind(id).first<any>();
  return c.json({ request: serviceRequest(row) }, 201);
});

export default requests;
