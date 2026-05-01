import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { healthRouter } from "./routes/health.js";
import { projectsRouter } from "./routes/projects.js";
import { pipelinesRouter } from "./routes/pipelines.js";
import { deploymentsRouter } from "./routes/deployments.js";
import { syncRouter } from "./routes/sync.js";
import { webhooksRouter } from "./routes/webhooks.js";

const app = new Hono();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ── Routes ──────────────────────────────────────────────────────────────────
app.route("/health", healthRouter);
app.route("/api/projects", projectsRouter);
app.route("/api/pipelines", pipelinesRouter);
app.route("/api/deployments", deploymentsRouter);
app.route("/sync", syncRouter);
app.route("/webhooks", webhooksRouter);

// ── 404 ────────────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 3001);
console.log(`🚀 API server running on http://localhost:${PORT}`);

serve({ fetch: app.fetch, port: PORT });

export default app;
