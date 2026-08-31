import type { Context } from "hono";
import type { Bindings, SessionInfo } from "../types";
import { requireSession, witraCanAccessClient } from "./auth";

/** Returns session or sends 401 JSON response (caller must `return` the result if it's a Response). */
export async function authOrFail(
  c: Context<{ Bindings: Bindings }>
): Promise<SessionInfo | Response> {
  const session = await requireSession(c);
  if (!session) {
    return c.json({ error: "Not authenticated. Please sign in again." }, 401);
  }
  return session;
}

/** Requires a WITRA-side user (Super Admin or Team Member). */
export async function witraOrFail(
  c: Context<{ Bindings: Bindings }>
): Promise<SessionInfo | Response> {
  const session = await authOrFail(c);
  if (session instanceof Response) return session;
  if (session.user.user_type !== "witra") {
    return c.json({ error: "This action requires a WITRA staff account." }, 403);
  }
  return session;
}

/** Requires a WITRA Super Admin specifically. */
export async function superAdminOrFail(
  c: Context<{ Bindings: Bindings }>
): Promise<SessionInfo | Response> {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;
  if (session.user.role !== "Super Admin") {
    return c.json({ error: "This action requires a Super Admin account." }, 403);
  }
  return session;
}

/** Requires the WITRA user to have access to a specific client id (Super Admin = all, Team Member = assigned only). */
export async function witraClientAccessOrFail(
  c: Context<{ Bindings: Bindings }>,
  clientId: string
): Promise<SessionInfo | Response> {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;
  if (!witraCanAccessClient(session.user, clientId)) {
    return c.json({ error: "You do not have access to this client." }, 403);
  }
  return session;
}

/**
 * Resolves the "effective" client id for portal routes:
 * - Client-type user -> their own client_id
 * - WITRA user currently impersonating a client -> the impersonated client_id (access-checked)
 * Returns null if neither condition is met.
 */
export function effectiveClientId(session: SessionInfo): string | null {
  if (session.user.user_type === "client") return session.user.client_id;
  if (session.user.user_type === "witra" && session.impersonating_client_id) {
    if (witraCanAccessClient(session.user, session.impersonating_client_id)) {
      return session.impersonating_client_id;
    }
  }
  return null;
}

export async function portalContextOrFail(
  c: Context<{ Bindings: Bindings }>
): Promise<{ session: SessionInfo; clientId: string } | Response> {
  const session = await authOrFail(c);
  if (session instanceof Response) return session;
  const clientId = effectiveClientId(session);
  if (!clientId) {
    return c.json({ error: "No client workspace is active for this session." }, 403);
  }
  return { session, clientId };
}
