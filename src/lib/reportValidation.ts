// Report Validation Engine
// Three-tier validation system for performance report data.
// ERROR   → Blocks publishing, user must fix
// WARNING → User can continue, issue is clearly explained
// INFO    → No problem, contextual insight

import type { RawMetrics, MetricDiscrepancy } from './reportCalculations';
import { crossCheckMetrics } from './reportCalculations';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationItem {
  severity: ValidationSeverity;
  field?: string;
  message: string;
}

export type DataQualityStatus = 'Verified' | 'Minor Warnings' | 'Needs Review';

export interface ValidationResult {
  errors: ValidationItem[];
  warnings: ValidationItem[];
  info: ValidationItem[];
  discrepancies: MetricDiscrepancy[];
  dataQuality: DataQualityStatus;
  canPublish: boolean;
}

// ---- Main validation function ----

export function validateReportData(
  metrics: RawMetrics,
  options: {
    isFirstReport?: boolean;
    existingReportForPeriod?: boolean;
  } = {}
): ValidationResult {
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];
  const info: ValidationItem[] = [];

  // ============ A. IMPOSSIBLE VALUES ============

  // Negative checks
  if (metrics.reach != null && metrics.reach < 0) {
    errors.push({ severity: 'error', field: 'reach', message: 'Reach cannot be negative.' });
  }
  if (metrics.impressions != null && metrics.impressions < 0) {
    errors.push({ severity: 'error', field: 'impressions', message: 'Impressions cannot be negative.' });
  }
  if (metrics.engagement != null && metrics.engagement < 0) {
    errors.push({ severity: 'error', field: 'engagement', message: 'Engagement cannot be negative.' });
  }
  if (metrics.leads != null && metrics.leads < 0) {
    errors.push({ severity: 'error', field: 'leads', message: 'Leads cannot be negative.' });
  }
  if (metrics.conversions != null && metrics.conversions < 0) {
    errors.push({ severity: 'error', field: 'conversions', message: 'Conversions cannot be negative.' });
  }
  if (metrics.adSpend != null && metrics.adSpend < 0) {
    errors.push({ severity: 'error', field: 'adSpend', message: 'Ad Spend cannot be negative.' });
  }
  if (metrics.revenue != null && metrics.revenue < 0) {
    errors.push({ severity: 'error', field: 'revenue', message: 'Revenue cannot be negative.' });
  }

  // Range checks
  if (metrics.conversionRate != null) {
    if (metrics.conversionRate < 0) {
      errors.push({ severity: 'error', field: 'conversionRate', message: 'Conversion Rate cannot be below 0%.' });
    }
    if (metrics.conversionRate > 100) {
      errors.push({ severity: 'error', field: 'conversionRate', message: 'Conversion Rate cannot exceed 100%.' });
    }
  }
  if (metrics.engagementRate != null && metrics.engagementRate < 0) {
    errors.push({ severity: 'error', field: 'engagementRate', message: 'Engagement Rate cannot be below 0%.' });
  }
  if (metrics.roas != null && metrics.roas < 0) {
    errors.push({ severity: 'error', field: 'roas', message: 'ROAS cannot be negative.' });
  }
  if (metrics.cpl != null && metrics.cpl < 0) {
    errors.push({ severity: 'error', field: 'cpl', message: 'Cost Per Lead cannot be negative.' });
  }

  // ============ B. LOGICAL INCONSISTENCIES ============

  // Engagement > Reach (possible but unusual)
  if (metrics.engagement != null && metrics.reach != null && metrics.reach > 0 && metrics.engagement > metrics.reach) {
    warnings.push({
      severity: 'warning',
      field: 'engagement',
      message: 'Engagement exceeds Reach. This is possible if engagement includes shares or viral actions, but please verify.',
    });
  }

  // Leads > Reach (anomalous)
  if (metrics.leads != null && metrics.reach != null && metrics.reach > 0 && metrics.leads > metrics.reach) {
    warnings.push({
      severity: 'warning',
      field: 'leads',
      message: 'Potential data anomaly: reported leads exceed reported reach. Please verify tracking or metric definitions.',
    });
  }

  // Conversions > Leads (impossible)
  if (metrics.conversions != null && metrics.leads != null && metrics.conversions > metrics.leads) {
    errors.push({
      severity: 'error',
      field: 'conversions',
      message: 'Conversions cannot exceed Leads. Please verify the data.',
    });
  }

  // Impressions < Reach (unusual for paid)
  if (metrics.impressions != null && metrics.reach != null && metrics.reach > 0 && metrics.impressions < metrics.reach) {
    warnings.push({
      severity: 'warning',
      field: 'impressions',
      message: 'Impressions are lower than Reach, which is unusual for most paid campaigns. Metric definitions may vary — please verify.',
    });
  }

  // Extremely high ROAS (suspicious)
  if (metrics.roas != null && metrics.roas > 20) {
    warnings.push({
      severity: 'warning',
      field: 'roas',
      message: `ROAS of ${metrics.roas}x is unusually high. Verify revenue attribution and ad spend before using this figure for decision-making.`,
    });
  }

  // Extremely high conversion rate with significant volume
  if (metrics.conversionRate != null && metrics.conversionRate > 50 && metrics.leads != null && metrics.leads > 10) {
    warnings.push({
      severity: 'warning',
      field: 'conversionRate',
      message: `Conversion Rate of ${metrics.conversionRate}% is unusually high for the reported lead volume. Verify conversion and lead definitions.`,
    });
  }

  // ============ C. METRIC CROSS-CHECKS ============

  const discrepancies = crossCheckMetrics(metrics);
  for (const d of discrepancies) {
    warnings.push({
      severity: 'warning',
      field: d.metric.toLowerCase().replace(/ /g, ''),
      message: d.message,
    });
  }

  // ============ D. CONTEXTUAL INFO ============

  if (options.isFirstReport) {
    info.push({
      severity: 'info',
      message: 'This is the first recorded reporting period for this client. No month-over-month comparison is available yet.',
    });
  }

  if (options.existingReportForPeriod) {
    warnings.push({
      severity: 'warning',
      message: 'A report already exists for this client and reporting period.',
    });
  }

  // Missing data info
  if (metrics.revenue == null && metrics.adSpend != null) {
    info.push({
      severity: 'info',
      field: 'roas',
      message: 'Revenue data is required to calculate ROAS. ROAS will display as N/A.',
    });
  }
  if (metrics.adSpend == null && metrics.leads != null) {
    info.push({
      severity: 'info',
      field: 'cpl',
      message: 'Ad Spend data is required to calculate CPL. CPL will display as N/A.',
    });
  }
  if (metrics.conversions == null && metrics.leads != null) {
    info.push({
      severity: 'info',
      field: 'conversionRate',
      message: 'Conversions count is required to calculate Conversion Rate. It will display as N/A unless entered manually.',
    });
  }

  // ============ DETERMINE DATA QUALITY ============

  let dataQuality: DataQualityStatus = 'Verified';
  if (errors.length > 0) {
    dataQuality = 'Needs Review';
  } else if (warnings.length > 0) {
    dataQuality = warnings.length >= 3 ? 'Needs Review' : 'Minor Warnings';
  }

  return {
    errors,
    warnings,
    info,
    discrepancies,
    dataQuality,
    canPublish: errors.length === 0,
  };
}
