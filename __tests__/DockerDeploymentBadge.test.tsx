// __tests__/DockerDeploymentBadge.test.tsx
import { render, screen } from "@testing-library/react";
import { DockerDeploymentBadge } from "@/components/DockerDeploymentBadge";

describe("Komponen Container: DockerDeploymentBadge (Topik 43)", () => {
  it("harus merender judul, indikator output standalone, dan instruksi Docker dengan benar", () => {
    render(
      <DockerDeploymentBadge
        serverData={{
          isDocker: true,
          outputMode: "standalone",
          nestApiUrl: "http://backend:3001",
          appUrl: "http://localhost:3000",
          nodeEnv: "production",
        }}
      />
    );

    // Verifikasi judul inspeksi arsitektur Docker
    expect(
      screen.getByText(/Docker Container & Standalone Architecture/i)
    ).toBeInTheDocument();

    // Verifikasi badge Topik 43
    expect(screen.getByText(/Topik 43/i)).toBeInTheDocument();

    // Verifikasi teks mode standalone
    expect(
      screen.getByText(/output: "standalone"/i)
    ).toBeInTheDocument();

    // Verifikasi non-root user UID 1001
    expect(
      screen.getByText(/nextjs:nodejs \(UID 1001\)/i)
    ).toBeInTheDocument();

    // Verifikasi perintah Docker CLI
    expect(
      screen.getByText(/docker build -t nextjs-taskmanager:latest \./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/docker compose up -d --build/i)
    ).toBeInTheDocument();
  });
});
