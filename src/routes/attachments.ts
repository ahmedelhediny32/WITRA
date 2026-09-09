import { Hono } from "hono";
import type { Bindings } from "../types";
import { witraClientAccessOrFail, portalContextOrFail } from "../lib/middleware";
import { newId } from "../lib/util";

const VALID_LABELS = ["Strategy", "SWOT Analysis", "Marketing Plan", "Business Plan", "Brand Guidelines", "Other"];
const MAX_FILE_SIZE = 10_000_000; // ~10 MB original file (≈13 MB base64)

const attachments = new Hono<{ Bindings: Bindings }>();

// ──────────────── ADMIN (WITRA) ENDPOINTS ────────────────

// List attachments for a specific client (WITRA admin view)
attachments.get("/client/:clientId", async (c) => {
  const clientId = c.req.param("clientId");
  const session = await witraClientAccessOrFail(c, clientId);
  if (session instanceof Response) return session;

  const { results } = await c.env.DB.prepare(
    "SELECT a.id, a.client_id, a.label, a.filename, a.mime_type, a.file_size, a.uploaded_by, a.created_at, u.name AS uploader_name FROM attachments a LEFT JOIN users u ON a.uploaded_by = u.id WHERE a.client_id = ? ORDER BY a.created_at DESC"
  ).bind(clientId).all();

  return c.json({ attachments: (results || []).map(serializeAttachment) });
});

// Upload a new attachment (WITRA admin only)
attachments.post("/client/:clientId", async (c) => {
  const clientId = c.req.param("clientId");
  const session = await witraClientAccessOrFail(c, clientId);
  if (session instanceof Response) return session;

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body." }, 400);
  }

  const label = VALID_LABELS.includes(body?.label) ? body.label : "Other";
  const filename = String(body?.filename || "").trim();
  if (!filename) return c.json({ error: "Filename is required." }, 400);

  const fileData = String(body?.fileData || "");
  if (!fileData || !fileData.startsWith("data:")) {
    return c.json({ error: "File data is required (data URL format)." }, 400);
  }

  const mimeType = String(body?.mimeType || "");
  const fileSize = Number(body?.fileSize || 0);

  if (fileSize > MAX_FILE_SIZE) {
    return c.json({ error: "File is too large. Maximum size is ~10 MB." }, 400);
  }

  const id = newId("att");
  await c.env.DB.prepare(
    "INSERT INTO attachments (id, client_id, label, filename, mime_type, file_data, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, clientId, label, filename, mimeType, fileData, fileSize, session.user.id).run();

  // Log the activity
  await c.env.DB.prepare(
    "INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)"
  ).bind(newId("act"), clientId, `New attachment uploaded: <b>${escHtml(filename)}</b> (${label})`).run();

  const row = await c.env.DB.prepare(
    "SELECT a.id, a.client_id, a.label, a.filename, a.mime_type, a.file_size, a.uploaded_by, a.created_at, u.name AS uploader_name FROM attachments a LEFT JOIN users u ON a.uploaded_by = u.id WHERE a.id = ?"
  ).bind(id).first<any>();

  return c.json({ attachment: serializeAttachment(row) }, 201);
});

// Delete an attachment (WITRA admin only)
attachments.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const row = await c.env.DB.prepare("SELECT id, client_id, filename FROM attachments WHERE id = ?").bind(id).first<any>();
  if (!row) return c.json({ error: "Attachment not found." }, 404);

  // Check access to this client
  const session = await witraClientAccessOrFail(c, row.client_id);
  if (session instanceof Response) return session;

  await c.env.DB.prepare("DELETE FROM attachments WHERE id = ?").bind(id).run();

  await c.env.DB.prepare(
    "INSERT INTO activities (id, client_id, text) VALUES (?, ?, ?)"
  ).bind(newId("act"), row.client_id, `Attachment removed: <b>${escHtml(row.filename)}</b>`).run();

  return c.json({ ok: true });
});

// ──────────────── PORTAL (CLIENT) ENDPOINTS ────────────────

// List attachments for the logged-in client
attachments.get("/portal", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const { results } = await c.env.DB.prepare(
    "SELECT a.id, a.client_id, a.label, a.filename, a.mime_type, a.file_size, a.uploaded_by, a.created_at, u.name AS uploader_name FROM attachments a LEFT JOIN users u ON a.uploaded_by = u.id WHERE a.client_id = ? ORDER BY a.created_at DESC"
  ).bind(ctx.clientId).all();

  return c.json({ attachments: (results || []).map(serializeAttachment) });
});

// Download a single attachment (portal)
attachments.get("/portal/:id/download", async (c) => {
  const ctx = await portalContextOrFail(c);
  if (ctx instanceof Response) return ctx;

  const id = c.req.param("id");
  const row = await c.env.DB.prepare(
    "SELECT * FROM attachments WHERE id = ? AND client_id = ?"
  ).bind(id, ctx.clientId).first<any>();

  if (!row) return c.json({ error: "Attachment not found." }, 404);

  return c.json({
    id: row.id,
    filename: row.filename,
    mimeType: row.mime_type,
    fileData: row.file_data
  });
});

// ──────────────── HELPERS ────────────────

function serializeAttachment(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    clientId: row.client_id,
    label: row.label,
    filename: row.filename,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    uploadedBy: row.uploaded_by,
    uploaderName: row.uploader_name || "WITRA",
    createdAt: row.created_at
  };
}

function escHtml(s: string): string {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default attachments;
