import Link from "next/link";
import { SyncButton } from "./components/SyncButton";

const API_URL = process.env.API_URL || "http://localhost:3001";

const projectStatusClass: Record<string, string> = {
  ACTIVE: "badge-success",
  MAINTENANCE: "badge-warning",
  ARCHIVED: "badge-default",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

async function fetchProjects() {
  try {
    const res = await fetch(`${API_URL}/api/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await fetchProjects();

  return (
    <>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="page-title">Projects</div>
            <div className="page-subtitle">All repositories tracked in this monorepo workspace</div>
          </div>
          <SyncButton />
        </div>
      </div>

      {projects.length === 0 ? (
        <p style={{ padding: "2rem", color: "var(--text-secondary)", textAlign: "center" }}>
          No projects yet. Run a sync from GitHub to see data here.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {projects.map((proj: any) => (
            <div className="stat-card" key={proj.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{proj.name}</span>
                  <span className={`badge ${projectStatusClass[proj.status] || "badge-default"}`}>
                    <span className="dot" />
                    {proj.status}
                  </span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                  {proj.description || "No description"}
                </p>
                <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <span>
                    <span className="avatar" style={{ display: "inline-flex", width: 22, height: 22, fontSize: "0.6rem", marginRight: "0.35rem", verticalAlign: "middle" }}>
                      {proj.owner ? getInitials(proj.owner.name) : "NA"}
                    </span>
                    {proj.owner?.name || "Unknown"}
                  </span>
                  <span>🔄 {proj._count?.pipelines || 0} pipelines</span>
                  {proj.repoUrl && (
                    <a href={proj.repoUrl} className="external" target="_blank" rel="noopener noreferrer">↗ Repo</a>
                  )}
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
      )}
    </>
  );
}
