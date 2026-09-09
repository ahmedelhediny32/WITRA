// Report Marketing Analysis Engine
// Analyzes validated & calculated metrics to produce a structured analysis
// object. The narrative generator receives THIS — not raw numbers — ensuring
// every claim traces back to a verified data point.

import type { CalculatedMetrics, MomChange } from './reportCalculations';
import { calculateMomChanges, round, fmtRoas, fmtPct, fmtCurrency, fmtNum } from './reportCalculations';
import type { DataQualityStatus, ValidationItem } from './reportValidation';

export interface AnalysisPoint {
  metric: string;
  value: string;
  context: string;
}

export interface AnomalyItem {
  metric: string;
  description: string;
}

export interface RecommendationItem {
  observation: string;
  implication: string;
  action: string;
  full: string;  // combined sentence
}

export interface NextMonthStrategy {
  primaryObjective: string;
  priorityActions: string[];
  metricsToMonitor: string[];
  suggestedFocus: string[];
}

export interface MarketingAnalysis {
  comparisonStatus: 'Baseline' | 'Comparison';
  strongestMetrics: AnalysisPoint[];
  weakestMetrics: AnalysisPoint[];
  anomalies: AnomalyItem[];
  momChanges: Record<string, MomChange>;
  dataQuality: DataQualityStatus;
  dataQualityReasons: string[];
  efficiencyTrends: string[];
  risks: string[];
  opportunities: string[];
  whatWorked: string[];
  whatNeedsAttention: string[];
  recommendations: RecommendationItem[];
  nextMonthStrategy: NextMonthStrategy;
  executiveSummary: string;
}

// ---- Main analysis function ----

export function analyzeReport(
  current: CalculatedMetrics,
  previous: CalculatedMetrics | null,
  validationWarnings: ValidationItem[],
  dataQuality: DataQualityStatus,
  clientName: string,
  period: string
): MarketingAnalysis {
  const isBaseline = previous == null;
  const comparisonStatus = isBaseline ? 'Baseline' : 'Comparison';
  const momChanges = calculateMomChanges(current, previous);

  // ---- Identify strongest and weakest metrics ----
  const strongestMetrics: AnalysisPoint[] = [];
  const weakestMetrics: AnalysisPoint[] = [];

  if (!isBaseline) {
    // Strongest: metrics that improved significantly
    const improved = Object.entries(momChanges)
      .filter(([, v]) => v.semantic === 'improved' && v.change != null && Math.abs(v.change) > 5)
      .sort((a, b) => Math.abs(b[1].change!) - Math.abs(a[1].change!));

    for (const [key, mc] of improved.slice(0, 3)) {
      strongestMetrics.push({
        metric: metricLabel(key),
        value: formatMetricValue(key, mc.current),
        context: `${mc.direction === 'up' ? '↑' : '↓'} ${Math.abs(mc.change!)}% vs previous period`,
      });
    }

    // Weakest: metrics that declined significantly
    const declined = Object.entries(momChanges)
      .filter(([, v]) => v.semantic === 'declined' && v.change != null && Math.abs(v.change) > 5)
      .sort((a, b) => Math.abs(b[1].change!) - Math.abs(a[1].change!));

    for (const [key, mc] of declined.slice(0, 3)) {
      weakestMetrics.push({
        metric: metricLabel(key),
        value: formatMetricValue(key, mc.current),
        context: `${mc.direction === 'up' ? '↑' : '↓'} ${Math.abs(mc.change!)}% vs previous period`,
      });
    }
  } else {
    // For baseline, identify standout values
    if (current.leads != null && current.leads > 0) {
      strongestMetrics.push({
        metric: 'Lead Volume',
        value: fmtNum(current.leads),
        context: 'Baseline period — strongest reported outcome',
      });
    }
    if (current.roas != null && current.roas >= 1) {
      strongestMetrics.push({
        metric: 'ROAS',
        value: fmtRoas(current.roas),
        context: 'Baseline period — positive return on ad spend',
      });
    }
  }

  // ---- Anomalies from validation warnings ----
  const anomalies: AnomalyItem[] = validationWarnings
    .filter(w => w.field)
    .map(w => ({ metric: w.field || 'General', description: w.message }));

  // ---- Data quality reasons ----
  const dataQualityReasons: string[] = validationWarnings.map(w => w.message);

  // ---- What worked ----
  const whatWorked = generateWhatWorked(current, previous, momChanges, isBaseline);

  // ---- What needs attention ----
  const whatNeedsAttention = generateWhatNeedsAttention(current, previous, momChanges, isBaseline, validationWarnings);

  // ---- Efficiency trends ----
  const efficiencyTrends: string[] = [];
  if (!isBaseline) {
    if (momChanges.cpl?.semantic === 'improved') {
      efficiencyTrends.push(`Acquisition efficiency improved — CPL decreased ${Math.abs(momChanges.cpl.change!)}%.`);
    }
    if (momChanges.cpl?.semantic === 'declined') {
      efficiencyTrends.push(`Acquisition efficiency declined — CPL increased ${Math.abs(momChanges.cpl.change!)}%.`);
    }
    if (momChanges.roas?.semantic === 'improved') {
      efficiencyTrends.push(`Revenue efficiency improved — ROAS increased ${Math.abs(momChanges.roas.change!)}%.`);
    }
    if (momChanges.roas?.semantic === 'declined') {
      efficiencyTrends.push(`Revenue efficiency declined — ROAS decreased ${Math.abs(momChanges.roas.change!)}%.`);
    }
  }

  // ---- Risks ----
  const risks: string[] = [];
  if (current.roas != null && current.roas < 1) {
    risks.push('ROAS is below 1x — ad spend is currently not generating positive returns.');
  }
  if (!isBaseline && momChanges.cpl?.semantic === 'declined' && momChanges.leads?.semantic !== 'improved') {
    risks.push('CPL is rising without a corresponding increase in lead volume — acquisition efficiency is declining.');
  }
  if (!isBaseline && momChanges.roas?.semantic === 'declined' && momChanges.adSpend?.direction === 'up') {
    risks.push('ROAS is declining while ad spend is increasing — spend efficiency is deteriorating.');
  }
  if (dataQuality === 'Needs Review') {
    risks.push('Data quality issues detected — verify metrics before making strategic decisions.');
  }

  // ---- Opportunities ----
  const opportunities: string[] = [];
  if (current.roas != null && current.roas >= 2 && current.adSpend != null) {
    opportunities.push('ROAS is strong — there may be room to scale spend while maintaining efficiency.');
  }
  if (current.conversionRate != null && current.conversionRate < 5 && current.leads != null && current.leads > 50) {
    opportunities.push('Conversion rate is low relative to lead volume — optimizing the conversion funnel could yield significant gains.');
  }
  if (!isBaseline && momChanges.engagement?.semantic === 'improved' && momChanges.leads?.semantic !== 'improved') {
    opportunities.push('Engagement is growing but not translating to leads — review call-to-action effectiveness.');
  }

  // ---- Recommendations ----
  const recommendations = generateRecommendations(current, previous, momChanges, isBaseline, dataQuality, validationWarnings);

  // ---- Next month strategy ----
  const nextMonthStrategy = generateNextMonthStrategy(current, previous, momChanges, isBaseline, dataQuality);

  // ---- Executive summary ----
  const executiveSummary = generateExecutiveSummary(
    current, previous, momChanges, isBaseline, dataQuality,
    strongestMetrics, whatNeedsAttention, clientName, period
  );

  return {
    comparisonStatus,
    strongestMetrics,
    weakestMetrics,
    anomalies,
    momChanges,
    dataQuality,
    dataQualityReasons,
    efficiencyTrends,
    risks,
    opportunities,
    whatWorked,
    whatNeedsAttention,
    recommendations,
    nextMonthStrategy,
    executiveSummary,
  };
}

// ---- What Worked generator ----

function generateWhatWorked(
  current: CalculatedMetrics,
  previous: CalculatedMetrics | null,
  momChanges: Record<string, MomChange>,
  isBaseline: boolean
): string[] {
  const items: string[] = [];

  if (isBaseline) {
    // First report — no comparisons, just identify strongest observed values
    if (current.leads != null && current.leads > 0) {
      items.push(`Strongest observed result: lead volume reached ${fmtNum(current.leads)} during the baseline period.`);
    }
    if (current.roas != null && current.roas >= 1) {
      items.push(`ROAS of ${fmtRoas(current.roas)} indicates positive return on ad spend during the baseline period.`);
    }
    if (current.engagementRate != null && current.engagementRate > 3) {
      items.push(`Engagement rate of ${fmtPct(current.engagementRate)} established a strong baseline for audience interaction.`);
    }
    if (items.length === 0) {
      items.push('Baseline data has been established. Performance trends will become clearer in the next reporting period.');
    }
  } else {
    // Comparison — only claim improvements that are data-backed
    if (momChanges.leads?.semantic === 'improved' && momChanges.leads.change != null) {
      items.push(`Leads increased ${Math.abs(momChanges.leads.change)}% compared with the previous period (${fmtNum(momChanges.leads.previous)} → ${fmtNum(momChanges.leads.current)}).`);
    }
    if (momChanges.cpl?.semantic === 'improved' && momChanges.cpl.change != null) {
      items.push(`CPL decreased ${Math.abs(momChanges.cpl.change)}%, indicating improved acquisition efficiency (${fmtCurrency(momChanges.cpl.previous)} → ${fmtCurrency(momChanges.cpl.current)}).`);
    }
    if (momChanges.roas?.semantic === 'improved' && momChanges.roas.change != null) {
      items.push(`ROAS improved from ${fmtRoas(momChanges.roas.previous!)} to ${fmtRoas(momChanges.roas.current!)}.`);
    }
    if (momChanges.conversionRate?.semantic === 'improved' && momChanges.conversionRate.change != null) {
      items.push(`Conversion rate increased from ${fmtPct(momChanges.conversionRate.previous)} to ${fmtPct(momChanges.conversionRate.current)}.`);
    }
    if (momChanges.engagementRate?.semantic === 'improved' && momChanges.engagementRate.change != null) {
      items.push(`Engagement rate improved from ${fmtPct(momChanges.engagementRate.previous)} to ${fmtPct(momChanges.engagementRate.current)}.`);
    }
    if (momChanges.reach?.semantic === 'improved' && momChanges.reach.change != null) {
      items.push(`Reach expanded ${Math.abs(momChanges.reach.change)}% (${fmtNum(momChanges.reach.previous)} → ${fmtNum(momChanges.reach.current)}).`);
    }
    if (momChanges.revenue?.semantic === 'improved' && momChanges.revenue.change != null) {
      items.push(`Revenue grew ${Math.abs(momChanges.revenue.change)}% (${fmtCurrency(momChanges.revenue.previous)} → ${fmtCurrency(momChanges.revenue.current)}).`);
    }
    if (items.length === 0) {
      items.push('No significant improvements detected compared to the previous period. Performance remained largely stable across measured KPIs.');
    }
  }

  return items;
}

// ---- What Needs Attention generator ----

function generateWhatNeedsAttention(
  current: CalculatedMetrics,
  previous: CalculatedMetrics | null,
  momChanges: Record<string, MomChange>,
  isBaseline: boolean,
  validationWarnings: ValidationItem[]
): string[] {
  const items: string[] = [];

  if (isBaseline) {
    if (validationWarnings.length > 0) {
      items.push('The relationship between some reported metrics should be verified before using the report for strategic decisions.');
    }
    items.push('No previous-period comparison is available. Performance trends will become available after the next reporting period.');
    return items;
  }

  // Declined metrics
  if (momChanges.leads?.semantic === 'declined' && momChanges.leads.change != null) {
    items.push(`Lead volume declined ${Math.abs(momChanges.leads.change)}% (${fmtNum(momChanges.leads.previous)} → ${fmtNum(momChanges.leads.current)}).`);
  }
  if (momChanges.cpl?.semantic === 'declined' && momChanges.cpl.change != null) {
    items.push(`CPL increased ${Math.abs(momChanges.cpl.change)}% (${fmtCurrency(momChanges.cpl.previous)} → ${fmtCurrency(momChanges.cpl.current)}), indicating declining acquisition efficiency.`);
  }
  if (momChanges.roas?.semantic === 'declined' && momChanges.roas.change != null) {
    items.push(`ROAS declined from ${fmtRoas(momChanges.roas.previous!)} to ${fmtRoas(momChanges.roas.current!)}.`);
  }
  if (momChanges.conversionRate?.semantic === 'declined' && momChanges.conversionRate.change != null) {
    items.push(`Conversion rate decreased from ${fmtPct(momChanges.conversionRate.previous)} to ${fmtPct(momChanges.conversionRate.current)}.`);
  }

  // Current period concerns
  if (current.roas != null && current.roas < 1) {
    items.push(`ROAS of ${fmtRoas(current.roas)} means every EGP spent on ads is returning less than EGP 1 — this requires immediate attention.`);
  }
  if (current.conversionRate != null && current.conversionRate < 1 && current.leads != null && current.leads > 20) {
    items.push(`Conversion rate of ${fmtPct(current.conversionRate)} is unusually low for the traffic volume received.`);
  }

  // Data quality issues
  for (const w of validationWarnings) {
    if (w.field && !items.some(i => i.includes(w.field!))) {
      items.push(w.message);
    }
  }

  if (items.length === 0) {
    items.push('No significant performance declines detected this period. All measured KPIs remained stable or improved.');
  }

  return items;
}

// ---- Recommendations generator ----

function generateRecommendations(
  current: CalculatedMetrics,
  previous: CalculatedMetrics | null,
  momChanges: Record<string, MomChange>,
  isBaseline: boolean,
  dataQuality: DataQualityStatus,
  validationWarnings: ValidationItem[]
): RecommendationItem[] {
  const recs: RecommendationItem[] = [];

  // Priority 1: Critical data/tracking issues
  if (dataQuality === 'Needs Review') {
    recs.push({
      observation: 'Data quality issues were detected in the submitted metrics.',
      implication: 'Strategic decisions based on unverified data carry significant risk.',
      action: 'Verify all metric sources and tracking configuration before the next reporting period.',
      full: 'Data quality issues were detected in the submitted metrics. Strategic decisions based on unverified data carry significant risk. Verify all metric sources and tracking configuration before the next reporting period.',
    });
  }

  // Priority 2: Efficiency problems
  if (!isBaseline && momChanges.cpl?.semantic === 'declined' && momChanges.cpl.change != null) {
    recs.push({
      observation: `CPL increased ${Math.abs(momChanges.cpl.change)}% while ${momChanges.leads?.semantic === 'improved' ? 'lead volume grew' : 'lead volume remained flat'}.`,
      implication: 'This indicates declining acquisition efficiency.',
      action: 'Review the highest-spend ad sets and reallocate budget toward campaigns with stronger conversion efficiency.',
      full: `CPL increased ${Math.abs(momChanges.cpl.change)}% while ${momChanges.leads?.semantic === 'improved' ? 'lead volume grew' : 'lead volume remained flat'}. This indicates declining acquisition efficiency. Review the highest-spend ad sets and reallocate budget toward campaigns with stronger conversion efficiency.`,
    });
  }

  if (current.roas != null && current.roas < 1.5) {
    recs.push({
      observation: `Current ROAS is ${fmtRoas(current.roas)}, which is below the efficiency threshold.`,
      implication: 'Ad spend is not generating sufficient returns.',
      action: 'Review targeting and creative performance. Consider pausing underperforming ad sets and reallocating budget.',
      full: `Current ROAS is ${fmtRoas(current.roas)}, which is below the efficiency threshold. Ad spend is not generating sufficient returns. Review targeting and creative performance. Consider pausing underperforming ad sets and reallocating budget.`,
    });
  }

  // Priority 3: Conversion opportunities
  if (current.conversionRate != null && current.conversionRate < 5 && current.leads != null && current.leads > 20) {
    recs.push({
      observation: `Conversion rate is ${fmtPct(current.conversionRate)} with ${fmtNum(current.leads)} leads.`,
      implication: 'There is significant room to improve lead-to-conversion efficiency.',
      action: 'Review the landing page and lead-capture flow for friction points. Test offer variations and form simplification.',
      full: `Conversion rate is ${fmtPct(current.conversionRate)} with ${fmtNum(current.leads)} leads. There is significant room to improve lead-to-conversion efficiency. Review the landing page and lead-capture flow for friction points.`,
    });
  }

  // Priority 4: Budget optimization
  if (!isBaseline && momChanges.adSpend?.direction === 'up' && momChanges.roas?.semantic === 'declined') {
    recs.push({
      observation: 'Ad spend increased while ROAS declined.',
      implication: 'Additional spend is not generating proportional returns.',
      action: 'Before increasing spend further, identify which campaigns are driving diminishing returns and optimize them.',
      full: 'Ad spend increased while ROAS declined. Additional spend is not generating proportional returns. Before increasing spend further, identify which campaigns are driving diminishing returns and optimize them.',
    });
  }

  // Priority 5: Growth opportunities
  if (!isBaseline && momChanges.leads?.semantic === 'declined') {
    recs.push({
      observation: `Lead volume declined ${Math.abs(momChanges.leads!.change!)}%.`,
      implication: 'The lead pipeline may be under pressure.',
      action: 'Consider testing new audience segments, refreshing creative, or introducing a new offer to revitalize lead flow.',
      full: `Lead volume declined ${Math.abs(momChanges.leads!.change!)}%. The lead pipeline may be under pressure. Consider testing new audience segments, refreshing creative, or introducing a new offer to revitalize lead flow.`,
    });
  }

  // Baseline-specific recommendations
  if (isBaseline) {
    if (validationWarnings.length > 0) {
      recs.push({
        observation: 'This is the first reporting period with some data quality warnings.',
        implication: 'Establishing a clean baseline is essential for meaningful future comparisons.',
        action: 'Verify lead tracking, conversion definitions, and revenue attribution before the next reporting period.',
        full: 'This is the first reporting period with some data quality warnings. Establishing a clean baseline is essential for meaningful future comparisons. Verify lead tracking, conversion definitions, and revenue attribution before the next reporting period.',
      });
    }
    recs.push({
      observation: 'This is the baseline period.',
      implication: 'Month-over-month trends will become available after the next report.',
      action: 'Focus on consistent metric collection and tracking accuracy to ensure reliable future comparisons.',
      full: 'This is the baseline period. Month-over-month trends will become available after the next report. Focus on consistent metric collection and tracking accuracy to ensure reliable future comparisons.',
    });
  }

  // Ensure we have at least 3 recommendations
  if (recs.length < 3 && !isBaseline) {
    if (!recs.some(r => r.observation.includes('targeting'))) {
      recs.push({
        observation: 'Performance metrics are within acceptable ranges.',
        implication: 'There is an opportunity for incremental optimization.',
        action: 'Test audience refinements, creative variations, and landing page optimizations to improve efficiency.',
        full: 'Performance metrics are within acceptable ranges. Test audience refinements, creative variations, and landing page optimizations to improve efficiency.',
      });
    }
  }

  return recs.slice(0, 5); // Max 5 recommendations
}

// ---- Next Month Strategy generator ----

function generateNextMonthStrategy(
  current: CalculatedMetrics,
  previous: CalculatedMetrics | null,
  momChanges: Record<string, MomChange>,
  isBaseline: boolean,
  dataQuality: DataQualityStatus
): NextMonthStrategy {
  if (isBaseline) {
    return {
      primaryObjective: dataQuality !== 'Verified'
        ? 'Establish a clean, validated performance baseline'
        : 'Build on baseline metrics and establish month-over-month trends',
      priorityActions: [
        dataQuality !== 'Verified' ? 'Verify all tracking and attribution configurations' : 'Maintain current campaign configurations for consistent comparison',
        'Document conversion and lead definitions for consistency',
        'Prepare for the first month-over-month analysis',
      ],
      metricsToMonitor: ['CPL', 'Conversion Rate', 'ROAS', 'Lead Volume'],
      suggestedFocus: dataQuality !== 'Verified'
        ? ['Tracking', 'Data Quality', 'Attribution']
        : ['Audience', 'Creative', 'Landing Page'],
    };
  }

  // Determine primary objective based on weakest area
  let primaryObjective = 'Maintain performance stability and test incremental improvements';
  const metricsToMonitor = ['CPL', 'Conversion Rate', 'ROAS'];
  const suggestedFocus: string[] = [];
  const priorityActions: string[] = [];

  if (current.roas != null && current.roas < 1) {
    primaryObjective = 'Restore ROAS above breakeven (1x) through efficiency improvements';
    suggestedFocus.push('Budget', 'Targeting', 'Creative');
    priorityActions.push('Pause underperforming campaigns and reallocate to highest-ROAS ad sets');
    priorityActions.push('Review audience targeting for better intent signals');
    priorityActions.push('Test new creative formats to improve engagement-to-conversion rates');
  } else if (momChanges.cpl?.semantic === 'declined') {
    primaryObjective = 'Improve lead acquisition efficiency by reducing CPL';
    suggestedFocus.push('Audience', 'Creative', 'Landing Page');
    priorityActions.push('Analyze top-performing campaigns and expand their audience reach');
    priorityActions.push('Refresh ad creative to combat potential ad fatigue');
    priorityActions.push('A/B test landing page variations to improve lead capture');
  } else if (momChanges.leads?.semantic === 'declined') {
    primaryObjective = 'Revitalize lead generation pipeline';
    suggestedFocus.push('Budget', 'Audience', 'Offer');
    priorityActions.push('Test new audience segments and lookalike audiences');
    priorityActions.push('Introduce offer variations to re-engage potential leads');
    priorityActions.push('Review funnel drop-off points and optimize the conversion path');
  } else if (current.roas != null && current.roas >= 2) {
    primaryObjective = 'Scale performance while maintaining efficiency';
    suggestedFocus.push('Budget', 'Scaling', 'Creative');
    priorityActions.push('Incrementally increase budget on highest-performing campaigns');
    priorityActions.push('Monitor ROAS closely as spend increases to catch diminishing returns early');
    priorityActions.push('Expand to new channels or audience segments with similar profiles');
  } else {
    suggestedFocus.push('Creative', 'Audience', 'Funnel');
    priorityActions.push('Test incremental creative and audience optimizations');
    priorityActions.push('Monitor all KPIs for early trend signals');
    priorityActions.push('Prepare for next month\'s performance review');
  }

  if (momChanges.conversionRate?.semantic === 'declined') {
    metricsToMonitor.push('Landing Page Performance');
  }
  if (momChanges.engagement?.semantic === 'declined') {
    metricsToMonitor.push('Engagement Rate');
  }

  return { primaryObjective, priorityActions, metricsToMonitor, suggestedFocus };
}

// ---- Executive Summary generator ----

function generateExecutiveSummary(
  current: CalculatedMetrics,
  previous: CalculatedMetrics | null,
  momChanges: Record<string, MomChange>,
  isBaseline: boolean,
  dataQuality: DataQualityStatus,
  strongestMetrics: AnalysisPoint[],
  whatNeedsAttention: string[],
  clientName: string,
  period: string
): string {
  const sentences: string[] = [];

  if (isBaseline) {
    sentences.push(`${period} established the first performance baseline for ${clientName}.`);

    if (current.leads != null && current.leads > 0) {
      sentences.push(`Lead generation was the primary reported outcome, with ${fmtNum(current.leads)} leads recorded.`);
    }

    if (dataQuality !== 'Verified') {
      sentences.push('Several metric relationships should be verified before drawing strategic conclusions.');
    }

    sentences.push('The next reporting period should focus on validating tracking and establishing reliable month-over-month benchmarks.');
  } else {
    // Determine overall performance direction
    const improved = Object.values(momChanges).filter(v => v.semantic === 'improved').length;
    const declined = Object.values(momChanges).filter(v => v.semantic === 'declined').length;
    const measurable = Object.values(momChanges).filter(v => v.semantic !== 'na').length;

    if (measurable === 0) {
      sentences.push(`${period} performance data has been recorded for ${clientName}, but insufficient comparable metrics are available for trend analysis.`);
    } else if (improved > declined && declined === 0) {
      sentences.push(`${period} showed positive momentum for ${clientName}, with improvements across ${improved} key metrics.`);
    } else if (declined > improved && improved === 0) {
      sentences.push(`${period} presented challenges for ${clientName}, with ${declined} key metrics declining compared to the previous period.`);
    } else {
      sentences.push(`${period} delivered mixed results for ${clientName}, with ${improved} metrics improving and ${declined} declining.`);
    }

    // Highlight strongest result
    if (strongestMetrics.length > 0) {
      const best = strongestMetrics[0];
      sentences.push(`${best.metric} was the strongest performer (${best.context}).`);
    }

    // Highlight key concern
    if (whatNeedsAttention.length > 0 && !whatNeedsAttention[0].includes('No significant')) {
      sentences.push(`Key area requiring attention: ${whatNeedsAttention[0].toLowerCase().replace(/\.$/, '')}.`);
    }

    if (dataQuality !== 'Verified') {
      sentences.push('Some data quality issues should be resolved before using this report for strategic decisions.');
    }
  }

  return sentences.slice(0, 5).join(' ');
}

// ---- Utility functions ----

function metricLabel(key: string): string {
  const labels: Record<string, string> = {
    reach: 'Reach', impressions: 'Impressions', engagement: 'Engagement',
    engagementRate: 'Engagement Rate', leads: 'Leads', conversions: 'Conversions',
    conversionRate: 'Conversion Rate', cpl: 'CPL', adSpend: 'Ad Spend',
    revenue: 'Revenue', roas: 'ROAS',
  };
  return labels[key] || key;
}

function formatMetricValue(key: string, value: number | null): string {
  if (value == null) return 'N/A';
  switch (key) {
    case 'engagementRate':
    case 'conversionRate':
      return fmtPct(value);
    case 'cpl':
    case 'adSpend':
    case 'revenue':
      return fmtCurrency(value);
    case 'roas':
      return fmtRoas(value);
    default:
      return fmtNum(value);
  }
}
