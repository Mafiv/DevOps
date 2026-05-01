import { Hono } from "hono";
import { prisma } from "@repo/db";

export const syncRouter = new Hono();

// ── GitHub Sync ────────────────────────────────────────────────

async function fetchGitHubRepos(token: string) {
  const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "DevOps-Mono",
    },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json() as Promise<Array<{
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    updated_at: string;
    owner: { id: number; login: string; avatar_url: string };
  }>>;
}

async function fetchGitHubWorkflowRuns(token: string, owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "DevOps-Mono",
      },
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.workflow_runs as Array<{
    id: number;
    name: string;
    head_branch: string;
    status: string;
    conclusion: string | null;
    run_started_at: string;
    updated_at: string;
  }>;
}

syncRouter.post("/github", async (c) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return c.json({ error: "GITHUB_TOKEN not configured" }, 500);

  try {
    const repos = await fetchGitHubRepos(token);
    let pipelinesCreated = 0;
    let projectsCreated = 0;

    for (const repo of repos) {
      // Upsert project
      const project = await prisma.project.upsert({
        where: { slug: repo.name },
        create: {
          name: repo.name,
          slug: repo.name,
          description: repo.description || undefined,
          repoUrl: repo.html_url,
          ownerId: "system", // You can link to a real user later
        },
        update: {
          description: repo.description || undefined,
          repoUrl: repo.html_url,
        },
      });
      projectsCreated++;

      // Fetch workflow runs for this repo
      const [owner] = repo.full_name.split("/");
      const runs = await fetchGitHubWorkflowRuns(token, owner, repo.name);

      for (const run of runs) {
        const status = run.conclusion
          ? run.conclusion.toUpperCase().replace("SUCCESS", "SUCCESS").replace("FAILURE", "FAILED")
          : "RUNNING";

        await prisma.pipeline.upsert({
          where: { id: `gh-${run.id}` },
          create: {
            id: `gh-${run.id}`,
            name: run.name,
            branch: run.head_branch,
            status: status as any,
            projectId: project.id,
          },
          update: {
            status: status as any,
          },
        });
        pipelinesCreated++;
      }
    }

    return c.json({
      success: true,
      projectsSynced: projectsCreated,
      pipelinesSynced: pipelinesCreated,
    });
  } catch (err) {
    console.error("GitHub sync error:", err);
    return c.json({ error: "Failed to sync GitHub data" }, 500);
  }
});

// ── Vercel Sync ────────────────────────────────────────────────

async function fetchVercelProjects(token: string) {
  const res = await fetch("https://api.vercel.com/v9/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Vercel API error: ${res.status}`);
  const data = await res.json();
  return data.projects as Array<{
    id: string;
    name: string;
    latestDeployments?: Array<{
      id: string;
      url: string;
      state: string;
      created: number;
      meta?: { githubCommitSha?: string; githubCommitMessage?: string };
    }>;
  }>;
}

syncRouter.post("/vercel", async (c) => {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return c.json({ error: "VERCEL_TOKEN not configured" }, 500);

  try {
    const projects = await fetchVercelProjects(token);
    let deploymentsCreated = 0;

    for (const project of projects) {
      // Find matching local project by name
      const localProject = await prisma.project.findUnique({
        where: { slug: project.name },
      });

      if (!localProject || !project.latestDeployments) continue;

      for (const deploy of project.latestDeployments.slice(0, 5)) {
        const status = deploy.state.toUpperCase() === "READY"
          ? "SUCCESS"
          : deploy.state.toUpperCase() === "ERROR"
          ? "FAILED"
          : "IN_PROGRESS";

        // Find or create a pipeline for this deployment
        const pipeline = await prisma.pipeline.findFirst({
          where: { projectId: localProject.id },
          orderBy: { createdAt: "desc" },
        });

        if (!pipeline) continue;

        await prisma.deployment.upsert({
          where: { id: `vercel-${deploy.id}` },
          create: {
            id: `vercel-${deploy.id}`,
            env: "PRODUCTION",
            status: status as any,
            url: `https://${deploy.url}`,
            commitSha: deploy.meta?.githubCommitSha || "unknown",
            commitMsg: deploy.meta?.githubCommitMessage || "No message",
            pipelineId: pipeline.id,
            deployedBy: "system",
          },
          update: {
            status: status as any,
            url: `https://${deploy.url}`,
          },
        });
        deploymentsCreated++;
      }
    }

    return c.json({
      success: true,
      deploymentsSynced: deploymentsCreated,
    });
  } catch (err) {
    console.error("Vercel sync error:", err);
    return c.json({ error: "Failed to sync Vercel data" }, 500);
  }
});

// ── Full Sync ──────────────────────────────────────────────────

syncRouter.post("/all", async (c) => {
  const results: Record<string, any> = {};

  // Sync GitHub
  const githubRes = await fetch("http://localhost:3001/sync/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  results.github = await githubRes.json();

  // Sync Vercel
  const vercelRes = await fetch("http://localhost:3001/sync/vercel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  results.vercel = await vercelRes.json();

  return c.json({ success: true, results });
});
