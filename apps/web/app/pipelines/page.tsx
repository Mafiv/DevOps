const pipelines = [
  { id: "1", name: "main → production", project: "Storefront", branch: "main", status: "SUCCESS", duration: "2m 22s", deployments: 1, date: "2026-04-28" },
  { id: "2", name: "feat/cart → staging", project: "Storefront", branch: "feat/cart", status: "RUNNING", duration: "—", deployments: 0, date: "2026-04-28" },
  { id: "3", name: "main → production", project: "API Gateway", branch: "main", status: "FAILED", duration: "38s", deployments: 0, date: "2026-04-27" },
  { id: "4", name: "hotfix/nav → production", project: "Admin Dashboard", branch: "hotfix/nav", status: "SUCCESS", duration: "1m 10s", deployments: 1, date: "2026-04-27" },
  { id: "5", name: "main → production", project: "API Gateway", branch: "main", status: "SUCCESS", duration: "1m 55s", deployments: 1, date: "2026-04-25" },
  { id: "6", name: "release/2.1 → production", project: "Storefront", branch: "release/2.1", status: "SUCCESS", duration: "3m 04s", deployments: 2, date: "2026-04-23" },
];

const statusClass: Record<string, string> = {
  SUCCESS: "badge-success",
  RUNNING: "badge-info",
  FAILED: "badge-danger",
  PENDING: "badge-default",
  CANCELLED: "badge-warning",
};
const statusDot: Record<string, string> = { RUNNING: "dot-pulse", SUCCESS: "", FAILED: "", PENDING: "", CANCELLED: "" };

const stepsData = ["Checkout", "Install", "Lint", "Test", "Build", "Deploy"];

export default function PipelinesPage() {
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
            <>
              <div className="step" key={s}>
                <span style={{ color: "var(--accent)" }}>{i + 1}.</span> {s}
              </div>
              {i < arr.length - 1 && <span className="step-arrow" key={`arrow-${i}`}>→</span>}
            </>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="table-card">
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
              {pipelines.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.project}</td>
                  <td><span className="mono">{p.branch}</span></td>
                  <td>
                    <span className={`badge ${statusClass[p.status]}`}>
                      <span className={`dot ${statusDot[p.status]}`} /> {p.status}
                    </span>
                  </td>
                  <td className="mono">{p.duration}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.deployments}</td>
                  <td className="mono" style={{ color: "var(--text-secondary)" }}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
