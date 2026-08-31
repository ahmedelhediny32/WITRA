import { Hono } from "hono";
import type { Bindings } from "../types";
import {
  createSession,
  destroySession,
  getSessionTokenFromRequest,
  requireSession,
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
  setImpersonation,
  witraCanAccessClient,
} from "../lib/auth";
import { serializeUser } from "../lib/serialize";
import { isValidEmail } from "../lib/util";
import { witraOrFail } from "../lib/middleware";

const auth = new Hono<{ Bindings: Bindings }>();

auth.post("/login", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) {
    return c.json({ error: "Please enter both email and password." }, 400);
  }
  if (!isValidEmail(email)) {
    return c.json({ error: "Please enter a valid email address." }, 400);
  }

  const userRow = await c.env.DB.prepare(
    "SELECT * FROM users WHERE email = ? AND active = 1"
  )
    .bind(email)
    .first<any>();

  if (!userRow) {
    return c.json({ error: "No account found with that email and password." }, 401);
  }

  const valid = await verifyPassword(password, userRow.password_hash);
  if (!valid) {
    return c.json({ error: "No account found with that email and password." }, 401);
  }

  const token = await createSession(c.env.DB, userRow.id);
  setSessionCookie(c, token);

  return c.json({
    user: serializeUser(userRow),
    view: userRow.user_type === "client" ? "client" : "admin",
  });
});

auth.post("/logout", async (c) => {
  const token = getSessionTokenFromRequest(c);
  if (token) {
    await destroySession(c.env.DB, token);
  }
  clearSessionCookie(c);
  return c.json({ ok: true });
});

auth.get("/me", async (c) => {
  const session = await requireSession(c);
  if (!session) {
    return c.json({ authenticated: false }, 200);
  }
  const u = session.user;
  return c.json({
    authenticated: true,
    user: {
      id: u.id,
      email: u.email,
      name: u.name,
      userType: u.user_type,
      role: u.role,
      clientId: u.client_id,
      assignedClients: u.assigned_clients,
      avatarImage: u.avatar_image,
    },
    impersonatingClientId: session.impersonating_client_id,
    view: u.user_type === "client" ? "client" : "admin",
  });
});

// WITRA admin: stop impersonating and go back to the admin view
// NOTE: this exact-path route MUST be registered before the dynamic
// "/impersonate/:clientId" route below, otherwise Hono matches "exit"
// as a :clientId value and this handler is never reached.
auth.post("/impersonate/exit", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  await setImpersonation(c.env.DB, session.token, null);
  return c.json({ ok: true });
});

// WITRA admin: start viewing a client's portal (impersonation)
auth.post("/impersonate/:clientId", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  const clientId = c.req.param("clientId");
  const clientRow = await c.env.DB.prepare("SELECT id FROM clients WHERE id = ?").bind(clientId).first();
  if (!clientRow) return c.json({ error: "Client not found." }, 404);
  if (!witraCanAccessClient(session.user, clientId)) {
    return c.json({ error: "You do not have access to this client." }, 403);
  }

  await setImpersonation(c.env.DB, session.token, clientId);
  return c.json({ ok: true, impersonatingClientId: clientId });
});

export default auth;
