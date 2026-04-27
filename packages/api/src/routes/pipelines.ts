import { Hono } from "hono";
import { prisma } from "@repo/db";

export const pipelinesRouter = new Hono();

// GET /api/pipelines
pipelinesRouter.get("/", async (c) => {
  const projectId = c.req.query("projectId");
  const pipelines = await prisma.pipeline.findMany({
    where: projectId ? { projectId } : undefined,
    include: {
      project: { select: { id: true, name: true, slug: true } },
      _count: { select: { deployments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: pipelines, total: pipelines.length });
});

// GET /api/pipelines/:id
pipelinesRouter.get("/:id", async (c) => {
  const pipeline = await prisma.pipeline.findUnique({
    where: { id: c.req.param("id") },
    include: { project: true, deployments: { orderBy: { createdAt: "desc" } } },
  });
  if (!pipeline) return c.json({ error: "Pipeline not found" }, 404);
  return c.json({ data: pipeline });
});

// POST /api/pipelines
pipelinesRouter.post("/", async (c) => {
  const body = await c.req.json<{ name: string; branch: string; projectId: string }>();
  const pipeline = await prisma.pipeline.create({ data: body });
  return c.json({ data: pipeline }, 201);
});

// PATCH /api/pipelines/:id/status
pipelinesRouter.patch("/:id/status", async (c) => {
  const { status, duration } = await c.req.json<{ status: string; duration?: number }>();
  const pipeline = await prisma.pipeline.update({
    where: { id: c.req.param("id") },
    data: { status: status as never, ...(duration !== undefined ? { duration } : {}) },
  });
  return c.json({ data: pipeline });
});
