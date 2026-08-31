import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import type { Bindings } from "./types";

import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import clientsRoutes from "./routes/clients";
import plansRoutes from "./routes/plans";
import servicesRoutes from "./routes/services";
import requestsRoutes from "./routes/requests";
import reportsRoutes from "./routes/reports";
import activitiesRoutes from "./routes/activities";
import notificationsRoutes from "./routes/notifications";
import teamRoutes from "./routes/team";
import contentOpsRoutes from "./routes/content-ops";
import portalRoutes from "./routes/portal";
import settingsRoutes from "./routes/settings";

const app = new Hono<{ Bindings: Bindings }>();

// ---- API routes ----
app.route("/api/auth", authRoutes);
app.route("/api/dashboard", dashboardRoutes);
app.route("/api/clients", clientsRoutes);
app.route("/api/plans", plansRoutes);
app.route("/api/services", servicesRoutes);
app.route("/api/requests", requestsRoutes);
app.route("/api/reports", reportsRoutes);
app.route("/api/activities", activitiesRoutes);
app.route("/api/notifications", notificationsRoutes);
app.route("/api/team", teamRoutes);
app.route("/api/content-ops", contentOpsRoutes);
app.route("/api/portal", portalRoutes);
app.route("/api/settings", settingsRoutes);

// Fallback JSON 404 for unmatched API routes
app.all("/api/*", (c) => c.json({ error: "Not found." }, 404));

// ---- Static assets ----
app.use("/static/*", serveStatic({ root: "./public" }));

// ---- Main SPA shell ----
app.get("*", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WITRA Marketing Solutions</title>
<meta name="description" content="WITRA Marketing Solutions — Client & Agency Management Platform">
<link rel="icon" type="image/png" href="/static/img/witra-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link href="/static/style.css" rel="stylesheet">
</head>
<body>
<div id="root"><div class="app-loading"><div class="spinner"></div></div></div>
<script src="/static/app.js"></script>
</body>
</html>`);
});

export default app;
