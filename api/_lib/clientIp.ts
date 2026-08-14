import type { ApiRequest } from './types.js';

export function clientIp(req: ApiRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  if (Array.isArray(fwd)) return fwd[0];
  return req.socket?.remoteAddress ?? 'unknown';
}
