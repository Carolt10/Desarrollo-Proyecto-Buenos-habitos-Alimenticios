import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    clearMocks: true,
    // NO setupFiles aquí — no se mockea next/server globalmente
    // Las rutas necesitan NextResponse real para retornar status y body correctos
    include: ["__tests__/integration/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "coverage-integration",
      // Solo rutas con lógica implementada; community y recipes son stubs sin lógica
      include: [
        "app/api/education/**/*.ts",
        "app/api/testimonials/**/*.ts",
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
