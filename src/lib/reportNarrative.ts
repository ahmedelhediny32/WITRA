// Report Narrative Generator (v2)
// Generates the text sections of a performance report from a structured
// MarketingAnalysis object — never from raw numbers directly.
//
// ANTI-HALLUCINATION RULES:
// - First report → No MoM claims, identifies as "Baseline Period"
// - Missing data → "N/A" with explanation, never 0
// - Suspicious data → Explicit warnings, never praise
// - Each claim traces to a specific metric + comparison

import type { CalculatedMetrics, RawMetrics } from './reportCalculations';
import { calculateMetrics, calculateMomChanges } from './reportCalculations';
import { validateReportData } from './reportValidation';
import type { ValidationResult } from './reportValidation';
import { analyzeReport } from './reportAnalysis';
import type { MarketingAnalysis, NextMonthStrategy } from './reportAnalysis';

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
  whatDidnt: string[];  // kept for backward compatibility
  whatNeedsAttention: string[];
  recommendations: string[];
  nextMonth: string;
  nextMonthStrategy: NextMonthStrategy;
  dataQuality: string;
  dataQualityReasons: string[];
  anomalies: string[];
  comparisonStatus: string;
  momChanges: Record<string, any>;
  analysis: MarketingAnalysis;
}

// ---- Previous report metrics shape (from DB row) ----

export interface PreviousReportMetrics {
  reach: number;
  engagement: number;
  leads: number;
  cpl: number;
  conversion: number;
  roas: number;
  impressions?: number | null;
  conversions?: number | null;
  adSpend?: number | null;
  revenue?: number | null;
  engagementRate?: number | null;
}

// ---- Extended metrics shape (new form) ----

export interface ExtendedReportMetrics {
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

// ---- Main entry point (v2) ----
// Orchestrates the full pipeline: validate → calculate → analyze → narrate

export function generateNarrativeV2(
  clientName: string,
  period: string,
  rawMetrics: ExtendedReportMetrics,
  previousRaw: PreviousReportMetrics | null,
  options: { isFirstReport?: boolean; existingReportForPeriod?: boolean; validation?: ValidationResult } = {}
): GeneratedNarrative {
  // Step 1: Calculate metrics (auto-fill derived values)
  const current = calculateMetrics(rawMetrics as RawMetrics);

  // Build previous CalculatedMetrics
  let previous: CalculatedMetrics | null = null;
  if (previousRaw) {
    previous = calculateMetrics({
      reach: previousRaw.reach,
      impressions: previousRaw.impressions ?? null,
      engagement: previousRaw.engagement,
      engagementRate: previousRaw.engagementRate ?? null,
      leads: previousRaw.leads,
      conversions: previousRaw.conversions ?? null,
      conversionRate: previousRaw.conversion,
      adSpend: previousRaw.adSpend ?? null,
      revenue: previousRaw.revenue ?? null,
      cpl: previousRaw.cpl,
      roas: previousRaw.roas,
    } as RawMetrics);
  }

  const isFirstReport = previousRaw == null;

  // Step 2: Validate
  const validation = options.validation ?? validateReportData(rawMetrics as RawMetrics, {
    isFirstReport,
    existingReportForPeriod: options.existingReportForPeriod,
  });

  // Step 3: Analyze
  const analysis = analyzeReport(
    current, previous,
    [...validation.warnings, ...validation.info],
    validation.dataQuality,
    clientName, period
  );

  // Step 4: Build narrative from analysis
  return {
    summary: analysis.executiveSummary,
    whatWorked: analysis.whatWorked,
    whatDidnt: analysis.whatNeedsAttention, // backward compat field
    whatNeedsAttention: analysis.whatNeedsAttention,
    recommendations: analysis.recommendations.map(r => r.full),
    nextMonth: analysis.nextMonthStrategy.primaryObjective,
    nextMonthStrategy: analysis.nextMonthStrategy,
    dataQuality: analysis.dataQuality,
    dataQualityReasons: analysis.dataQualityReasons,
    anomalies: analysis.anomalies.map(a => a.description),
    comparisonStatus: analysis.comparisonStatus,
    momChanges: analysis.momChanges,
    analysis,
  };
}

// ---- Legacy entry point (backward compatible) ----
// Keeps the same signature as the original generateNarrative so existing
// callers don't break, but delegates to the v2 pipeline internally.

export function generateNarrative(
  clientName: string,
  period: string,
  current: ReportMetrics,
  previous: ReportMetrics | null
): GeneratedNarrative {
  return generateNarrativeV2(
    clientName,
    period,
    {
      reach: current.reach,
      engagement: current.engagement,
      leads: current.leads,
      cpl: current.cpl,
      conversionRate: current.conversion,
      roas: current.roas,
    },
    previous ? {
      reach: previous.reach,
      engagement: previous.engagement,
      leads: previous.leads,
      cpl: previous.cpl,
      conversion: previous.conversion,
      roas: previous.roas,
    } : null
  );
}
