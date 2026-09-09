import { Hono } from "hono";
import type { Bindings } from "../types";
import { portalContextOrFail, superAdminOrFail, witraClientAccessOrFail, witraOrFail } from "../lib/middleware";
import { hashPassword } from "../lib/auth";
import { escapeHtml, isValidEmail, newId, toJson } from "../lib/util";
import { serializeUser, serializeTeamRequest } from "../lib/serialize";

const team = new Hono<{ Bindings: Bindings }>();

// ===== WITRA internal team & All users =====
team.get("/all-users", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM users WHERE active = 1 ORDER BY user_type DESC, created_at ASC"
  ).all();
  return c.json({ users: (results || []).map(serializeUser) });
});

team.get("/witra", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM users WHERE user_type = 'witra' AND active = 1 ORDER BY created_at ASC"
  ).all();
  return c.json({ team: (results || []).map(serializeUser) });
});

team.post("/witra", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const role = String(body?.role || "Team Member");
  const assignedClientsRaw = String(body?.assignedClients || "");

  if (!name || !email) return c.json({ error: "Name and email are required." }, 400);
  if (!isValidEmail(email)) return c.json({ error: "Please enter a valid email address." }, 400);
  if (!["Team Member", "Super Admin"].includes(role)) {
    return c.json({ error: "Invalid WITRA role." }, 400);
  }
  const rawPassword = String(body?.password || "").trim();
  if (rawPassword.length < 6) {
    return c.json({ error: "A password of at least 6 characters is required." }, 400);
  }

  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) return c.json({ error: "A user with that email already exists." }, 409);

  // Assigned clients: prefer the proper multi-select picker (array of client
  // ids sent directly by the frontend); fall back to legacy comma-separated
  // name matching for backwards compatibility.
  let assignedIds: string[] = [];
  if (Array.isArray(body?.assignedClientIds) && role !== "Super Admin") {
    const validRow = await c.env.DB.prepare("SELECT id FROM clients WHERE archived = 0").all();
    const validIds = new Set((validRow.results || []).map((r: any) => r.id));
    assignedIds = body.assignedClientIds.filter((id: any) => typeof id === "string" && validIds.has(id));
  } else if (assignedClientsRaw && role !== "Super Admin") {
    const names = assignedClientsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    if (names.length) {
      const { results } = await c.env.DB.prepare("SELECT id, name FROM clients").all();
      const byName: Record<string, string> = {};
      (results || []).forEach((r: any) => (byName[r.name.toLowerCase()] = r.id));
      assignedIds = names.map((n) => byName[n.toLowerCase()]).filter(Boolean) as string[];
    }
  }

  const passwordHash = await hashPassword(rawPassword);
  const id = newId("w");

  await c.env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, name, user_type, role, assigned_clients) VALUES (?, ?, ?, ?, 'witra', ?, ?)`
  )
    .bind(id, email, passwordHash, name, role, toJson(assignedIds))
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<any>();
  return c.json({ member: serializeUser(row) }, 201);
});

team.delete("/witra/:id", async (c) => {
  const session = await superAdminOrFail(c);
  if (session instanceof Response) return session;

  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT * FROM users WHERE id = ? AND user_type = 'witra'")
    .bind(id)
    .first<any>();
  if (!existing) return c.json({ error: "Team member not found." }, 404);
  if (existing.role === "Super Admin") {
    return c.json({ error: "Super Admins cannot be removed." }, 400);
  }

  await c.env.DB.prepare("UPDATE users SET active = 0 WHERE id = ?").bind(id).run();
  return c.json({ ok: true });
});

// ===== Client-side team (per-client) =====
team.get("/client", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM users WHERE client_id = ? AND active = 1 ORDER BY created_at ASC"
  )
    .bind(ctx.clientId)
    .all();
  return c.json({ team: (results || []).map(serializeUser) });
});

// Client wants to add a teammate -> submits a REQUEST for WITRA to review,
// rather than creating the user directly. This keeps WITRA fully aware of
// every email/person that ever gets access to the platform (per WITRA's
// explicit requirement). WITRA then creates the real account on approval.
team.post("/client", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const name = String(body?.name || "").trim();
  if (!name) return c.json({ error: "Name is required." }, 400);

  const email = String(body?.email || "").trim().toLowerCase();
  if (!email) return c.json({ error: "Email is required." }, 400);
  if (!isValidEmail(email)) return c.json({ error: "Please enter a valid email address." }, 400);
  const password = String(body?.password || "");
  if (password.length < 6) {
    return c.json({ error: "Password must be at least 6 characters." }, 400);
  }

  const role = String(body?.role || "Viewer");
  if (!["Manager", "Editor", "Viewer"].includes(role)) {
    return c.json({ error: "Invalid access role." }, 400);
  }

  const existingUser = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existingUser) return c.json({ error: "A user with that email already exists." }, 409);
  const pendingRequest = await c.env.DB.prepare(
    "SELECT id FROM team_requests WHERE client_id = ? AND email = ? AND status = 'Requested'"
  ).bind(ctx.clientId, email).first();
  if (pendingRequest) return c.json({ error: "A request for that email is already pending review." }, 409);

  const id = newId("tr");
  const passwordHash = await hashPassword(password);

  await c.env.DB.prepare(
    `INSERT INTO team_requests (id, client_id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(id, ctx.clientId, email, passwordHash, name, role)
    .run();

  await c.env.DB.prepare(
    "INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'witra', ?)"
  )
    .bind(newId("ntf"), `New team member request: <b>${escapeHtml(name)}</b> (${escapeHtml(email)}) — pending your approval.`, ctx.clientId)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM team_requests WHERE id = ?").bind(id).first<any>();
  return c.json({ request: serializeTeamRequest(row) }, 201);
});

// Client: see their own pending/past team requests
team.get("/client/requests", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM team_requests WHERE client_id = ? ORDER BY created_at DESC"
  )
    .bind(ctx.clientId)
    .all();
  return c.json({ requests: (results || []).map(serializeTeamRequest) });
});

// ===== WITRA: review client team-member requests =====
team.get("/requests", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let query = "SELECT * FROM team_requests";
  const binds: any[] = [];
  if (session.user.role !== "Super Admin") {
    const assigned = session.user.assigned_clients;
    if (assigned.length === 0) return c.json({ requests: [] });
    query += ` WHERE client_id IN (${assigned.map(() => "?").join(",")})`;
    binds.push(...assigned);
  }
  query += " ORDER BY created_at DESC";
  const stmt = c.env.DB.prepare(query);
  const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();
  return c.json({ requests: (results || []).map(serializeTeamRequest) });
});

team.put("/requests/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await c.env.DB.prepare("SELECT * FROM team_requests WHERE id = ?").bind(id).first<any>();
  if (!existing) return c.json({ error: "Request not found." }, 404);

  const session = await witraClientAccessOrFail(c, existing.client_id);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }
  const status = String(body?.status || "");
  const newName = String(body?.name || existing.name).trim();
  const newEmail = String(body?.email || existing.email).trim().toLowerCase();
  const newRole = String(body?.role || existing.role).trim();
  const newPassword = body?.password ? String(body.password) : "";

  if (!["Approved", "Rejected"].includes(status)) {
    return c.json({ error: "Status must be 'Approved' or 'Rejected'." }, 400);
  }
  if (existing.status !== "Requested") {
    return c.json({ error: "This request has already been reviewed." }, 400);
  }
  if (!newName) return c.json({ error: "Name is required." }, 400);
  if (!isValidEmail(newEmail)) return c.json({ error: "Please enter a valid email address." }, 400);
  if (!["Manager", "Editor", "Viewer"].includes(newRole)) {
    return c.json({ error: "Invalid access role." }, 400);
  }

  if (status === "Approved") {
    if (!newEmail || newEmail.startsWith("pending-")) {
      return c.json({ error: "You must provide a real email address for this user." }, 400);
    }
    if (newPassword && newPassword.length < 6) {
      return c.json({ error: "Password must be at least 6 characters." }, 400);
    }

    const alreadyUser = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(newEmail).first();
    if (alreadyUser) {
      return c.json({ error: "A user with that email already exists." }, 409);
    }
    
    const finalHash = newPassword ? await hashPassword(newPassword) : existing.password_hash;

    await c.env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, name, user_type, role, client_id) VALUES (?, ?, ?, ?, 'client', ?, ?)`
    )
      .bind(newId("u"), newEmail, finalHash, newName, newRole, existing.client_id)
      .run();
    await c.env.DB.prepare(
      "INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)"
    )
    .bind(newId("ntf"), `Team member <b>${escapeHtml(newName)}</b> was approved and can now access the workspace.`, existing.client_id)
      .run();
  } else {
    await c.env.DB.prepare(
      "INSERT INTO notifications (id, text, target_user_type, client_id) VALUES (?, ?, 'client', ?)"
    )
    .bind(newId("ntf"), `Your request to add team member <b>${escapeHtml(newName)}</b> was declined.`, existing.client_id)
      .run();
  }

  await c.env.DB.prepare("UPDATE team_requests SET status = ?, name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(status, newName, newEmail, newRole, id)
    .run();
  await c.env.DB.prepare("INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)")
    .bind(newId("act"), existing.client_id, `Team request for <b>${escapeHtml(newEmail)}</b> was ${status.toLowerCase()}.`)
    .run();

  const row = await c.env.DB.prepare("SELECT * FROM team_requests WHERE id = ?").bind(id).first<any>();
  return c.json({ request: serializeTeamRequest(row) });
});


team.get("/client_users", async (c) => {
  const session = await witraOrFail(c);
  if (session instanceof Response) return session;

  let query = "SELECT * FROM users WHERE user_type = 'client' AND active = 1";
  const binds = [];
  if (session.user.role !== "Super Admin") {
    const assigned = session.user.assigned_clients;
    if (assigned.length === 0) return c.json({ clientUsers: [] });
    query += ` AND client_id IN (${assigned.map(() => "?").join(",")})`;
    binds.push(...assigned);
  }
  query += " ORDER BY client_id, created_at ASC";
  
  const stmt = c.env.DB.prepare(query);
  const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();
  return c.json({ clientUsers: (results || []).map(serializeUser) });
});

export default team;
