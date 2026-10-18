/**
 * Route metadata: canonical list of application routes.
 */

export const ROUTES = [
  '/',
  '/explore',
  '/connect',
  '/learn',
  '/creator',
  '/verify',
  '/risk',
  '/watchlist',
] as const

export const AUTH_ROUTES = ['/deposit', '/withdraw', '/portfolio'] as const
