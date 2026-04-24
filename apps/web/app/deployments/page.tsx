const deployments = [
  { id: "1", env: "PRODUCTION", status: "SUCCESS", project: "Storefront", commitSha: "a1b2c3d", commitMsg: "feat: add checkout flow with stripe integration", deployedBy: { name: "Alice Chen", initials: "AC" }, url: "https://storefront.devops-mono.io", date: "2026-04-28" },
  { id: "2", env: "STAGING", status: "IN_PROGRESS", project: "Storefront", commitSha: "d4e5f6a", commitMsg: "feat: persistent cart with redis", deployedBy: { name: "Bob Müller", initials: "BM" }, url: "https://storefront-staging.devops-mono.io", date: "2026-04-28" },
  { id: "3", env: "PRODUCTION", status: "FAILED", project: "API Gateway", commitSha: "b7c8d9e", commitMsg: "fix: rate limiter sliding window edge case", deployedBy: { name: "Bob Müller", initials: "BM" }, url: null, date: "2026-04-27" },
  { id: "4", env: "PRODUCTION", status: "SUCCESS", project: "Admin Dashboard", commitSha: "c1d2e3f", commitMsg: "fix: sidebar nav collapse on mobile", deployedBy: { name: "Alice Chen", initials: "AC" }, url: "https://admin.devops-mono.io", date: "2026-04-27" },
  { id: "5", env: "PRODUCTION", status: "SUCCESS", project: "API Gateway", commitSha: "f4a5b6c", commitMsg: "perf: connection pool tuning", deployedBy: { name: "Bob Müller", initials: "BM" }, url: "https://api.devops-mono.io", date: "2026-04-25" },
];

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

export default function DeploymentsPage() {
  const successes = deployments.filter((d) => d.status === "SUCCESS").length;
  const failures  = deployments.filter((d) => d.status === "FAILED").length;

  return (
    <>
      <div className="page-header">
        <div className="page-title">Deployments</div>
        <div className="page-subtitle">All environment deployments across the monorepo</div>
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
              {deployments.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: "0.82rem" }}>{d.commitMsg}</div>
                    <div className="mono" style={{ marginTop: "0.15rem" }}>{d.commitSha}</div>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{d.project}</td>
                  <td>
                    <span className={`badge ${envClass[d.env] ?? "badge-default"}`}>{d.env}</span>
                  </td>
                  <td>
                    <span className={`badge ${statusClass[d.status]}`}>
                      <span className={`dot ${statusDot[d.status]}`} /> {d.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span className="avatar-group">
                      <span className="avatar">{d.deployedBy.initials}</span>
                      {d.deployedBy.name}
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
                  <td className="mono" style={{ color: "var(--text-secondary)" }}>{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
