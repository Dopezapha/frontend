import { defineConfig, devices } from '@playwright/test'

const isProductionCSP =
  process.env.CSP_MODE === 'enforce' ||
  process.argv.includes('--project=production') ||
  process.env.npm_lifecycle_event === 'test:e2e:production'

const productionPort = Number(process.env.E2E_PRODUCTION_PORT) || 3200
const port = isProductionCSP ? productionPort : 3000
const baseURL = `http://localhost:${port}`
const runner = process.env.npm_execpath && process.env.npm_execpath.includes('bun') ? 'bun run' : 'npm run'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'production',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: isProductionCSP
    ? {
        command: `NEXT_PUBLIC_API_URL=https://api.example.test PORT=${productionPort} CSP_MODE=enforce ${runner} build && NEXT_PUBLIC_API_URL=https://api.example.test PORT=${productionPort} CSP_MODE=enforce ${runner} start`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : {
        command: `${runner} dev`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
