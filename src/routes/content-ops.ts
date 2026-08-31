import { Hono } from "hono";
import type { Bindings } from "../types";
import { portalContextOrFail, witraClientAccessOrFail, witraOrFail } from "../lib/middleware";
import { computeHealthFromExecution } from "../lib/health";

const contentOps = new Hono<{ Bindings: Bindings }>();

/**
 * The Content Ops Tracker (public/static/content-ops.html) keeps its own
 * self-contained state shape exactly as designed:
 *   { activeMonth, months: {...}, storyPillars, storySlots, contentPillars }
 * We persist that whole blob as one JSON value per client — this mirrors
 * the tool's original localStorage persistence 1:1, just multi-tenant and
 * server-side. No reshaping/validation of the inner shape is done here;
 * the tool itself is the source of truth for its own data structure.
 */

async function loadState(db: D1Database, clientId: string): Promise<string | null> {
  const row = await db
    .prepare("SELECT state_json FROM content_ops_state WHERE client_id = ?")
    .bind(clientId)
    .first<{ state_json: string }>();
  return row ? row.state_json : null;
}

const DONE_STATUSES = new Set(["Posted", "Published", "Executed"]);
const SKIP_STATUSES = new Set(["Skipped", "Cancelled"]);

/**
 * Derives execution counters from the tracker state's active month and
 * writes them onto the client row so the client dashboard, admin client
 * profile and reports all reflect the tracker's real data automatically.
 * Planned = every non-skipped item; Done = Posted/Published/Executed.
 */
async function syncExecFromTracker(db: D1Database, clientId: string, state: any): Promise<void> {
  try {
    const monthKey: string | undefined = state?.activeMonth;
    const month = monthKey && state?.months ? state.months[monthKey] : null;
    if (!month) return;

    const count = (items: any[]) => {
      const list = Array.isArray(items) ? items : [];
      let planned = 0;
      let done = 0;
      for (const it of list) {
        const st = String(it?.status || "");
        if (SKIP_STATUSES.has(st)) continue;
        planned++;
        if (DONE_STATUSES.has(st)) done++;
      }
      return { planned, done };
    };

    const content = count(month.content);
    const stories = count(month.stories);
    const offline = count(month.offline);
    const label = month.label || monthKey;

    // Health is derived from real execution, never a static default —
    // see src/lib/health.ts for the full rationale behind this formula.
    const { health, reason } = computeHealthFromExecution({
      contentDone: content.done,
      contentPlanned: content.planned,
      storiesDone: stories.done,
      storiesPlanned: stories.planned,
      offlineDone: offline.done,
      offlinePlanned: offline.planned,
    });

    await db
      .prepare(
        `UPDATE clients SET
           exec_content_done = ?, exec_content_planned = ?,
           exec_stories_done = ?, exec_stories_planned = ?,
           exec_offline_done = ?, exec_offline_planned = ?,
           exec_note = ?, health = ?, health_reason = ?,
           last_activity = 'Just now', updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(
        content.done, content.planned,
        stories.done, stories.planned,
        offline.done, offline.planned,
        `Synced from Content Ops Tracker — ${label}`,
        health, reason,
        clientId
      )
      .run();
  } catch {
    // Sync is best-effort; never block the tracker save on it.
  }
}

// CLIENT PORTAL: get this client's saved tracker state (or null if none yet)
contentOps.get("/mine", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;
  const stateJson = await loadState(c.env.DB, ctx.clientId);
  return c.json({ state: stateJson ? JSON.parse(stateJson) : null });
});

// CLIENT PORTAL: save (upsert) this client's tracker state
contentOps.put("/mine", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  if (!body || typeof body !== "object" || !body.state) {
    return c.json({ error: "Missing state payload." }, 400);
  }

  const stateJson = JSON.stringify(body.state);
  await c.env.DB.prepare(
    `INSERT INTO content_ops_state (client_id, state_json, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(client_id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP`
  )
    .bind(ctx.clientId, stateJson)
    .run();

  // Keep the client's execution metrics in sync with the tracker.
  await syncExecFromTracker(c.env.DB, ctx.clientId, body.state);

  return c.json({ ok: true });
});

// WITRA AGENCY TRACKER: WITRA's own social media / content tracker (staff only)
contentOps.get("/witra", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;
  const row = await c.env.DB
    .prepare("SELECT state_json FROM witra_content_ops_state WHERE id = 1")
    .first<{ state_json: string }>();
  return c.json({ state: row ? JSON.parse(row.state_json) : null });
});

contentOps.put("/witra", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  if (!body || typeof body !== "object" || !body.state) {
    return c.json({ error: "Missing state payload." }, 400);
  }

  await c.env.DB.prepare(
    `INSERT INTO witra_content_ops_state (id, state_json, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP`
  )
    .bind(JSON.stringify(body.state))
    .run();

  return c.json({ ok: true });
});

// WITRA: view (read-only) a specific client's tracker state (access-checked)
contentOps.get("/client/:clientId", async (c) => {
  const clientId = c.req.param("clientId");
  const session = await witraClientAccessOrFail(c, clientId);
  if (session instanceof Response) return session;
  const stateJson = await loadState(c.env.DB, clientId);
  return c.json({ state: stateJson ? JSON.parse(stateJson) : null });
});

export default contentOps;
