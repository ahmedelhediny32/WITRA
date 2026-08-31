import { Hono } from "hono";
import type { Bindings } from "../types";
import { witraOrFail } from "../lib/middleware";
import { serializeActivity, serializeClient } from "../lib/serialize";
import { checkAndSuspendExpired, checkUpcomingRenewals, computeContractValue, upcomingRenewalWindow } from "../lib/health";
import { newId } from "../lib/util";

const dashboard = new Hono<{ Bindings: Bindings }>();

dashboard.get("/", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  // Lazy sweeps (no cron on hosted deploy) — see src/lib/health.ts.
  await checkAndSuspendExpired(c.env.DB, newId);
  await checkUpcomingRenewals(c.env.DB, newId);

  let clientQuery = "SELECT * FROM clients WHERE archived = 0";
  const binds: any[] = [];
  if (session.user.role !== "Super Admin") {
    const assigned = session.user.assigned_clients;
    if (assigned.length === 0) {
      return c.json({
        counts: { "On Track": 0, "Needs Attention": 0, "At Risk": 0, "Onboarding": 0 },
        mrr: 0,
        contractValue: 0,
        activeSubscriptions: 0,
        upcomingRenewals: [],
        openRequests: 0,
        clients: [],
        recentActivities: [],
      });
    }
    clientQuery += ` AND id IN (${assigned.map(() => "?").join(",")})`;
    binds.push(...assigned);
  }
  const stmt = c.env.DB.prepare(clientQuery);
  const { results: clientRows } = await (binds.length ? stmt.bind(...binds) : stmt).all();
  const clientList = clientRows || [];
  const clientIds = clientList.map((r: any) => r.id);

  const counts = { "On Track": 0, "Needs Attention": 0, "At Risk": 0, "Onboarding": 0 } as Record<string, number>;
  let mrr = 0;
  let contractValue = 0;
  let activeSubscriptions = 0;
  const { from: renewFrom, to: renewTo } = upcomingRenewalWindow();
  const upcomingRenewals: { id: string; name: string; renewal: string }[] = [];
  clientList.forEach((r: any) => {
    counts[r.health] = (counts[r.health] || 0) + 1;
    mrr += r.mrr;
    contractValue += computeContractValue(r.mrr, r.subscription_start);
    if (r.billing_status === "Active") activeSubscriptions += 1;
    if (r.subscription_status === "active" && r.renewal && r.renewal >= renewFrom && r.renewal <= renewTo) {
      upcomingRenewals.push({ id: r.id, name: r.name, renewal: r.renewal });
    }
  });
  upcomingRenewals.sort((a, b) => (a.renewal < b.renewal ? -1 : 1));

  let openRequests = 0;
  if (clientIds.length > 0) {
    const idsSql = clientIds.map(() => "?").join(",");
    const q = `SELECT COUNT(*) as n FROM service_requests WHERE status IN ('Requested','Reviewing') AND client_id IN (${idsSql})`;
    const row = await c.env.DB.prepare(q).bind(...clientIds).first<any>();
    const tq = `SELECT COUNT(*) as n FROM team_requests WHERE status = 'Requested' AND client_id IN (${idsSql})`;
    const trow = await c.env.DB.prepare(tq).bind(...clientIds).first<any>();
    openRequests = (row?.n || 0) + (trow?.n || 0);
  }

  let recentActivities: any[] = [];
  if (clientIds.length > 0) {
    const q = `SELECT * FROM activities WHERE client_id IN (${clientIds
      .map(() => "?")
      .join(",")}) ORDER BY created_at DESC LIMIT 6`;
    const { results } = await c.env.DB.prepare(q).bind(...clientIds).all();
    recentActivities = (results || []).map(serializeActivity);
  }

  return c.json({
    counts,
    mrr,
    contractValue,
    activeSubscriptions,
    upcomingRenewals,
    openRequests,
    clients: clientList.map((r: any) => serializeClient(r)),
    recentActivities,
  });
});

export default dashboard;
