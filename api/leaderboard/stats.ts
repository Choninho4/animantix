import type { ApiRequest, ApiResponse } from '../_lib/types';
import { redis } from '../_lib/redis';
import { timesKey } from '../_lib/keys';
import { isPlausibleDayIndex } from '../_lib/day';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const day = Number(req.query.day);
  if (!isPlausibleDayIndex(day)) {
    res.status(400).json({ error: 'invalid_day' });
    return;
  }

  try {
    const total = await redis.zcard(timesKey(day));
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
    res.status(200).json({ day, total });
  } catch {
    res.status(502).json({ error: 'redis_unavailable' });
  }
}
