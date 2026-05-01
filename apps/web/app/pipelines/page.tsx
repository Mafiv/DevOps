const API_URL = process.env.API_URL || "http://localhost:3001";

const statusClass: Record<string, string> = {
  SUCCESS: "badge-success",
  RUNNING: "badge-info",
  FAILED: "badge-danger",
  PENDING: "badge-default",
  CANCELLED: "badge-warning",
};
const statusDot: Record<string, string> = { RUNNING: "dot-pulse", SUCCESS: "", FAILED: "", PENDING: "", CANCELLED: "" };

const stepsData = ["Checkout", "Install", "Lint", "Test", "Build", "Deploy"];

function formatDuration(seconds?: number | null): string {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function fetchPipelines() {
  try {
    const res = await fetch(`${API_URL}/api/pipelines`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function PipelinesPage() {
  const pipelines = await fetchPipelines();

  return (
    <>
      <div className="page-header">
        <div className="page-title">Pipelines</div>
        <div className="page-subtitle">CI/CD pipeline runs across all projects</div>
      </div>

      {/* Pipeline Steps Visualiser */}
      <div className="hero" style={{ padding: "1.5rem 2rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Typical Pipeline</div>
        <div className="pipeline-steps">
          {stepsData.map((s, i, arr) => (
            <div className="step-wrapper" key={s} style={{ display: "inline-flex", alignItems: "center" }}>
              <div className="step">
                <span style={{ color: "var(--accent)" }}>{i + 1}.</span> {s}
              </div>
              {i < arr.length - 1 && <span className="step-arrow">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="table-card">
          {pipelines.length === 0 ? (
            <p style={{ padding: "2rem", color: "var(--text-secondary)", textAlign: "center" }}>
              No pipelines found. Run a sync from GitHub to populate data.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Pipeline</th>
                  <th>Project</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Deployments</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {pipelines.map((p: any) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{p.project?.name || "Unknown"}</td>
                    <td><span className="mono">{p.branch}</span></td>
                    <td>
                      <span className={`badge ${statusClass[p.status] || "badge-default"}`}>
                        <span className={`dot ${statusDot[p.status] || ""}`} /> {p.status}
                      </span>
                    </td>
                    <td className="mono">{formatDuration(p.duration)}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{p.deployments?.length ?? 0}</td>
                    <td className="mono" style={{ color: "var(--text-secondary)" }}>{formatDate(p.createdAt)}</td>
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
