import { describe, it, expect } from "vitest";
import { Hono } from "hono";

describe("Health Route", () => {
  it("should return health status", async () => {
    const app = new Hono();
    app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

    const res = await app.request("/health");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("status", "ok");
    expect(data).toHaveProperty("timestamp");
  });
});
