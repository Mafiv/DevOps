import { PrismaClient, Role, ProjectStatus, PipelineStatus, DeploymentStatus, Environment } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.deployment.deleteMany();
  await prisma.pipeline.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: "alice@devops-mono.io",
      name: "Alice Chen",
      role: Role.ADMIN,
      avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@devops-mono.io",
      name: "Bob Müller",
      role: Role.DEVELOPER,
      avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=bob",
    },
  });

  const carol = await prisma.user.create({
    data: {
      email: "carol@devops-mono.io",
      name: "Carol Osei",
      role: Role.VIEWER,
      avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=carol",
    },
  });

  // Create projects
  const storefront = await prisma.project.create({
    data: {
      name: "Storefront",
      slug: "storefront",
      description: "E-commerce storefront powered by Next.js",
      repoUrl: "https://github.com/devops-mono/storefront",
      status: ProjectStatus.ACTIVE,
      ownerId: alice.id,
    },
  });

  const apiGateway = await prisma.project.create({
    data: {
      name: "API Gateway",
      slug: "api-gateway",
      description: "Hono-based REST API gateway with rate limiting",
      repoUrl: "https://github.com/devops-mono/api-gateway",
      status: ProjectStatus.ACTIVE,
      ownerId: bob.id,
    },
  });

  const dashboard = await prisma.project.create({
    data: {
      name: "Admin Dashboard",
      slug: "admin-dashboard",
      description: "Internal operations and analytics dashboard",
      repoUrl: "https://github.com/devops-mono/dashboard",
      status: ProjectStatus.MAINTENANCE,
      ownerId: alice.id,
    },
  });

  // Create pipelines and deployments for Storefront
  const sfPipeline1 = await prisma.pipeline.create({
    data: {
      name: "main → production",
      branch: "main",
      status: PipelineStatus.SUCCESS,
      projectId: storefront.id,
      duration: 142,
    },
  });

  await prisma.deployment.create({
    data: {
      env: Environment.PRODUCTION,
      status: DeploymentStatus.SUCCESS,
      url: "https://storefront.devops-mono.io",
      commitSha: "a1b2c3d",
      commitMsg: "feat: add checkout flow with stripe integration",
      pipelineId: sfPipeline1.id,
      deployedBy: alice.id,
    },
  });

  const sfPipeline2 = await prisma.pipeline.create({
    data: {
      name: "feat/cart → staging",
      branch: "feat/cart",
      status: PipelineStatus.RUNNING,
      projectId: storefront.id,
      duration: null,
    },
  });

  await prisma.deployment.create({
    data: {
      env: Environment.STAGING,
      status: DeploymentStatus.IN_PROGRESS,
      url: "https://storefront-staging.devops-mono.io",
      commitSha: "d4e5f6a",
      commitMsg: "feat: persistent cart with redis",
      pipelineId: sfPipeline2.id,
      deployedBy: bob.id,
    },
  });

  // Create pipeline for API Gateway
  const apiPipeline = await prisma.pipeline.create({
    data: {
      name: "main → production",
      branch: "main",
      status: PipelineStatus.FAILED,
      projectId: apiGateway.id,
      duration: 38,
    },
  });

  await prisma.deployment.create({
    data: {
      env: Environment.PRODUCTION,
      status: DeploymentStatus.FAILED,
      url: null,
      commitSha: "b7c8d9e",
      commitMsg: "fix: rate limiter sliding window edge case",
      pipelineId: apiPipeline.id,
      deployedBy: bob.id,
    },
  });

  // Audit logs
  await prisma.auditLog.createMany({
    data: [
      { action: "PROJECT_CREATED", entity: "Project", entityId: storefront.id, userId: alice.id },
      { action: "PIPELINE_RUN", entity: "Pipeline", entityId: sfPipeline1.id, userId: alice.id },
      { action: "DEPLOYMENT_SUCCESS", entity: "Deployment", entityId: sfPipeline1.id, userId: alice.id, meta: JSON.stringify({ env: "production" }) },
      { action: "PIPELINE_RUN", entity: "Pipeline", entityId: apiPipeline.id, userId: bob.id },
      { action: "DEPLOYMENT_FAILED", entity: "Deployment", entityId: apiPipeline.id, userId: bob.id, meta: JSON.stringify({ reason: "test suite failure" }) },
    ],
  });

  console.log("✅ Seed complete!");
  console.log(`   Users:       ${await prisma.user.count()}`);
  console.log(`   Projects:    ${await prisma.project.count()}`);
  console.log(`   Pipelines:   ${await prisma.pipeline.count()}`);
  console.log(`   Deployments: ${await prisma.deployment.count()}`);
  console.log(`   Audit logs:  ${await prisma.auditLog.count()}`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
