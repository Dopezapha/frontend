import { test, expect } from '@playwright/test'
import { ROUTES } from '../src/lib/routeMetadata'
import { DEV_ROUTES } from '../src/lib/devRoutes'

test.describe('Security Headers and Content Security Policy', () => {
  const routesToTest = ROUTES.filter((r) => !(DEV_ROUTES as readonly string[]).includes(r))

  for (const route of routesToTest) {
    test(`serves secure production CSP and security headers on ${route}`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response).not.toBeNull()

      const headers = response!.headers()
      const csp = headers['content-security-policy']
      expect(csp).toBeDefined()
      expect(csp).not.toContain('http://localhost')
      expect(csp).not.toContain('ws://')

      expect(headers['x-content-type-options']).toBe('nosniff')
      expect(headers['x-frame-options']).toBe('DENY')
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')

      await page.waitForLoadState('networkidle')

      const violations = await page.evaluate(() => {
        return (window as unknown as { __cspViolations?: unknown[] }).__cspViolations || []
      })
      expect(violations).toEqual([])
    })
  }
})
