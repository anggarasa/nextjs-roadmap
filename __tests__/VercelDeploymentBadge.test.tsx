// __tests__/VercelDeploymentBadge.test.tsx
import { render, screen } from "@testing-library/react";
import { VercelDeploymentBadge } from "@/components/VercelDeploymentBadge";

describe("Komponen Cloud: VercelDeploymentBadge (Topik 42)", () => {
  it("harus merender judul dan indikator arsitektur Vercel dengan benar", () => {
    render(
      <VercelDeploymentBadge
        serverData={{
          isVercel: true,
          vercelEnv: "production",
          vercelRegion: "sin1 (Singapore)",
          nestApiUrl: "https://api.farhancoders.com",
          appUrl: "https://taskmanager-farhancoders.vercel.app",
          nodeEnv: "production",
        }}
      />
    );

    // Verifikasi judul inspeksi arsitektur Vercel
    expect(
      screen.getByText(/Vercel Cloud & Edge Architecture/i)
    ).toBeInTheDocument();

    // Verifikasi badge Topik 42
    expect(screen.getByText(/Topik 42/i)).toBeInTheDocument();

    // Verifikasi teks perintah Vercel CLI
    expect(screen.getByText(/vercel --prod/i)).toBeInTheDocument();
  });
});
