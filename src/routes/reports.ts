import { Hono } from "hono";
import type { Bindings } from "../types";
import { effectiveClientId, portalContextOrFail, witraClientAccessOrFail, witraOrFail } from "../lib/middleware";
import { serializeReport } from "../lib/serialize";
import { requireSession } from "../lib/auth";
import { newId } from "../lib/util";
import { generateNarrative } from "../lib/reportNarrative";

const reports = new Hono<{ Bindings: Bindings }>();

// WITRA: all reports (scoped to assigned clients for team members)
reports.get("/", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let query = "SELECT * FROM reports";
  const binds: any[] = [];
  if (session.user.role !== "Super Admin") {
    const assigned = session.user.assigned_clients;
    if (assigned.length === 0) return c.json({ reports: [] });
    query += ` WHERE client_id IN (${assigned.map(() => "?").join(",")})`;
    binds.push(...assigned);
  }
  query += " ORDER BY created_at DESC";
  const stmt = c.env.DB.prepare(query);
  const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();
  return c.json({ reports: (results || []).map(serializeReport) });
});

// CLIENT PORTAL: only this client's published reports
reports.get("/mine", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM reports WHERE client_id = ? AND status = 'Published' ORDER BY created_at DESC"
  )
    .bind(ctx.clientId)
    .all();
  return c.json({ reports: (results || []).map(serializeReport) });
});

// WITRA: create a new monthly report by entering raw numbers only. The
// narrative (summary / what worked / what didn't / recommendations / next
// month) is always auto-generated from those numbers compared against the
// client's most recent prior report — WITRA never free-types the analysis,
// so every report has a traceable, honest source.
reports.post("/", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const clientId = String(body?.clientId || "").trim();
  const period = String(body?.period || "").trim();
  if (!clientId) return c.json({ error: "Client is required." }, 400);
  if (!period) return c.json({ error: "Period is required (e.g. 'August 2026')." }, 400);

  const accessCheck = await witraClientAccessOrFail(c, clientId);
  if (accessCheck instanceof Response) return accessCheck;

  const clientRow = await c.env.DB.prepare("SELECT id, name FROM clients WHERE id = ?").bind(clientId).first<any>();
  if (!clientRow) return c.json({ error: "Client not found." }, 404);

  const metrics = {
    reach: Math.max(0, Number(body?.metrics?.reach) || 0),
    engagement: Math.max(0, Number(body?.metrics?.engagement) || 0),
    leads: Math.max(0, Math.trunc(Number(body?.metrics?.leads) || 0)),
    cpl: Math.max(0, Number(body?.metrics?.cpl) || 0),
    conversion: Math.max(0, Number(body?.metrics?.conversion) || 0),
    roas: Math.max(0, Number(body?.metrics?.roas) || 0),
  };

  // Find this client's most recent prior report (any status) to diff against.
  const prevRow = await c.env.DB.prepare(
    "SELECT * FROM reports WHERE client_id = ? ORDER BY created_at DESC LIMIT 1"
  )
    .bind(clientId)
    .first<any>();
  const previous = prevRow
    ? {
        reach: prevRow.metric_reach,
        engagement: prevRow.metric_engagement,
        leads: prevRow.metric_leads,
        cpl: prevRow.metric_cpl || 0,
        conversion: prevRow.metric_conversion || 0,
        roas: prevRow.metric_roas,
      }
    : null;

  const narrative = generateNarrative(clientRow.name, period, metrics, previous);
  const status = body?.status === "Published" ? "Published" : "Draft";
  const id = newId("rp");

  await c.env.DB.prepare(
    `INSERT INTO reports (id, client_id, period, status, summary, metric_reach, metric_engagement, metric_leads, metric_roas, metric_cpl, metric_conversion,
      what_worked, what_didnt, recommendations, next_month, entered_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      clientId,
      period,
      status,
      narrative.summary,
      metrics.reach,
      metrics.engagement,
      metrics.leads,
      metrics.roas,
      metrics.cpl,
      metrics.conversion,
      JSON.stringify(narrative.whatWorked),
      JSON.stringify(narrative.whatDidnt),
      JSON.stringify(narrative.recommendations),
      narrative.nextMonth,
      session.user.name
    )
    .run();

  await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
    .bind(newId("act"), clientId, `A ${status.toLowerCase()} performance report for <b>${period.replace(/</g, "&lt;")}</b> was entered.`)
    .run();

  if (status === "Published") {
    await c.env.DB.prepare(
      "INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)"
    )
      .bind(newId("ntf"), `Your ${period} performance report is ready — check Reports & Performance for the full breakdown.`, clientId)
      .run();
    await syncClientKpisIfLatest(c.env.DB, clientId, id, metrics);
  }

  const row = await c.env.DB.prepare("SELECT * FROM reports WHERE id = ?").bind(id).first<any>();
  return c.json({ report: serializeReport(row) }, 201);
});

// WITRA: update a report's raw numbers/status and re-run the narrative
// generator against the same prior-period comparison.
reports.put("/:id", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT * FROM reports WHERE id = ?").bind(id).first<any>();
  if (!existing) return c.json({ error: "Report not found." }, 404);

  const accessCheck = await witraClientAccessOrFail(c, existing.client_id);
  if (accessCheck instanceof Response) return accessCheck;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const clientRow = await c.env.DB.prepare("SELECT id, name FROM clients WHERE id = ?").bind(existing.client_id).first<any>();
  const period = String(body?.period || existing.period).trim() || existing.period;
  const metrics = {
    reach: body?.metrics?.reach !== undefined ? Math.max(0, Number(body.metrics.reach) || 0) : existing.metric_reach,
    engagement: body?.metrics?.engagement !== undefined ? Math.max(0, Number(body.metrics.engagement) || 0) : existing.metric_engagement,
    leads: body?.metrics?.leads !== undefined ? Math.max(0, Math.trunc(Number(body.metrics.leads)) || 0) : existing.metric_leads,
    cpl: body?.metrics?.cpl !== undefined ? Math.max(0, Number(body.metrics.cpl) || 0) : existing.metric_cpl || 0,
    conversion: body?.metrics?.conversion !== undefined ? Math.max(0, Number(body.metrics.conversion) || 0) : existing.metric_conversion || 0,
    roas: body?.metrics?.roas !== undefined ? Math.max(0, Number(body.metrics.roas) || 0) : existing.metric_roas,
  };
  const status = body?.status === "Published" || body?.status === "Draft" ? body.status : existing.status;

  const prevRow = await c.env.DB.prepare(
    "SELECT * FROM reports WHERE client_id = ? AND id != ? ORDER BY created_at DESC LIMIT 1"
  )
    .bind(existing.client_id, id)
    .first<any>();
  const previous = prevRow
    ? {
        reach: prevRow.metric_reach,
        engagement: prevRow.metric_engagement,
        leads: prevRow.metric_leads,
        cpl: prevRow.metric_cpl || 0,
        conversion: prevRow.metric_conversion || 0,
        roas: prevRow.metric_roas,
      }
    : null;

  const narrative = generateNarrative(clientRow ? clientRow.name : "This client", period, metrics, previous);
  const wasPublished = existing.status === "Published";

  await c.env.DB.prepare(
    `UPDATE reports SET period = ?, status = ?, summary = ?, metric_reach = ?, metric_engagement = ?, metric_leads = ?, metric_roas = ?,
       metric_cpl = ?, metric_conversion = ?, what_worked = ?, what_didnt = ?, recommendations = ?, next_month = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(
      period,
      status,
      narrative.summary,
      metrics.reach,
      metrics.engagement,
      metrics.leads,
      metrics.roas,
      metrics.cpl,
      metrics.conversion,
      JSON.stringify(narrative.whatWorked),
      JSON.stringify(narrative.whatDidnt),
      JSON.stringify(narrative.recommendations),
      narrative.nextMonth,
      id
    )
    .run();

  if (status === "Published" && !wasPublished) {
    await c.env.DB.prepare(
      "INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)"
    )
      .bind(newId("ntf"), `Your ${period} performance report is ready — check Reports & Performance for the full breakdown.`, existing.client_id)
      .run();
  }
  if (status === "Published") {
    await syncClientKpisIfLatest(c.env.DB, existing.client_id, id, metrics);
  }

  const row = await c.env.DB.prepare("SELECT * FROM reports WHERE id = ?").bind(id).first<any>();
  return c.json({ report: serializeReport(row) });
});

// Keeps the client's live KPI snapshot (shown on their Dashboard) in sync
// with their most recently PUBLISHED report — only if the report we just
// touched is in fact the latest one, so an edit to an older report never
// overwrites newer numbers.
async function syncClientKpisIfLatest(
  db: D1Database,
  clientId: string,
  reportId: string,
  metrics: { leads: number; conversion: number; cpl: number; roas: number }
): Promise<void> {
  const latest = await db
    .prepare("SELECT id FROM reports WHERE client_id = ? AND status = 'Published' ORDER BY created_at DESC LIMIT 1")
    .bind(clientId)
    .first<any>();
  if (!latest || latest.id !== reportId) return;
  await db
    .prepare(
      "UPDATE clients SET kpi_leads = ?, kpi_conversion = ?, kpi_cpl = ?, kpi_roas = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
    .bind(metrics.leads, `${metrics.conversion}%`, metrics.cpl, metrics.roas, clientId)
    .run();
}

// WITRA: delete a draft report (published reports are kept as historical record).
reports.delete("/:id", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT * FROM reports WHERE id = ?").bind(id).first<any>();
  if (!existing) return c.json({ error: "Report not found." }, 404);

  const accessCheck = await witraClientAccessOrFail(c, existing.client_id);
  if (accessCheck instanceof Response) return accessCheck;

  if (existing.status === "Published") {
    return c.json({ error: "Published reports cannot be deleted — edit it instead if the numbers were wrong." }, 400);
  }

  await c.env.DB.prepare("DELETE FROM reports WHERE id = ?").bind(id).run();
  return c.json({ ok: true });
});

reports.get("/:id", async (c) => {
  const id = c.req.param("id");
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Not authenticated. Please sign in again." }, 401);

  const row = await c.env.DB.prepare("SELECT * FROM reports WHERE id = ?").bind(id).first<any>();
  if (!row) return c.json({ error: "Report not found." }, 404);

  if (session.user.user_type === "witra") {
    if (session.user.role !== "Super Admin" && !session.user.assigned_clients.includes(row.client_id)) {
      return c.json({ error: "You do not have access to this report." }, 403);
    }
    return c.json({ report: serializeReport(row) });
  }

  const clientId = effectiveClientId(session);
  if (!clientId || row.client_id !== clientId || row.status !== "Published") {
    return c.json({ error: "Report not found." }, 404);
  }
  return c.json({ report: serializeReport(row) });
});

export default reports;
