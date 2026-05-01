import { Hono } from "hono";
import { prisma } from "@repo/db";
import { createHmac } from "crypto";

export const webhooksRouter = new Hono();

// Verify GitHub webhook signature
function verifyGitHubSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(payload).digest("hex");
  return digest === signature;
}

// GitHub Actions webhook
webhooksRouter.post("/github", async (c) => {
  const secret = process.env.WEBHOOK_SECRET;
  const signature = c.req.header("x-hub-signature-256");
  const event = c.req.header("x-github-event");

  if (!secret) {
    return c.json({ error: "WEBHOOK_SECRET not configured" }, 500);
  }

  const payload = await c.req.text();

  // Verify signature (skip in development if needed)
  if (signature && !verifyGitHubSignature(payload, signature, secret)) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  const data = JSON.parse(payload);

  // Handle workflow_run events
  if (event === "workflow_run" && data.action === "completed") {
    const run = data.workflow_run;
    const repo = data.repository;

    // Find or create project
    let project = await prisma.project.findUnique({
      where: { slug: repo.name },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: repo.name,
          slug: repo.name,
          description: repo.description || undefined,
          repoUrl: repo.html_url,
          ownerId: "system",
        },
      });
    }

    // Map conclusion to our status
    const conclusion = run.conclusion?.toUpperCase();
    const status = conclusion === "SUCCESS"
      ? "SUCCESS"
      : conclusion === "FAILURE" || conclusion === "CANCELLED"
      ? "FAILED"
      : "RUNNING";

    // Calculate duration in seconds
    const startedAt = new Date(run.run_started_at).getTime();
    const updatedAt = new Date(run.updated_at).getTime();
    const duration = Math.round((updatedAt - startedAt) / 1000);

    await prisma.pipeline.upsert({
      where: { id: `gh-${run.id}` },
      create: {
        id: `gh-${run.id}`,
        name: run.name,
        branch: run.head_branch,
        status: status as any,
        duration,
        projectId: project.id,
      },
      update: {
        status: status as any,
        duration,
      },
    });

    return c.json({ success: true, message: "Workflow run recorded" });
  }

  // Handle push events (new pipeline starts)
  if (event === "push" && data.ref.startsWith("refs/heads/")) {
    const branch = data.ref.replace("refs/heads/", "");
    const repo = data.repository;

    let project = await prisma.project.findUnique({
      where: { slug: repo.name },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: repo.name,
          slug: repo.name,
          description: repo.description || undefined,
          repoUrl: repo.html_url,
          ownerId: "system",
        },
      });
    }

    // Create a pending pipeline entry
    await prisma.pipeline.create({
      data: {
        name: `Push to ${branch}`,
        branch,
        status: "PENDING",
        projectId: project.id,
      },
    });

    return c.json({ success: true, message: "Push event recorded" });
  }

  return c.json({ success: true, message: "Event ignored" });
});

// Vercel webhook
webhooksRouter.post("/vercel", async (c) => {
  const data = await c.req.json();

  if (data.type === "deployment" && data.payload) {
    const deploy = data.payload;
    const projectName = deploy.name;

    // Find matching project
    const project = await prisma.project.findUnique({
      where: { slug: projectName },
    });

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Find latest pipeline
    const pipeline = await prisma.pipeline.findFirst({
      where: { projectId: project.id },
      orderBy: { createdAt: "desc" },
    });

    if (!pipeline) {
      return c.json({ error: "No pipeline found for project" }, 404);
    }

    const status = deploy.state === "READY"
      ? "SUCCESS"
      : deploy.state === "ERROR"
      ? "FAILED"
      : "IN_PROGRESS";

    await prisma.deployment.upsert({
      where: { id: `vercel-${deploy.id}` },
      create: {
        id: `vercel-${deploy.id}`,
        env: deploy.target === "production" ? "PRODUCTION" : "STAGING",
        status: status as any,
        url: deploy.url,
        commitSha: deploy.meta?.githubCommitSha || "unknown",
        commitMsg: deploy.meta?.githubCommitMessage || "No message",
        pipelineId: pipeline.id,
        deployedBy: "system",
      },
      update: {
        status: status as any,
        url: deploy.url,
      },
    });

    return c.json({ success: true, message: "Deployment recorded" });
  }

  return c.json({ success: true, message: "Event ignored" });
});
