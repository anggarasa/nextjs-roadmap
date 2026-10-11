// app/api/health/route.ts
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const isVercel = Boolean(process.env.VERCEL || env.VERCEL);
  const vercelEnv =
    process.env.VERCEL_ENV ||
    env.VERCEL_ENV ||
    (process.env.NODE_ENV === "production" ? "production" : "development");
  const vercelRegion =
    process.env.VERCEL_REGION || env.VERCEL_REGION || "dev-local";

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    platform: {
      provider: isVercel ? "Vercel Cloud Platform" : "Local Development Environment",
      isVercel,
      environment: vercelEnv,
      region: vercelRegion,
      runtime: "Node.js Serverless Function",
      framework: "Next.js 16 (App Router + Turbopack)",
    },
    services: {
      backendApi: {
        configuredUrl: env.NEST_API_URL,
        status: "configured",
      },
      edgeCdn: {
        status: isVercel ? "active" : "local-simulation",
        sslStatus: "HTTPS enforced on Vercel Edge",
      },
    },
    executionTimeMs: Date.now() - startTime,
  });
}
