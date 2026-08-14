import type { ApiRequest, ApiResponse } from '../_lib/types.js';
import { redis } from '../_lib/redis.js';
import { leaderboardRatelimit } from '../_lib/ratelimit.js';
import { timesKey } from '../_lib/keys.js';
import { isPlausibleDayIndex } from '../_lib/day.js';
import { computePercentile } from '../_lib/percentile.js';
import { clientIp } from '../_lib/clientIp.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const day = Number(req.query.day);
  const timeMs = Number(req.query.timeMs);
  if (!isPlausibleDayIndex(day) || !Number.isFinite(timeMs) || timeMs <= 0) {
    res.status(400).json({ error: 'invalid_params' });
    return;
  }

  const { success } = await leaderboardRatelimit.limit(`percentile:${clientIp(req)}`);
  if (!success) {
    res.status(429).json({ error: 'rate_limited' });
    return;
  }

  try {
    const key = timesKey(day);
    const timeSec = timeMs / 1000;
    const [faster, total] = await Promise.all([
      redis.zcount(key, '-inf', `(${timeSec}`),
      redis.zcard(key),
    ]);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(computePercentile(faster, total));
  } catch {
    res.status(502).json({ error: 'redis_unavailable' });
  }
}
