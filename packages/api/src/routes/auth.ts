import { Hono } from "hono";
import { prisma } from "@repo/db";
import { sign } from "hono/jwt";

export const authRouter = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

// POST /auth/register
authRouter.post("/register", async (c) => {
  const { email, name, password } = await c.req.json<{ email: string; name: string; password: string }>();

  if (!email || !name || !password) {
    return c.json({ error: "Email, name, and password are required" }, 400);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return c.json({ error: "User already exists" }, 409);
  }

  // Simple password hashing (in production, use bcrypt)
  const passwordHash = Buffer.from(password).toString("base64");

  const user = await prisma.user.create({
    data: { email, name, password: passwordHash },
    select: { id: true, email: true, name: true, role: true, avatarUrl: true },
  });

  const token = await sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET);

  return c.json({ data: { user, token } }, 201);
});

// POST /auth/login
authRouter.post("/login", async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const passwordHash = Buffer.from(password).toString("base64");
  if (user.password !== passwordHash) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET);

  const { password: _, ...userWithoutPassword } = user;
  return c.json({ data: { user: userWithoutPassword, token } });
});

// GET /auth/me
authRouter.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.substring(7);
  try {
    const payload = await sign(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: (payload as any).userId },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ data: { user } });
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});
