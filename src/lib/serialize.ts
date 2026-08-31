import { parseJsonArray } from "./util";
import { computeContractValue } from "./health";

export function serializePlan(row: any) {
  return {
    id: row.id,
    name: row.name,
    nameAr: row.name_ar || row.name,
    price: row.price,
    cycle: row.cycle,
    entitlements: parseJsonArray<string>(row.entitlements),
    sortOrder: row.sort_order,
  };
}

export function serializeEntitlementLabel(row: any) {
  return { key: row.key, label: row.label, labelAr: row.label_ar || row.label };
}

export function serializeService(row: any) {
  return {
    id: row.id,
    name: row.name,
    nameAr: row.name_ar || row.name,
    category: row.category,
    headline: row.headline,
    headlineAr: row.headline_ar || row.headline,
    whatYouGet: parseJsonArray<string>(row.what_you_get),
    whatYouGetAr: row.what_you_get_ar ? parseJsonArray<string>(row.what_you_get_ar) : parseJsonArray<string>(row.what_you_get),
    whyYouNeedIt: row.why_you_need_it,
    whyYouNeedItAr: row.why_you_need_it_ar || row.why_you_need_it,
    price: row.price,
    standalone: !!row.standalone,
    includedIn: parseJsonArray<string>(row.included_in),
    status: row.status,
  };
}

export function serializeClient(row: any, opts: { includeInternal?: boolean } = {}) {
  const base = {
    id: row.id,
    name: row.name,
    owner: row.owner,
    industry: row.industry,
    location: row.location,
    logoColor: row.logo_color,
    secondaryColor: row.secondary_color || "#B7791F",
    logoImage: row.logo_image || null,
    planId: row.plan_id,
    mrr: row.mrr,
    health: row.health,
    healthReason: row.health_reason,
    activeServices: parseJsonArray<string>(row.active_services),
    subscriptionStatus: row.subscription_status || "active",
    subscriptionStart: row.subscription_start || null,
    renewal: row.renewal,
    // Computed live: mrr * months actually elapsed since subscription started —
    // never assumes a full year up front. See src/lib/health.ts for rationale.
    contractValue: computeContractValue(row.mrr, row.subscription_start),
    lastActivity: row.last_activity,
    billingStatus: row.billing_status,
    kpis: {
      leads: row.kpi_leads,
      conversion: row.kpi_conversion,
      cpl: row.kpi_cpl,
      roas: row.kpi_roas,
    },
    execution: {
      contentDone: row.exec_content_done,
      contentPlanned: row.exec_content_planned,
      storiesDone: row.exec_stories_done,
      storiesPlanned: row.exec_stories_planned,
      offlineDone: row.exec_offline_done,
      offlinePlanned: row.exec_offline_planned,
      note: row.exec_note,
    },
    socialLinks: parseJsonArray<{ platform: string; url: string }>(row.social_links),
  };
  if (opts.includeInternal) {
    return { ...base, internalNotes: row.internal_notes || "" };
  }
  return base;
}

export function serviceRequest(row: any) {
  return {
    id: row.id,
    clientId: row.client_id,
    service: row.service_name,
    requestedDate: row.requested_date,
    status: row.status,
    notes: row.notes,
    requestType: row.request_type,
    targetPlanId: row.target_plan_id || null,
  };
}

export function serializeActivity(row: any) {
  return {
    id: row.id,
    clientId: row.client_id,
    text: row.text,
    time: row.created_at,
  };
}

export function serializeReport(row: any) {
  return {
    id: row.id,
    clientId: row.client_id,
    period: row.period,
    status: row.status,
    summary: row.summary,
    metrics: {
      reach: row.metric_reach,
      engagement: row.metric_engagement,
      leads: row.metric_leads,
      roas: row.metric_roas,
      cpl: row.metric_cpl || 0,
      conversion: row.metric_conversion || 0,
    },
    whatWorked: parseJsonArray<string>(row.what_worked),
    whatDidnt: parseJsonArray<string>(row.what_didnt),
    recommendations: parseJsonArray<string>(row.recommendations),
    nextMonth: row.next_month,
    enteredBy: row.entered_by || "WITRA Team",
    createdAt: row.created_at,
  };
}

export function serializeNotification(row: any) {
  return {
    id: row.id,
    text: row.text,
    read: !!row.read,
    time: row.created_at,
    clientId: row.client_id || null,
  };
}

export function serializePlannerItem(row: any) {
  return { ...row, id: row.id };
}

export function serializeTeamRequest(row: any) {
  return {
    id: row.id,
    clientId: row.client_id,
    email: row.email,
    name: row.name,
    role: row.role,
    status: row.status,
    notes: row.notes,
    requestedDate: (row.created_at || "").slice(0, 10),
  };
}

export function serializeUser(row: any) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    userType: row.user_type,
    role: row.role,
    clientId: row.client_id || null,
    assignedClients: parseJsonArray<string>(row.assigned_clients),
    avatarImage: row.avatar_image || null,
    active: !!row.active,
  };
}
