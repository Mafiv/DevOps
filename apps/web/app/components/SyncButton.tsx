"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async (type: "github" | "vercel" | "all") => {
    setSyncing(true);
    setMessage(`Syncing ${type}...`);

    try {
      const res = await fetch(`${API_URL}/sync/${type}`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`Synced ${type} successfully!`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`Failed to sync ${type}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage(`Error syncing ${type}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <button
        onClick={() => handleSync("github")}
        disabled={syncing}
        className="badge badge-info"
        style={{
          cursor: syncing ? "not-allowed" : "pointer",
          opacity: syncing ? 0.6 : 1,
          textDecoration: "none",
          border: "none",
          padding: "0.4rem 0.8rem",
          fontSize: "0.8rem",
        }}
      >
        {syncing ? "Syncing..." : "Sync GitHub"}
      </button>
      <button
        onClick={() => handleSync("vercel")}
        disabled={syncing}
        className="badge badge-info"
        style={{
          cursor: syncing ? "not-allowed" : "pointer",
          opacity: syncing ? 0.6 : 1,
          textDecoration: "none",
          border: "none",
          padding: "0.4rem 0.8rem",
          fontSize: "0.8rem",
        }}
      >
        {syncing ? "Syncing..." : "Sync Vercel"}
      </button>
      <button
        onClick={() => handleSync("all")}
        disabled={syncing}
        className="badge badge-success"
        style={{
          cursor: syncing ? "not-allowed" : "pointer",
          opacity: syncing ? 0.6 : 1,
          textDecoration: "none",
          border: "none",
          padding: "0.4rem 0.8rem",
          fontSize: "0.8rem",
        }}
      >
        {syncing ? "Syncing..." : "Sync All"}
      </button>
      {message && (
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{message}</span>
      )}
    </div>
  );
}
