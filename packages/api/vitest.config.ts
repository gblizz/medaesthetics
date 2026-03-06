import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@repo/auth": path.resolve(__dirname, "../auth/src"),
      "@repo/db": path.resolve(__dirname, "../db/src"),
      "@repo/config": path.resolve(__dirname, "../config/src"),
    },
  },
});
