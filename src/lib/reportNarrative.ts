// Auto-generates the narrative sections of a monthly performance report
// (executive summary, what worked, what didn't, recommendations, next month
// strategy) purely from the raw numbers WITRA enters — reach, engagement,
// leads, cost-per-lead, conversion rate, ROAS — compared against the
// client's previous period (if one exists). WITRA never free-types this
// narrative; it is always derived honestly from the numbers so every
// sentence traces back to a real metric.

export interface ReportMetrics {
  reach: number;
  engagement: number;
  leads: number;
  cpl: number;
  conversion: number; // percentage, e.g. 4.2
  roas: number;
}

export interface GeneratedNarrative {
  summary: string;
  whatWorked: string[];
  whatDidnt: string[];
  recommendations: string[];
  nextMonth: string;
}

function pctChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function fmtDelta(pct: number | null, higherIsBetter = true): string {
  if (pct === null) return "no prior period to compare";
  const good = higherIsBetter ? pct >= 0 : pct <= 0;
  const arrow = pct >= 0 ? "up" : "down";
  return `${arrow} ${Math.abs(pct)}% month-over-month${good ? "" : ""}`;
}

export function generateNarrative(
  clientName: string,
  period: string,
  current: ReportMetrics,
  previous: ReportMetrics | null
): GeneratedNarrative {
  const leadsDelta = previous ? pctChange(current.leads, previous.leads) : null;
  const roasDelta = previous ? pctChange(current.roas, previous.roas) : null;
  const cplDelta = previous ? pctChange(current.cpl, previous.cpl) : null; // lower is better
  const convDelta = previous ? pctChange(current.conversion, previous.conversion) : null;
  const reachDelta = previous ? pctChange(current.reach, previous.reach) : null;

  const summaryParts = [
    `In ${period}, ${clientName} reached ${fmtNum(current.reach)} people and generated ${current.leads} leads at a cost of EGP ${current.cpl.toFixed(0)} per lead, converting at ${current.conversion.toFixed(1)}%, for an overall ROAS of ${current.roas.toFixed(1)}x.`,
  ];
  if (previous) {
    summaryParts.push(
      `Leads were ${fmtDelta(leadsDelta)} compared to the prior period, and ROAS moved ${fmtDelta(roasDelta)}.`
    );
  } else {
    summaryParts.push("This is the first recorded report for this client, so no month-over-month comparison is available yet.");
  }
  const summary = summaryParts.join(" ");

  const whatWorked: string[] = [];
  const whatDidnt: string[] = [];

  if (previous) {
    if (leadsDelta !== null && leadsDelta > 0) whatWorked.push(`Lead volume grew ${leadsDelta}% versus last period (${previous.leads} → ${current.leads}).`);
    if (leadsDelta !== null && leadsDelta < 0) whatDidnt.push(`Lead volume dropped ${Math.abs(leadsDelta)}% versus last period (${previous.leads} → ${current.leads}).`);
    if (roasDelta !== null && roasDelta > 0) whatWorked.push(`ROAS improved ${roasDelta}% (${previous.roas.toFixed(1)}x → ${current.roas.toFixed(1)}x) — ad spend is converting more efficiently.`);
    if (roasDelta !== null && roasDelta < 0) whatDidnt.push(`ROAS declined ${Math.abs(roasDelta)}% (${previous.roas.toFixed(1)}x → ${current.roas.toFixed(1)}x).`);
    if (cplDelta !== null && cplDelta < 0) whatWorked.push(`Cost per lead fell ${Math.abs(cplDelta)}% (EGP ${previous.cpl.toFixed(0)} → EGP ${current.cpl.toFixed(0)}) — leads are getting cheaper to acquire.`);
    if (cplDelta !== null && cplDelta > 0) whatDidnt.push(`Cost per lead rose ${cplDelta}% (EGP ${previous.cpl.toFixed(0)} → EGP ${current.cpl.toFixed(0)}).`);
    if (convDelta !== null && convDelta > 0) whatWorked.push(`Conversion rate climbed ${convDelta}% (${previous.conversion.toFixed(1)}% → ${current.conversion.toFixed(1)}%).`);
    if (convDelta !== null && convDelta < 0) whatDidnt.push(`Conversion rate slipped ${Math.abs(convDelta)}% (${previous.conversion.toFixed(1)}% → ${current.conversion.toFixed(1)}%).`);
    if (reachDelta !== null && reachDelta > 0) whatWorked.push(`Reach expanded ${reachDelta}% (${fmtNum(previous.reach)} → ${fmtNum(current.reach)}).`);
  } else {
    if (current.roas >= 2) whatWorked.push(`ROAS of ${current.roas.toFixed(1)}x is a strong first-period result — ad spend is more than paying for itself.`);
    if (current.leads > 0) whatWorked.push(`${current.leads} leads generated in the first recorded period, establishing a baseline.`);
  }
  if (current.roas < 1) whatDidnt.push(`ROAS of ${current.roas.toFixed(1)}x means every EGP spent on ads is currently returning less than EGP 1 — this needs attention.`);
  if (current.conversion < 1) whatDidnt.push(`Conversion rate of ${current.conversion.toFixed(1)}% is on the low side for the traffic volume received.`);

  if (whatWorked.length === 0) whatWorked.push("No standout wins this period based on the entered metrics — focus is on stabilizing the numbers below.");
  if (whatDidnt.length === 0) whatDidnt.push("No significant declines this period — overall performance held steady or improved across the board.");

  const recommendations: string[] = [];
  if (current.roas < 1.5) recommendations.push("Review targeting and creative to lift ROAS — consider pausing the weakest-performing ad sets and reallocating budget to what's working.");
  if (current.cpl > 0 && cplDelta !== null && cplDelta > 10) recommendations.push("Cost per lead is trending up — tighten audience targeting or refresh ad creative to fight rising costs.");
  if (current.conversion < 2) recommendations.push("Conversion rate has room to grow — review the landing page and lead-capture flow for friction points.");
  if (leadsDelta !== null && leadsDelta < 0) recommendations.push("Lead volume dipped — consider increasing budget on top-performing campaigns or testing a new offer.");
  if (recommendations.length === 0) recommendations.push("Numbers are healthy — maintain current budget allocation and creative rotation, and keep testing incremental improvements.");

  const nextMonth = current.roas >= 2 && (leadsDelta === null || leadsDelta >= 0)
    ? "Scale what's working: increase budget on the best-performing campaigns while monitoring ROAS to make sure efficiency holds as spend grows."
    : "Focus on efficiency over volume next period: tighten targeting, refresh creative, and re-test the offer before increasing spend.";

  return { summary, whatWorked, whatDidnt, recommendations, nextMonth };
}

function fmtNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(Math.round(n));
}
