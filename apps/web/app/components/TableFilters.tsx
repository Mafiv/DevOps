"use client";

import { useState } from "react";

interface TableFiltersProps {
  onFilterChange: (filters: { status?: string; project?: string }) => void;
  onSortChange: (sort: { field: string; order: "asc" | "desc" }) => void;
  availableStatuses?: string[];
  availableProjects?: string[];
}

export function TableFilters({ onFilterChange, onSortChange, availableStatuses = [], availableProjects = [] }: TableFiltersProps) {
  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ status: value || undefined, project: project || undefined });
  };

  const handleProjectChange = (value: string) => {
    setProject(value);
    onFilterChange({ status: status || undefined, project: value || undefined });
  };

  const handleSortChange = (field: string) => {
    const newOrder = sortField === field && sortOrder === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortOrder(newOrder);
    onSortChange({ field, order: newOrder });
  };

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
      <div>
        <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginRight: "0.5rem" }}>Status:</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
          }}
        >
          <option value="">All</option>
          {availableStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginRight: "0.5rem" }}>Project:</label>
        <select
          value={project}
          onChange={(e) => handleProjectChange(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
          }}
        >
          <option value="">All</option>
          {availableProjects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => handleSortChange("createdAt")}
          style={{
            padding: "0.4rem 0.6rem",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            background: sortField === "createdAt" ? "var(--accent)" : "var(--bg-primary)",
            color: sortField === "createdAt" ? "var(--bg-primary)" : "var(--text-primary)",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Date {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          onClick={() => handleSortChange("duration")}
          style={{
            padding: "0.4rem 0.6rem",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            background: sortField === "duration" ? "var(--accent)" : "var(--bg-primary)",
            color: sortField === "duration" ? "var(--bg-primary)" : "var(--text-primary)",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Duration {sortField === "duration" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
      </div>
    </div>
  );
}
