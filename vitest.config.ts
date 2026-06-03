import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    clearMocks: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/__tests__/integration/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: [
        "backend/shared/utils/**/*.ts",
        "backend/modules/**/service.ts",
        "frontend/shared/services/**/*.ts",
        "frontend/modules/**/services/**/*.ts",
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
});
