// Report Calculations Engine
// Deterministic, testable calculation functions for performance report metrics.
// All handle division by zero safely → returns null (displayed as "N/A").

export interface RawMetrics {
  reach?: number | null;
  impressions?: number | null;
  engagement?: number | null;
  engagementRate?: number | null;
  leads?: number | null;
  conversions?: number | null;
  conversionRate?: number | null;
  adSpend?: number | null;
  revenue?: number | null;
  cpl?: number | null;
  roas?: number | null;
}

export interface CalculatedMetrics {
  reach: number | null;
  impressions: number | null;
  engagement: number | null;
  engagementRate: number | null;
  leads: number | null;
  conversions: number | null;
  conversionRate: number | null;
  adSpend: number | null;
  revenue: number | null;
  cpl: number | null;
  roas: number | null;
}

export interface MetricDiscrepancy {
  metric: string;
  entered: number;
  calculated: number;
  message: string;
}

export interface MomChange {
  current: number | null;
  previous: number | null;
  change: number | null;          // percentage change
  direction: 'up' | 'down' | 'flat' | 'na';
  semantic: 'improved' | 'declined' | 'stable' | 'mixed' | 'na';
}

// ---- Core calculation functions ----

export function calcEngagementRate(engagement: number | null, reach: number | null): number | null {
  if (engagement == null || reach == null || reach === 0) return null;
  return (engagement / reach) * 100;
}

export function calcCPL(adSpend: number | null, leads: number | null): number | null {
  if (adSpend == null || leads == null || leads === 0) return null;
  return adSpend / leads;
}

export function calcConversionRate(conversions: number | null, leads: number | null): number | null {
  if (conversions == null || leads == null || leads === 0) return null;
  return (conversions / leads) * 100;
}

export function calcROAS(revenue: number | null, adSpend: number | null): number | null {
  if (revenue == null || adSpend == null || adSpend === 0) return null;
  return revenue / adSpend;
}

export function calcMomChange(current: number | null, previous: number | null): number | null {
  if (current == null || previous == null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

// ---- Fill calculated metrics ----
// Auto-fills any calculable metric that wasn't explicitly provided.

export function calculateMetrics(raw: RawMetrics): CalculatedMetrics {
  const reach = toNum(raw.reach);
  const impressions = toNum(raw.impressions);
  const engagement = toNum(raw.engagement);
  const leads = toNum(raw.leads);
  const conversions = toNum(raw.conversions);
  const adSpend = toNum(raw.adSpend);
  const revenue = toNum(raw.revenue);

  // Auto-calculate derived metrics if not provided
  const engagementRate = toNum(raw.engagementRate) ?? calcEngagementRate(engagement, reach);
  const conversionRate = toNum(raw.conversionRate) ?? calcConversionRate(conversions, leads);
  const cpl = toNum(raw.cpl) ?? calcCPL(adSpend, leads);
  const roas = toNum(raw.roas) ?? calcROAS(revenue, adSpend);

  return {
    reach,
    impressions,
    engagement,
    engagementRate,
    leads,
    conversions,
    conversionRate,
    adSpend,
    revenue,
    cpl,
    roas,
  };
}

// ---- Cross-check entered vs calculated values ----
// Compares user-entered calculated metrics against what the formula produces.
// Returns discrepancies with a meaningful tolerance.

export function crossCheckMetrics(raw: RawMetrics): MetricDiscrepancy[] {
  const discrepancies: MetricDiscrepancy[] = [];
  const TOLERANCE = 0.05; // 5% tolerance for rounding

  // Cross-check Engagement Rate
  if (raw.engagementRate != null && raw.engagement != null && raw.reach != null && raw.reach > 0) {
    const calculated = calcEngagementRate(raw.engagement, raw.reach)!;
    if (Math.abs(raw.engagementRate - calculated) > calculated * TOLERANCE + 0.5) {
      discrepancies.push({
        metric: 'Engagement Rate',
        entered: raw.engagementRate,
        calculated: round(calculated, 2),
        message: `Entered Engagement Rate (${round(raw.engagementRate, 1)}%) doesn't match calculated value (${round(calculated, 1)}%) from Engagement ÷ Reach. Please verify the data.`,
      });
    }
  }

  // Cross-check CPL
  if (raw.cpl != null && raw.adSpend != null && raw.leads != null && raw.leads > 0) {
    const calculated = calcCPL(raw.adSpend, raw.leads)!;
    if (Math.abs(raw.cpl - calculated) > calculated * TOLERANCE + 1) {
      discrepancies.push({
        metric: 'CPL',
        entered: raw.cpl,
        calculated: round(calculated, 2),
        message: `Entered CPL (EGP ${round(raw.cpl, 0)}) doesn't match calculated value (EGP ${round(calculated, 0)}) from Ad Spend ÷ Leads. Please verify the data.`,
      });
    }
  }

  // Cross-check Conversion Rate
  if (raw.conversionRate != null && raw.conversions != null && raw.leads != null && raw.leads > 0) {
    const calculated = calcConversionRate(raw.conversions, raw.leads)!;
    if (Math.abs(raw.conversionRate - calculated) > calculated * TOLERANCE + 0.5) {
      discrepancies.push({
        metric: 'Conversion Rate',
        entered: raw.conversionRate,
        calculated: round(calculated, 2),
        message: `Entered Conversion Rate (${round(raw.conversionRate, 1)}%) doesn't match calculated value (${round(calculated, 1)}%) from Conversions ÷ Leads. Please verify the data.`,
      });
    }
  }

  // Cross-check ROAS
  if (raw.roas != null && raw.revenue != null && raw.adSpend != null && raw.adSpend > 0) {
    const calculated = calcROAS(raw.revenue, raw.adSpend)!;
    if (Math.abs(raw.roas - calculated) > calculated * TOLERANCE + 0.1) {
      discrepancies.push({
        metric: 'ROAS',
        entered: raw.roas,
        calculated: round(calculated, 2),
        message: `Entered ROAS (${fmtRoas(raw.roas)}) doesn't match calculated value (${fmtRoas(calculated)}) from Revenue ÷ Ad Spend. Please verify the data.`,
      });
    }
  }

  return discrepancies;
}

// ---- Month-over-month analysis ----

interface MomMetricConfig {
  key: string;
  label: string;
  higherIsBetter: boolean;
}

const MOM_METRICS: MomMetricConfig[] = [
  { key: 'reach', label: 'Reach', higherIsBetter: true },
  { key: 'impressions', label: 'Impressions', higherIsBetter: true },
  { key: 'engagement', label: 'Engagement', higherIsBetter: true },
  { key: 'engagementRate', label: 'Engagement Rate', higherIsBetter: true },
  { key: 'leads', label: 'Leads', higherIsBetter: true },
  { key: 'conversions', label: 'Conversions', higherIsBetter: true },
  { key: 'conversionRate', label: 'Conversion Rate', higherIsBetter: true },
  { key: 'cpl', label: 'CPL', higherIsBetter: false },
  { key: 'adSpend', label: 'Ad Spend', higherIsBetter: false }, // neutral, but treated as "lower is better" by default
  { key: 'revenue', label: 'Revenue', higherIsBetter: true },
  { key: 'roas', label: 'ROAS', higherIsBetter: true },
];

export function calculateMomChanges(
  current: CalculatedMetrics,
  previous: CalculatedMetrics | null
): Record<string, MomChange> {
  const changes: Record<string, MomChange> = {};

  for (const mc of MOM_METRICS) {
    const cur = (current as any)[mc.key] as number | null;
    const prev = previous ? (previous as any)[mc.key] as number | null : null;

    if (cur == null || prev == null) {
      changes[mc.key] = { current: cur, previous: prev, change: null, direction: 'na', semantic: 'na' };
      continue;
    }

    const change = calcMomChange(cur, prev);
    let direction: MomChange['direction'] = 'flat';
    if (change != null) {
      if (change > 1) direction = 'up';
      else if (change < -1) direction = 'down';
    }

    let semantic: MomChange['semantic'] = 'stable';
    if (change == null) {
      semantic = 'na';
    } else if (Math.abs(change) <= 1) {
      semantic = 'stable';
    } else if (mc.higherIsBetter) {
      semantic = change > 0 ? 'improved' : 'declined';
    } else {
      semantic = change < 0 ? 'improved' : 'declined';
    }

    changes[mc.key] = {
      current: cur,
      previous: prev,
      change: change != null ? round(change, 1) : null,
      direction,
      semantic,
    };
  }

  return changes;
}

// ---- Formatting utilities ----

export function round(n: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

export function fmtRoas(n: number): string {
  if (n === Math.floor(n)) return n + 'x';
  return round(n, 1) + 'x';
}

export function fmtPct(n: number | null): string {
  if (n == null) return 'N/A';
  if (n === Math.floor(n)) return n + '%';
  return round(n, 1) + '%';
}

export function fmtCurrency(n: number | null): string {
  if (n == null) return 'N/A';
  return 'EGP ' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function fmtNum(n: number | null): string {
  if (n == null) return 'N/A';
  if (n >= 1_000_000) return round(n / 1_000_000, 1) + 'M';
  if (n >= 1_000) return round(n / 1_000, 1) + 'K';
  return String(Math.round(n));
}

function toNum(v: number | null | undefined): number | null {
  if (v === undefined || v === null) return null;
  const n = Number(v);
  if (isNaN(n) || !isFinite(n)) return null;
  return n;
}
