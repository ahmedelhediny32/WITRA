/**
 * Health & contract-value logic (feedback round).
 *
 * WHY THIS EXISTS — answering the two questions WITRA asked directly:
 *
 * 1) "On Track" used to be a hardcoded default written at client-creation
 *    time, with zero relationship to actual delivery. Now:
 *      - A brand-new client with no execution data yet is "Onboarding"
 *        (a distinct, honest status — NOT "On Track").
 *      - Once the Content Ops Tracker has *any* planned items for the
 *        active month, health is derived from real execution %:
 *          >= 70% done  -> "On Track"
 *          40–69% done  -> "Needs Attention"
 *          <  40% done  -> "At Risk"
 *      This is recalculated automatically every time the tracker is saved
 *      (see src/routes/content-ops.ts -> syncExecFromTracker), so it always
 *      reflects the latest real delivery, never a static assumption.
 *
 * 2) "Total Contract Value" used to be `mrr * 12`, silently assuming a full
 *    year even for a client who might leave after one month. Now it is
 *    computed as `mrr * monthsElapsedSinceSubscriptionStart` (minimum 1 once
 *    billing has started) — i.e. the value actually earned/committed so far,
 *    not a hypothetical full-year projection. It grows month by month as the
 *    relationship continues, instead of assuming the future up front.
 */

export type ExecCounters = {
  contentDone: number;
  contentPlanned: number;
  storiesDone: number;
  storiesPlanned: number;
  offlineDone: number;
  offlinePlanned: number;
};

export function computeHealthFromExecution(exec: ExecCounters): { health: string; reason: string } {
  const planned = exec.contentPlanned + exec.storiesPlanned + exec.offlinePlanned;
  const done = exec.contentDone + exec.storiesDone + exec.offlineDone;

  if (planned === 0) {
    return {
      health: "Onboarding",
      reason: "No execution data yet — health will be calculated once the content calendar has planned items.",
    };
  }

  const pct = Math.round((done / planned) * 100);
  if (pct >= 70) {
    return { health: "On Track", reason: `${pct}% of this month's planned work is executed (${done}/${planned}).` };
  }
  if (pct >= 40) {
    return {
      health: "Needs Attention",
      reason: `Only ${pct}% of this month's planned work is executed so far (${done}/${planned}).`,
    };
  }
  return {
    health: "At Risk",
    reason: `Execution is falling behind — just ${pct}% of planned work done (${done}/${planned}).`,
  };
}

/** Whole months elapsed between subscriptionStart (YYYY-MM-DD) and today, minimum 1. */
export function monthsElapsedSince(subscriptionStart: string | null | undefined): number {
  if (!subscriptionStart) return 1;
  const start = new Date(subscriptionStart + "T00:00:00Z");
  if (Number.isNaN(start.getTime())) return 1;
  const now = new Date();
  let months =
    (now.getUTCFullYear() - start.getUTCFullYear()) * 12 + (now.getUTCMonth() - start.getUTCMonth());
  if (now.getUTCDate() < start.getUTCDate()) months -= 1;
  return Math.max(1, months + 1);
}

/** Honest contract value: what's actually been billed/earned so far, not a hypothetical full year. */
export function computeContractValue(mrr: number, subscriptionStart: string | null | undefined): number {
  return Math.max(0, Math.trunc(mrr)) * monthsElapsedSince(subscriptionStart);
}

/**
 * Lazy expiry sweep — Cloudflare Pages hosted deploy has no cron triggers,
 * so instead of a scheduled job we check on every dashboard/portal request:
 * any active client whose renewal date has passed gets suspended (services
 * paused, a client-side notification + warning fired, and a WITRA-side
 * notification so staff know to follow up) until they resubscribe.
 * Cheap no-op when nothing has expired (single indexed query).
 */
export async function checkAndSuspendExpired(db: D1Database, newId: (prefix: string) => string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const { results } = await db
    .prepare(
      `SELECT id, name, active_services FROM clients
       WHERE archived = 0 AND subscription_status = 'active' AND renewal IS NOT NULL AND renewal < ?`
    )
    .bind(today)
    .all<any>();

  for (const row of results || []) {
    await db
      .prepare(
        `UPDATE clients SET
           subscription_status = 'suspended',
           active_services_before_suspend = active_services,
           active_services = '[]',
           billing_status = 'Past Due',
           last_expiry_notice = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(row.id)
      .run();

    await db
      .prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
      .bind(newId("act"), row.id, "Subscription <b>expired</b> — services suspended until renewal.")
      .run();
    await db
      .prepare("INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)")
      .bind(
        newId("ntf"),
        "Your subscription contract has ended and your services have been paused. Please contact WITRA to resubscribe and reactivate your account.",
        row.id
      )
      .run();
    await db
      .prepare("INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'witra', ?)")
      .bind(newId("ntf"), `<b>${row.name}</b>'s contract has ended — services were auto-suspended.`, row.id)
      .run();
  }
}

/**
 * Upcoming-renewal reminder — same lazy-sweep pattern as checkAndSuspendExpired
 * (no cron on hosted Cloudflare Pages, so this runs on every dashboard/portal
 * request instead). Fires exactly once per renewal cycle, ~7 days before an
 * ACTIVE client's `renewal` date, so WITRA can follow up before the contract
 * actually lapses — separate from (and earlier than) the post-expiry
 * auto-suspend above. `last_renewal_reminder` (migration 0006) tracks whether
 * today's cycle has already been notified, and is cleared automatically the
 * next time the client resubscribes/renews (renewal date moves forward).
 */
export async function checkUpcomingRenewals(db: D1Database, newId: (prefix: string) => string): Promise<void> {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const in7 = new Date(today.getTime() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);

  const { results } = await db
    .prepare(
      `SELECT id, name, renewal FROM clients
       WHERE archived = 0 AND subscription_status = 'active'
         AND renewal IS NOT NULL AND renewal >= ? AND renewal <= ?
         AND (last_renewal_reminder IS NULL OR last_renewal_reminder < ?)`
    )
    .bind(todayIso, in7, todayIso)
    .all<any>();

  for (const row of results || []) {
    await db
      .prepare("UPDATE clients SET last_renewal_reminder = ? WHERE id = ?")
      .bind(todayIso, row.id)
      .run();

    await db
      .prepare("INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)")
      .bind(
        newId("ntf"),
        `Your subscription renews on <b>${row.renewal}</b> — please reach out to WITRA if you have any questions before then.`,
        row.id
      )
      .run();
    await db
      .prepare("INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'witra', ?)")
      .bind(newId("ntf"), `<b>${row.name}</b>'s subscription renews on <b>${row.renewal}</b> — following up soon.`, row.id)
      .run();
  }
}

/** Clients whose subscription renews within the next 7 days (for the WITRA dashboard reminder panel). */
export function upcomingRenewalWindow(): { from: string; to: string } {
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const to = new Date(today.getTime() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  return { from, to };
}
