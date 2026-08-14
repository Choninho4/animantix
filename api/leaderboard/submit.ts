import type { ApiRequest, ApiResponse } from '../_lib/types.js';
import { redis } from '../_lib/redis.js';
import { leaderboardRatelimit } from '../_lib/ratelimit.js';
import { timesKey } from '../_lib/keys.js';
import { isPlausibleDayIndex, LEADERBOARD_TTL_SECONDS } from '../_lib/day.js';
import { computePercentile } from '../_lib/percentile.js';
import { clientIp } from '../_lib/clientIp.js';

const MIN_TIME_MS = 1_000;
const MAX_TIME_MS = 24 * 60 * 60 * 1000;

function parseBody(body: unknown): { playerId?: unknown; day?: unknown; timeMs?: unknown } {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return (body ?? {}) as { playerId?: unknown; day?: unknown; timeMs?: unknown };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const { playerId, day, timeMs } = parseBody(req.body);

  if (
    typeof playerId !== 'string' ||
    playerId.length < 8 ||
    playerId.length > 100 ||
    !isPlausibleDayIndex(day) ||
    typeof timeMs !== 'number' ||
    !Number.isFinite(timeMs) ||
    timeMs < MIN_TIME_MS ||
    timeMs > MAX_TIME_MS
  ) {
    res.status(400).json({ error: 'invalid_payload' });
    return;
  }

  const { success } = await leaderboardRatelimit.limit(`submit:${playerId}:${clientIp(req)}`);
  if (!success) {
    res.status(429).json({ error: 'rate_limited' });
    return;
  }

  const key = timesKey(day);
  const timeSec = timeMs / 1000;

  try {
    const existingScore = await redis.zscore(key, playerId);
    if (existingScore === null) {
      await redis.zadd(key, { score: timeSec, member: playerId });
      await redis.expire(key, LEADERBOARD_TTL_SECONDS);
    }

    const finalScore = existingScore ?? timeSec;
    const [faster, total] = await Promise.all([
      redis.zcount(key, '-inf', `(${finalScore}`),
      redis.zcard(key),
    ]);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(computePercentile(faster, total));
  } catch {
    res.status(502).json({ error: 'redis_unavailable' });
  }
}
