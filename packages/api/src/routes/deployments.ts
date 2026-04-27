import { Hono } from "hono";
import { prisma } from "@repo/db";

export const deploymentsRouter = new Hono();

// GET /api/deployments
deploymentsRouter.get("/", async (c) => {
  const env = c.req.query("env");
  const pipelineId = c.req.query("pipelineId");
  const deployments = await prisma.deployment.findMany({
    where: {
      ...(env ? { env: env as never } : {}),
      ...(pipelineId ? { pipelineId } : {}),
    },
    include: {
      pipeline: { select: { id: true, name: true } },
      deployer: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: deployments, total: deployments.length });
});

// GET /api/deployments/:id
deploymentsRouter.get("/:id", async (c) => {
  const deployment = await prisma.deployment.findUnique({
    where: { id: c.req.param("id") },
    include: {
      pipeline: { include: { project: true } },
      deployer: true,
    },
  });
  if (!deployment) return c.json({ error: "Deployment not found" }, 404);
  return c.json({ data: deployment });
});

// POST /api/deployments
deploymentsRouter.post("/", async (c) => {
  const body = await c.req.json<{
    env: string;
    commitSha: string;
    commitMsg: string;
    pipelineId: string;
    deployedBy: string;
    url?: string;
  }>();
  const deployment = await prisma.deployment.create({ data: body as never });
  return c.json({ data: deployment }, 201);
});

// PATCH /api/deployments/:id/status
deploymentsRouter.patch("/:id/status", async (c) => {
  const { status, url } = await c.req.json<{ status: string; url?: string }>();
  const deployment = await prisma.deployment.update({
    where: { id: c.req.param("id") },
    data: { status: status as never, ...(url ? { url } : {}) },
  });
  return c.json({ data: deployment });
});
