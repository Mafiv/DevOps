import Link from "next/link";

const API_URL = process.env.API_URL || "http://localhost:3001";

const statusClass: Record<string, string> = {
  SUCCESS: "badge-success",
  RUNNING: "badge-info",
  FAILED: "badge-danger",
  PENDING: "badge-default",
  CANCELLED: "badge-warning",
};

const statusDotClass: Record<string, string> = {
  SUCCESS: "",
  RUNNING: "dot-pulse",
  FAILED: "",
  PENDING: "",
  CANCELLED: "",
};

function formatDuration(seconds?: number | null): string {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

async function fetchStats() {
  try {
    const [projectsRes, pipelinesRes, deploymentsRes] = await Promise.all([
      fetch(`${API_URL}/api/projects`, { cache: "no-store" }),
      fetch(`${API_URL}/api/pipelines`, { cache: "no-store" }),
      fetch(`${API_URL}/api/deployments`, { cache: "no-store" }),
    ]);

    const projects = projectsRes.ok ? await projectsRes.json() : { data: [] };
    const pipelines = pipelinesRes.ok ? await pipelinesRes.json() : { data: [] };
    const deployments = deploymentsRes.ok ? await deploymentsRes.json() : { data: [] };

    const totalPipelines = pipelines.data?.length || 0;
    const successful = pipelines.data?.filter((p: any) => p.status === "SUCCESS").length || 0;
    const successRate = totalPipelines > 0 ? Math.round((successful / totalPipelines) * 100) : 0;

    return {
      projects: projects.data?.length || 0,
      pipelines: totalPipelines,
      deployments: deployments.data?.length || 0,
      successRate,
    };
  } catch {
    return { projects: 0, pipelines: 0, deployments: 0, successRate: 0 };
  }
}

async function fetchRecentPipelines() {
  try {
    const res = await fetch(`${API_URL}/api/pipelines`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.slice(0, 10) || [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const stats = await fetchStats();
  const recentPipelines = await fetchRecentPipelines();

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="page-title hero-title">
          Welcome to <span>DevOps/mono</span>
        </div>
        <p className="hero-sub">
          A Turborepo monorepo showcasing modern CI/CD — separate backend, database,
          UI component library, and web dashboard all in one repo.
        </p>
        <div className="pipeline-steps">
          {["📦 Install", "🔍 Lint", "✅ Test", "🏗️ Build", "🚀 Deploy"].map((s, i, arr) => (
            <div className="step-wrapper" key={s} style={{ display: "inline-flex", alignItems: "center" }}>
              <div className="step">{s}</div>
              {i < arr.length - 1 && <span className="step-arrow">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: "Total Projects", value: stats.projects.toString() },
          { label: "Pipelines Run", value: stats.pipelines.toString() },
          { label: "Deployments", value: stats.deployments.toString() },
          { label: "Success Rate", value: `${stats.successRate}%` },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Pipelines */}
      <div className="section">
        <div className="section-title">Recent Pipelines</div>
        <div className="table-card">
          {recentPipelines.length === 0 ? (
            <p style={{ padding: "2rem", color: "var(--text-secondary)", textAlign: "center" }}>
              No pipelines yet. Run a sync from GitHub to see data here.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recentPipelines.map((p: any) => (
                  <tr key={p.id}>
                    <td>
                      <Link href="/projects" className="external">{p.project?.name || "Unknown"}</Link>
                    </td>
                    <td><span className="mono">{p.branch}</span></td>
                    <td>
                      <span className={`badge ${statusClass[p.status] || "badge-default"}`}>
                        <span className={`dot ${statusDotClass[p.status] || ""}`} />
                        {p.status}
                      </span>
                    </td>
                    <td className="mono">{formatDuration(p.duration)}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{timeAgo(p.updatedAt || p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Monorepo structure */}
      <div className="section">
        <div className="section-title">Workspace Packages</div>
        <div className="two-col">
          {[
            { name: "@repo/ui", desc: "Shared React component library — Button, Card, Badge, Avatar, StatusBadge, Spinner", tag: "packages/ui" },
            { name: "@repo/db", desc: "Prisma + SQLite schema for User, Project, Pipeline, Deployment, AuditLog", tag: "packages/db" },
            { name: "@repo/api", desc: "Hono REST API server with full CRUD on projects, pipelines, deployments", tag: "packages/api" },
            { name: "@repo/config", desc: "Shared ESLint, TypeScript and Prettier configs consumed by all packages", tag: "packages/config" },
          ].map((pkg) => (
            <div className="stat-card" key={pkg.name} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{pkg.name}</span>
                <span className="badge badge-info mono">{pkg.tag}</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{pkg.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
