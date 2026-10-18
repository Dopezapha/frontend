/**
 * Security headers and Content Security Policy generator.
 */

export function buildCsp(apiUrl?: string): string {
  const isEnforce = process.env.CSP_MODE === 'enforce'
  const isDev = process.env.NODE_ENV !== 'production' && !isEnforce

  const connectSrc = [
    "'self'",
    'https://*.stellar.org',
    'https://horizon.stellar.org',
    'https://horizon-testnet.stellar.org',
    'https://soroban-testnet.stellar.org',
    'https://mainnet.sorobanrpc.com',
    'https://rpc-futurenet.stellar.org',
    'https://stellar.expert',
    'https://api.stellar.expert',
  ]

  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl)
      if (parsed.origin && !connectSrc.includes(parsed.origin)) {
        connectSrc.push(parsed.origin)
      }
    } catch {
      // ignore invalid URL
    }
  }

  if (isDev) {
    connectSrc.push('http://localhost:*', 'ws://localhost:*')
  }

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': connectSrc,
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  }

  return Object.entries(directives)
    .map(([key, vals]) => `${key} ${vals.join(' ')}`)
    .join('; ')
}

export function getSecurityHeaders(): { key: string; value: string }[] {
  const csp = buildCsp(process.env.NEXT_PUBLIC_API_URL)
  return [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ]
}
