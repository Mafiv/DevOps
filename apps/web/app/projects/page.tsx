import Link from "next/link";

const projects = [
  {
    id: "1",
    name: "Storefront",
    slug: "storefront",
    description: "E-commerce storefront powered by Next.js with full cart, checkout and Stripe integration.",
    status: "ACTIVE",
    owner: { name: "Alice Chen", initials: "AC" },
    pipelines: 18,
    repoUrl: "https://github.com/devops-mono/storefront",
  },
  {
    id: "2",
    name: "API Gateway",
    slug: "api-gateway",
    description: "Hono-based REST API gateway with JWT auth, rate limiting, and request logging.",
    status: "ACTIVE",
    owner: { name: "Bob Müller", initials: "BM" },
    pipelines: 21,
    repoUrl: "https://github.com/devops-mono/api-gateway",
  },
  {
    id: "3",
    name: "Admin Dashboard",
    slug: "admin-dashboard",
    description: "Internal operations and analytics dashboard for platform administrators.",
    status: "MAINTENANCE",
    owner: { name: "Alice Chen", initials: "AC" },
    pipelines: 8,
    repoUrl: "https://github.com/devops-mono/dashboard",
  },
];

const projectStatusClass: Record<string, string> = {
  ACTIVE: "badge-success",
  MAINTENANCE: "badge-warning",
  ARCHIVED: "badge-default",
};

export default function ProjectsPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-title">Projects</div>
        <div className="page-subtitle">All repositories tracked in this monorepo workspace</div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {projects.map((proj) => (
          <div className="stat-card" key={proj.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{proj.name}</span>
                <span className={`badge ${projectStatusClass[proj.status]}`}>
                  <span className="dot" />
                  {proj.status}
                </span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>{proj.description}</p>
              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <span>
                  <span className="avatar" style={{ display: "inline-flex", width: 22, height: 22, fontSize: "0.6rem", marginRight: "0.35rem", verticalAlign: "middle" }}>{proj.owner.initials}</span>
                  {proj.owner.name}
                </span>
                <span>🔄 {proj.pipelines} pipelines</span>
                <a href={proj.repoUrl} className="external" target="_blank" rel="noopener noreferrer">↗ Repo</a>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
              <Link href="/pipelines" className="badge badge-info" style={{ textDecoration: "none", cursor: "pointer" }}>
                View Pipelines →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
