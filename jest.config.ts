// jest.config.ts
import type { Config } from "jest";
import nextJest from "next/jest.js";

// Menyambungkan helper Next.js untuk kompilasi otomatis berbasis SWC
const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  // Berkas inisialisasi matcher sebelum setiap test dijalankan
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Lingkungan simulasi DOM browser
  testEnvironment: "jest-environment-jsdom",
  // Pemetaan alias direktori agar path '@/...' dikenali oleh Jest
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(customJestConfig);
