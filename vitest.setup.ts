import { vi } from "vitest";

// Mock next/server globally so tests that transitively import errors.ts work in Node.js
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body: unknown, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    })),
  },
}));
