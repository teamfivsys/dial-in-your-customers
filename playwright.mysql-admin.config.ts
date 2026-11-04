import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "mysql-admin.spec.ts",
  timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:4174", headless: true, reducedMotion: "reduce" },
  webServer: {
    command: "VITE_DIRECTORY_DEMO=true VITE_DIRECTORY_BACKEND_ENABLED=true VITE_DIRECTORY_API_MODE=hostinger-mysql VITE_SUPABASE_URL=http://127.0.0.1:54321 VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_fictional_ui_test_key pnpm dev --host 127.0.0.1 --port 4174",
    port: 4174,
    reuseExistingServer: true,
  },
  reporter: "list",
});
