import { Hono } from "hono";
import type { Bindings } from "../types";
import { effectiveClientId, portalContextOrFail, witraClientAccessOrFail, witraOrFail } from "../lib/middleware";
import { serializeReport } from "../lib/serialize";
import { requireSession } from "../lib/auth";
import { newId, toJson } from "../lib/util";
import { generateNarrativeV2 } from "../lib/reportNarrative";
import type { ExtendedReportMetrics, PreviousReportMetrics } from "../lib/reportNarrative";
import { validateReportData } from "../lib/reportValidation";
import { calculateMetrics } from "../lib/reportCalculations";
import type { RawMetrics } from "../lib/reportCalculations";

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

// CLIENT PORTAL: only this client's published reports with Client visibility
reports.get("/mine", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM reports WHERE client_id = ? AND status = 'Published' AND (visibility = 'Client' OR visibility = '') ORDER BY created_at DESC"
  )
    .bind(ctx.clientId)
    .all();
  return c.json({ reports: (results || []).map(serializeReport) });
});

// WITRA: validate report data without saving (preview endpoint)
reports.post("/validate", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const metrics = extractMetrics(body?.metrics);
  const clientId = String(body?.clientId || "").trim();
  const period = String(body?.period || "").trim();
  const channel = String(body?.channel || "").trim();

  // Check if first report
  let isFirstReport = true;
  let existingReportForPeriod = false;
  if (clientId) {
    const prevRow = await c.env.DB.prepare(
      "SELECT id FROM reports WHERE client_id = ? LIMIT 1"
    ).bind(clientId).first<any>();
    isFirstReport = !prevRow;

    if (period) {
      const dupRow = await c.env.DB.prepare(
        "SELECT id FROM reports WHERE client_id = ? AND period = ? AND channel = ? LIMIT 1"
      ).bind(clientId, period, channel).first<any>();
      existingReportForPeriod = !!dupRow;
    }
  }

  const validation = validateReportData(metrics as RawMetrics, {
    isFirstReport,
    existingReportForPeriod,
  });

  return c.json({ validation });
});

// WITRA: create a new monthly report. The narrative is auto-generated from
// validated, calculated metrics through the analysis pipeline.
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

  const metrics = extractMetrics(body?.metrics);
  const channel = String(body?.channel || "").trim();
  const serviceType = String(body?.serviceType || "").trim();
  const campaign = String(body?.campaign || "").trim();
  const visibility = body?.visibility === "Internal" ? "Internal" : "Client";
  const notifyClient = body?.notifyClient ? 1 : 0;
  const status = body?.status === "Published" ? "Published" : "Draft";

  // Check for duplicate period
  const dupRow = await c.env.DB.prepare(
    "SELECT id, period FROM reports WHERE client_id = ? AND period = ? AND channel = ?"
  ).bind(clientId, period, channel).first<any>();
  if (dupRow) {
    return c.json({ error: "A report already exists for this client, period, and channel." }, 409);
  }

  // Run validation
  const isFirstReport = !(await c.env.DB.prepare(
    "SELECT id FROM reports WHERE client_id = ? LIMIT 1"
  ).bind(clientId).first<any>());

  const validation = validateReportData(metrics as RawMetrics, {
    isFirstReport,
    existingReportForPeriod: false,
  });

  // Block publishing if critical errors exist
  if (status === "Published" && !validation.canPublish) {
    return c.json({
      error: "Cannot publish: critical validation errors must be fixed first.",
      validation,
    }, 400);
  }

  // Find previous report for comparison
  const prevRow = await c.env.DB.prepare(
    "SELECT * FROM reports WHERE client_id = ? ORDER BY created_at DESC LIMIT 1"
  ).bind(clientId).first<any>();

  const previous = prevRow ? extractPreviousMetrics(prevRow) : null;

  const calculated = calculateStoredMetrics(metrics);

  // Generate narrative through the full pipeline using the same calculated
  // values that will be persisted, while retaining raw-value validation.
  const narrative = generateNarrativeV2(clientRow.name, period, calculated, previous, {
    isFirstReport,
    existingReportForPeriod: false,
    validation,
  });

  const id = newId("rp");
  const publishedAt = status === "Published" ? new Date().toISOString() : null;

  await c.env.DB.prepare(
    `INSERT INTO reports (
      id, client_id, period, status, summary,
      metric_reach, metric_impressions, metric_engagement, metric_engagement_rate,
      metric_leads, metric_conversions, metric_conversion, metric_ad_spend,
      metric_revenue, metric_cpl, metric_roas,
      channel, service_type, campaign, visibility, notify_client,
      what_worked, what_didnt, what_needs_attention, recommendations,
      next_month, next_month_strategy,
      data_quality, anomalies,
      version, published_at, entered_by, updated_by,
      comparison_status, previous_report_id, mom_changes
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?,
      ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?
    )`
  ).bind(
    id, clientId, period, status, narrative.summary,
    calculated.reach ?? 0, calculated.impressions, calculated.engagement ?? 0, calculated.engagementRate,
    calculated.leads ?? 0, calculated.conversions, calculated.conversionRate ?? 0, calculated.adSpend,
    calculated.revenue, calculated.cpl ?? 0, calculated.roas ?? 0,
    channel, serviceType, campaign, visibility, notifyClient,
    JSON.stringify(narrative.whatWorked),
    JSON.stringify(narrative.whatNeedsAttention), // stored in what_didnt for backward compat
    JSON.stringify(narrative.whatNeedsAttention),
    JSON.stringify(narrative.recommendations),
    narrative.nextMonth,
    JSON.stringify(narrative.nextMonthStrategy),
    narrative.dataQuality,
    JSON.stringify(narrative.anomalies),
    1, publishedAt, session.user.name, session.user.name,
    narrative.comparisonStatus, prevRow?.id || null, JSON.stringify(narrative.momChanges)
  ).run();

  // Activity log
  await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
    .bind(newId("act"), clientId, `A ${status.toLowerCase()} performance report for <b>${period.replace(/</g, "&lt;")}</b> was entered.`)
    .run();

  // Notifications and KPI sync
  if (status === "Published") {
    if (visibility === "Client" && notifyClient) {
      await c.env.DB.prepare(
        "INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)"
      ).bind(newId("ntf"), `Your ${period} performance report is ready — check Reports & Performance for the full breakdown.`, clientId)
        .run();
    }
    await syncClientKpisFromLatest(c.env.DB, clientId);
  }

  const row = await c.env.DB.prepare("SELECT * FROM reports WHERE id = ?").bind(id).first<any>();
  return c.json({ report: serializeReport(row), validation }, 201);
});

// WITRA: update a report's raw numbers/status and re-run the narrative
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

  // Merge metrics: use new values if provided, fall back to existing
  const metrics: ExtendedReportMetrics = {
    reach: body?.metrics?.reach !== undefined ? toNumOrNull(body.metrics.reach) : (existing.metric_reach ?? null),
    impressions: body?.metrics?.impressions !== undefined ? toNumOrNull(body.metrics.impressions) : (existing.metric_impressions ?? null),
    engagement: body?.metrics?.engagement !== undefined ? toNumOrNull(body.metrics.engagement) : (existing.metric_engagement ?? null),
    engagementRate: body?.metrics?.engagementRate !== undefined ? toNumOrNull(body.metrics.engagementRate) : (existing.metric_engagement_rate ?? null),
    leads: body?.metrics?.leads !== undefined ? toIntegerOrNull(body.metrics.leads) : (existing.metric_leads ?? null),
    conversions: body?.metrics?.conversions !== undefined ? toIntegerOrNull(body.metrics.conversions) : (existing.metric_conversions ?? null),
    conversionRate: body?.metrics?.conversionRate !== undefined
      ? toNumOrNull(body.metrics.conversionRate)
      : body?.metrics?.conversion !== undefined
        ? toNumOrNull(body.metrics.conversion)
        : (existing.metric_conversion ?? null),
    adSpend: body?.metrics?.adSpend !== undefined ? toNumOrNull(body.metrics.adSpend) : (existing.metric_ad_spend ?? null),
    revenue: body?.metrics?.revenue !== undefined ? toNumOrNull(body.metrics.revenue) : (existing.metric_revenue ?? null),
    cpl: body?.metrics?.cpl !== undefined ? toNumOrNull(body.metrics.cpl) : (existing.metric_cpl || null),
    roas: body?.metrics?.roas !== undefined ? toNumOrNull(body.metrics.roas) : (existing.metric_roas || null),
  };

  const channel = body?.channel !== undefined ? String(body.channel).trim() : (existing.channel || "");
  const serviceType = body?.serviceType !== undefined ? String(body.serviceType).trim() : (existing.service_type || "");
  const campaign = body?.campaign !== undefined ? String(body.campaign).trim() : (existing.campaign || "");
  const visibility = body?.visibility === "Client" || body?.visibility === "Internal" ? body.visibility : (existing.visibility || "Client");
  const notifyClient = body?.notifyClient !== undefined ? (body.notifyClient ? 1 : 0) : (existing.notify_client || 0);
  const status = body?.status === "Published" || body?.status === "Draft" || body?.status === "Archived" ? body.status : existing.status;

  const duplicate = await c.env.DB.prepare(
    "SELECT id FROM reports WHERE client_id = ? AND period = ? AND channel = ? AND id != ?"
  ).bind(existing.client_id, period, channel, id).first<any>();
  if (duplicate) {
    return c.json({ error: "A report already exists for this client, period, and channel." }, 409);
  }

  // Validation
  const isFirstReport = !(await c.env.DB.prepare(
    "SELECT id FROM reports WHERE client_id = ? AND id != ? LIMIT 1"
  ).bind(existing.client_id, id).first<any>());

  const validation = validateReportData(metrics as RawMetrics, { isFirstReport });

  if (status === "Published" && !validation.canPublish) {
    return c.json({
      error: "Cannot publish: critical validation errors must be fixed first.",
      validation,
    }, 400);
  }

  // Find previous report for comparison (exclude self)
  const prevRow = await c.env.DB.prepare(
    "SELECT * FROM reports WHERE client_id = ? AND id != ? ORDER BY created_at DESC LIMIT 1"
  ).bind(existing.client_id, id).first<any>();

  const previous = prevRow ? extractPreviousMetrics(prevRow) : null;

  const calculated = calculateStoredMetrics(metrics);
  const narrative = generateNarrativeV2(
    clientRow ? clientRow.name : "This client",
    period, calculated, previous, { isFirstReport, validation }
  );

  const wasPublished = existing.status === "Published";
  const newVersion = wasPublished && status === "Published" ? (existing.version || 1) + 1 : (existing.version || 1);
  const publishedAt = status === "Published" ? (existing.published_at || new Date().toISOString()) : existing.published_at;

  await c.env.DB.prepare(
    `UPDATE reports SET
      period = ?, status = ?, summary = ?,
      metric_reach = ?, metric_impressions = ?, metric_engagement = ?, metric_engagement_rate = ?,
      metric_leads = ?, metric_conversions = ?, metric_conversion = ?, metric_ad_spend = ?,
      metric_revenue = ?, metric_cpl = ?, metric_roas = ?,
      channel = ?, service_type = ?, campaign = ?, visibility = ?, notify_client = ?,
      what_worked = ?, what_didnt = ?, what_needs_attention = ?, recommendations = ?,
      next_month = ?, next_month_strategy = ?,
      data_quality = ?, anomalies = ?,
      version = ?, published_at = ?, updated_by = ?,
      comparison_status = ?, previous_report_id = ?, mom_changes = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`
  ).bind(
    period, status, narrative.summary,
    calculated.reach ?? 0, calculated.impressions, calculated.engagement ?? 0, calculated.engagementRate,
    calculated.leads ?? 0, calculated.conversions, calculated.conversionRate ?? 0, calculated.adSpend,
    calculated.revenue, calculated.cpl ?? 0, calculated.roas ?? 0,
    channel, serviceType, campaign, visibility, notifyClient,
    JSON.stringify(narrative.whatWorked),
    JSON.stringify(narrative.whatNeedsAttention),
    JSON.stringify(narrative.whatNeedsAttention),
    JSON.stringify(narrative.recommendations),
    narrative.nextMonth,
    JSON.stringify(narrative.nextMonthStrategy),
    narrative.dataQuality,
    JSON.stringify(narrative.anomalies),
    newVersion, publishedAt, session.user.name,
    narrative.comparisonStatus, prevRow?.id || null, JSON.stringify(narrative.momChanges),
    id
  ).run();

  // Notifications
  if (status === "Published" && !wasPublished) {
    if (visibility === "Client" && notifyClient) {
      await c.env.DB.prepare(
        "INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)"
      ).bind(newId("ntf"), `Your ${period} performance report is ready — check Reports & Performance for the full breakdown.`, existing.client_id)
        .run();
    }
  }
  if (status === "Published" || wasPublished) {
    await syncClientKpisFromLatest(c.env.DB, existing.client_id);
  }

  const row = await c.env.DB.prepare("SELECT * FROM reports WHERE id = ?").bind(id).first<any>();
  return c.json({ report: serializeReport(row), validation });
});

// Keeps the client's live KPI snapshot in sync with their most recently
// PUBLISHED report.
async function syncClientKpisFromLatest(db: D1Database, clientId: string): Promise<void> {
  const latest = await db
    .prepare(
      `SELECT metric_leads, metric_conversion, metric_cpl, metric_roas
       FROM reports
       WHERE client_id = ? AND status = 'Published'
       ORDER BY COALESCE(published_at, created_at) DESC, created_at DESC
       LIMIT 1`
    )
    .bind(clientId)
    .first<any>();
  await db
    .prepare(
      "UPDATE clients SET kpi_leads = ?, kpi_conversion = ?, kpi_cpl = ?, kpi_roas = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
    .bind(
      latest?.metric_leads ?? 0,
      `${latest?.metric_conversion ?? 0}%`,
      latest?.metric_cpl ?? 0,
      latest?.metric_roas ?? 0,
      clientId
    )
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
  // Client can only see Client-visible reports
  if (row.visibility && row.visibility !== "Client" && row.visibility !== "") {
    return c.json({ error: "Report not found." }, 404);
  }
  return c.json({ report: serializeReport(row) });
});

// ---- Helper functions ----

function extractMetrics(raw: any): ExtendedReportMetrics {
  return {
    reach: toNumOrNull(raw?.reach),
    impressions: toNumOrNull(raw?.impressions),
    engagement: toNumOrNull(raw?.engagement),
    engagementRate: toNumOrNull(raw?.engagementRate),
    leads: toIntegerOrNull(raw?.leads),
    conversions: toIntegerOrNull(raw?.conversions),
    conversionRate: toNumOrNull(raw?.conversionRate ?? raw?.conversion),
    adSpend: toNumOrNull(raw?.adSpend),
    revenue: toNumOrNull(raw?.revenue),
    cpl: toNumOrNull(raw?.cpl),
    roas: toNumOrNull(raw?.roas),
  };
}

function extractPreviousMetrics(row: any): PreviousReportMetrics {
  return {
    reach: row.metric_reach || 0,
    engagement: row.metric_engagement || 0,
    leads: row.metric_leads || 0,
    cpl: row.metric_cpl || 0,
    conversion: row.metric_conversion || 0,
    roas: row.metric_roas || 0,
    impressions: row.metric_impressions ?? null,
    conversions: row.metric_conversions ?? null,
    adSpend: row.metric_ad_spend ?? null,
    revenue: row.metric_revenue ?? null,
    engagementRate: row.metric_engagement_rate ?? null,
  };
}

function toNumOrNull(v: any): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (isNaN(n) || !isFinite(n)) return null;
  return n;
}

function toIntegerOrNull(v: any): number | null {
  const number = toNumOrNull(v);
  return number === null ? null : Math.trunc(number);
}

/**
 * Derived metrics are persisted from their source values whenever those
 * values are available. A manually supplied derived value remains useful
 * only when the source values are unavailable, and is still cross-checked by
 * the validation layer when both are present.
 */
function calculateStoredMetrics(metrics: ExtendedReportMetrics) {
  return calculateMetrics({
    ...metrics,
    engagementRate: metrics.engagement != null && metrics.reach != null ? null : metrics.engagementRate,
    conversionRate: metrics.conversions != null && metrics.leads != null ? null : metrics.conversionRate,
    cpl: metrics.adSpend != null && metrics.leads != null ? null : metrics.cpl,
    roas: metrics.revenue != null && metrics.adSpend != null ? null : metrics.roas,
  });
}

export default reports;
