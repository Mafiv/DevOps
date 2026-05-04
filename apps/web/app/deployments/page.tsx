import { SyncButton } from "./components/SyncButton";

const API_URL = process.env.API_URL || "http://localhost:3001";

const statusClass: Record<string, string> = {
  SUCCESS: "badge-success",
  IN_PROGRESS: "badge-info",
  FAILED: "badge-danger",
  PENDING: "badge-default",
  ROLLED_BACK: "badge-warning",
};
const statusDot: Record<string, string> = { IN_PROGRESS: "dot-pulse", SUCCESS: "", FAILED: "", PENDING: "", ROLLED_BACK: "" };

const envClass: Record<string, string> = {
  PRODUCTION: "badge-purple",
  STAGING: "badge-warning",
  DEVELOPMENT: "badge-default",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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

async function fetchDeployments() {
  try {
    const res = await fetch(`${API_URL}/api/deployments`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function DeploymentsPage() {
  const deployments = await fetchDeployments();
  const successes = deployments.filter((d: any) => d.status === "SUCCESS").length;
  const failures = deployments.filter((d: any) => d.status === "FAILED").length;

  return (
    <>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="page-title">Deployments</div>
            <div className="page-subtitle">All environment deployments across the monorepo</div>
          </div>
          <SyncButton />
        </div>
      </div>

      {/* Quick stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{deployments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Successful</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{successes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Failed</div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>{failures}</div>
        </div>
      </div>

      <div className="section">
        <div className="table-card">
          {deployments.length === 0 ? (
            <p style={{ padding: "2rem", color: "var(--text-secondary)", textAlign: "center" }}>
              No deployments yet. Run a sync from Vercel to see data here.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Commit</th>
                  <th>Project</th>
                  <th>Env</th>
                  <th>Status</th>
                  <th>Deployed By</th>
                  <th>URL</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((d: any) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: "0.82rem" }}>{d.commitMessage || "No message"}</div>
                      <div className="mono" style={{ marginTop: "0.15rem" }}>{d.commitSha || "—"}</div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{d.pipeline?.project?.name || "Unknown"}</td>
                    <td>
                      <span className={`badge ${envClass[d.environment] ?? "badge-default"}`}>{d.environment}</span>
                    </td>
                    <td>
                      <span className={`badge ${statusClass[d.status]}`}>
                        <span className={`dot ${statusDot[d.status]}`} /> {d.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <span className="avatar-group">
                        <span className="avatar">{d.deployer ? getInitials(d.deployer.name) : "NA"}</span>
                        {d.deployer?.name || "Unknown"}
                      </span>
                    </td>
                    <td>
                      {d.url ? (
                        <a href={d.url} className="external mono" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem" }}>
                          ↗ {d.url.replace("https://", "")}
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>—</span>
                      )}
                    </td>
                    <td className="mono" style={{ color: "var(--text-secondary)" }}>{timeAgo(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
