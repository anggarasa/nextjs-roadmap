// app/api/health/route.ts
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const isVercel = Boolean(process.env.VERCEL || env.VERCEL);
  const isDocker = Boolean(
    process.env.DOCKER_CONTAINER ||
      (typeof process.env.HOSTNAME === "string" && process.env.HOSTNAME !== "localhost")
  );

  const vercelEnv =
    process.env.VERCEL_ENV ||
    env.VERCEL_ENV ||
    (process.env.NODE_ENV === "production" ? "production" : "development");
  const vercelRegion =
    process.env.VERCEL_REGION || env.VERCEL_REGION || (isDocker ? "internal-docker-bridge" : "dev-local");

  // Format penggunaan memori container
  const memoryUsage = process.memoryUsage();
  const memoryMb = {
    rss: Math.round(memoryUsage.rss / 1024 / 1024),
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
  };

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    platform: {
      provider: isVercel
        ? "Vercel Cloud Platform"
        : isDocker
        ? "Self-Hosted Docker Container (Alpine Linux)"
        : "Local Development Environment",
      isVercel,
      isDocker,
      outputMode: "standalone",
      user: isDocker ? "nextjs:nodejs (UID 1001 Non-Root)" : "host-user",
      environment: vercelEnv,
      region: vercelRegion,
      runtime: `Node.js ${process.version}`,
      framework: "Next.js 16 (App Router + Turbopack Standalone)",
    },
    services: {
      backendApi: {
        configuredUrl: env.NEST_API_URL,
        status: "configured",
        dnsType: env.NEST_API_URL.includes("backend")
          ? "Docker Internal Bridge Network (DNS: backend:3001)"
          : "Host Network / External URL",
      },
      edgeCdn: {
        status: isVercel ? "active" : "self-hosted-direct",
        sslStatus: isVercel
          ? "HTTPS enforced on Vercel Edge"
          : "Reverse Proxy SSL Termination (Nginx/Traefik)",
      },
    },
    memory: memoryMb,
    executionTimeMs: Date.now() - startTime,
  });
}
