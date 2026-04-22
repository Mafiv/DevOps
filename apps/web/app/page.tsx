import Link from "next/link";

const stats = [
  { label: "Total Projects", value: "3", delta: "+1 this week" },
  { label: "Pipelines Run", value: "47", delta: "+12 this week" },
  { label: "Deployments", value: "31", delta: "+8 this week" },
  { label: "Success Rate", value: "94%", delta: "↑ 2% vs last week" },
];

const recentPipelines = [
  { id: "1", project: "Storefront", branch: "main", status: "SUCCESS", duration: "2m 22s", ago: "3h ago" },
  { id: "2", project: "Storefront", branch: "feat/cart", status: "RUNNING", duration: "—", ago: "Just now" },
  { id: "3", project: "API Gateway", branch: "main", status: "FAILED", duration: "38s", ago: "5h ago" },
  { id: "4", project: "Admin Dashboard", branch: "hotfix/nav", status: "SUCCESS", duration: "1m 10s", ago: "1d ago" },
];

const statusClass: Record<string, string> = {
  SUCCESS: "badge-success",
  RUNNING: "badge-info",
  FAILED: "badge-danger",
  PENDING: "badge-default",
};

const statusDotClass: Record<string, string> = {
  SUCCESS: "",
  RUNNING: "dot-pulse",
  FAILED: "",
  PENDING: "",
};

export default function DashboardPage() {
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
            <>
              <div className="step" key={s}>{s}</div>
              {i < arr.length - 1 && <span className="step-arrow">→</span>}
            </>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-delta">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Recent Pipelines */}
      <div className="section">
        <div className="section-title">Recent Pipelines</div>
        <div className="table-card">
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
              {recentPipelines.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href="/projects" className="external">{p.project}</Link>
                  </td>
                  <td><span className="mono">{p.branch}</span></td>
                  <td>
                    <span className={`badge ${statusClass[p.status]}`}>
                      <span className={`dot ${statusDotClass[p.status]}`} />
                      {p.status}
                    </span>
                  </td>
                  <td className="mono">{p.duration}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.ago}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
