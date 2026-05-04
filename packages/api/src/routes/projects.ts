import { Hono } from "hono";
import { prisma } from "@repo/db";

export const projectsRouter = new Hono();

// GET /api/projects
projectsRouter.get("/", async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      include: { owner: { select: { id: true, name: true, email: true, avatarUrl: true } }, _count: { select: { pipelines: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.project.count(),
  ]);

  return c.json({ data: projects, total, page, limit, totalPages: Math.ceil(total / limit) });
});

// GET /api/projects/:id
projectsRouter.get("/:id", async (c) => {
  const project = await prisma.project.findUnique({
    where: { id: c.req.param("id") },
    include: {
      owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
      pipelines: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!project) return c.json({ error: "Project not found" }, 404);
  return c.json({ data: project });
});

// POST /api/projects
projectsRouter.post("/", async (c) => {
  const body = await c.req.json<{ name: string; slug: string; description?: string; repoUrl?: string; ownerId: string }>();
  const project = await prisma.project.create({ data: body });
  return c.json({ data: project }, 201);
});

// PATCH /api/projects/:id
projectsRouter.patch("/:id", async (c) => {
  const body = await c.req.json();
  const project = await prisma.project.update({ where: { id: c.req.param("id") }, data: body });
  return c.json({ data: project });
});

// DELETE /api/projects/:id
projectsRouter.delete("/:id", async (c) => {
  await prisma.project.delete({ where: { id: c.req.param("id") } });
  return c.json({ success: true }, 200);
});
