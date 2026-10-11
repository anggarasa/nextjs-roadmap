// jest.setup.ts
import "@testing-library/jest-dom";

// Mock environment variables untuk isolasi testing Jest
(process.env as Record<string, string | undefined>).NODE_ENV = "test";
process.env.NEST_API_URL = process.env.NEST_API_URL || "http://localhost:3001";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "min-32-characters-secret-key-farhancoders";
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
