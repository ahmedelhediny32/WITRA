import type { Context } from "hono";
import type { Bindings, SessionInfo, SessionUser } from "../types";

const SESSION_COOKIE = "witra_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH_BITS = 256;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function randomHex(numBytes: number): string {
  const bytes = new Uint8Array(numBytes);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

export async function hashPassword(password: string): Promise<string> {
  const saltHex = randomHex(16);
  const salt = hexToBytes(saltHex);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS },
    keyMaterial,
    KEY_LENGTH_BITS
  );
  const hashHex = bytesToHex(new Uint8Array(derived));
  return `pbkdf2$${PBKDF2_ITERATIONS}$${saltHex}$${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split("$");
    if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
    const iterations = parseInt(parts[1], 10);
    const salt = hexToBytes(parts[2]);
    const expectedHex = parts[3];
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const derived = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations },
      keyMaterial,
      KEY_LENGTH_BITS
    );
    const computedHex = bytesToHex(new Uint8Array(derived));
    // constant-time-ish comparison
    if (computedHex.length !== expectedHex.length) return false;
    let diff = 0;
    for (let i = 0; i < computedHex.length; i++) {
      diff |= computedHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

export function newId(prefix: string): string {
  return `${prefix}_${randomHex(12)}`;
}

export function newToken(): string {
  return randomHex(32);
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  cookieHeader.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    out[key] = decodeURIComponent(val);
  });
  return out;
}

export function setSessionCookie(c: Context, token: string) {
  const maxAge = Math.floor(SESSION_DURATION_MS / 1000);
  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
}

export function clearSessionCookie(c: Context) {
  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
}

export function getSessionTokenFromRequest(c: Context): string | null {
  const cookies = parseCookies(c.req.header("Cookie"));
  return cookies[SESSION_COOKIE] || null;
}

export async function createSession(
  db: D1Database,
  userId: string
): Promise<string> {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  await db
    .prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(token, userId, expiresAt)
    .run();
  return token;
}

export async function destroySession(db: D1Database, token: string): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
}

function rowToSessionUser(row: any): SessionUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    user_type: row.user_type,
    role: row.role,
    client_id: row.client_id ?? null,
    assigned_clients: safeParseArray(row.assigned_clients),
    avatar_image: row.avatar_image ?? null,
    active: row.active,
  };
}

function safeParseArray(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getSessionInfo(
  db: D1Database,
  token: string | null
): Promise<SessionInfo | null> {
  if (!token) return null;
  const sessionRow = await db
    .prepare(
      `SELECT s.token, s.user_id, s.impersonating_client_id, s.expires_at,
              u.id, u.email, u.name, u.user_type, u.role, u.client_id, u.assigned_clients, u.avatar_image, u.active
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`
    )
    .bind(token)
    .first<any>();

  if (!sessionRow) return null;
  if (new Date(sessionRow.expires_at).getTime() < Date.now()) {
    await destroySession(db, token);
    return null;
  }
  if (!sessionRow.active) return null;

  return {
    token: sessionRow.token,
    user: rowToSessionUser(sessionRow),
    impersonating_client_id: sessionRow.impersonating_client_id ?? null,
  };
}

export async function setImpersonation(
  db: D1Database,
  token: string,
  clientId: string | null
): Promise<void> {
  await db
    .prepare("UPDATE sessions SET impersonating_client_id = ? WHERE token = ?")
    .bind(clientId, token)
    .run();
}

/** Middleware-style helper: fetch session info from cookie, or null. */
export async function requireSession(
  c: Context<{ Bindings: Bindings }>
): Promise<SessionInfo | null> {
  const token = getSessionTokenFromRequest(c);
  return await getSessionInfo(c.env.DB, token);
}

/** Determine whether a WITRA team member (non-super-admin) may access a given client. */
export function witraCanAccessClient(user: SessionUser, clientId: string): boolean {
  if (user.user_type !== "witra") return false;
  if (user.role === "Super Admin") return true;
  return user.assigned_clients.includes(clientId);
}
