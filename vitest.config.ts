import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  envPrefix: "PB_",
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
