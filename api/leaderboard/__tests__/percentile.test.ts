import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockReq, mockRes } from '../../_lib/__tests__/testHelpers.js';
import { DATE_REF } from '../../../src/lib/constants.js';

const today = Math.floor((Date.now() - DATE_REF) / 86_400_000);

vi.mock('../../_lib/redis', () => ({
  redis: { zcount: vi.fn(), zcard: vi.fn() },
}));
vi.mock('../../_lib/ratelimit', () => ({
  leaderboardRatelimit: { limit: vi.fn().mockResolvedValue({ success: true }) },
}));

import handler from '../percentile.js';
import { redis } from '../../_lib/redis.js';
import { leaderboardRatelimit } from '../../_lib/ratelimit.js';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(leaderboardRatelimit.limit).mockResolvedValue({ success: true } as never);
});

describe('GET /api/leaderboard/percentile', () => {
  it('rejette les paramètres invalides', async () => {
    const { res, api } = mockRes();
    await handler(mockReq({ query: { day: String(today), timeMs: '-5' } }), api);
    expect(res.statusCode).toBe(400);
  });

  it('calcule le percentile pour un temps donné', async () => {
    vi.mocked(redis.zcount).mockResolvedValue(3);
    vi.mocked(redis.zcard).mockResolvedValue(12);
    const { res, api } = mockRes();
    await handler(mockReq({ query: { day: String(today), timeMs: '45000' } }), api);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ total: 12, rank: 3, percentileTop: 33, isFirst: false });
  });

  it('applique le rate-limit', async () => {
    vi.mocked(leaderboardRatelimit.limit).mockResolvedValue({ success: false } as never);
    const { res, api } = mockRes();
    await handler(mockReq({ query: { day: String(today), timeMs: '45000' } }), api);
    expect(res.statusCode).toBe(429);
  });

  it('dégrade proprement si Redis échoue', async () => {
    vi.mocked(redis.zcount).mockRejectedValue(new Error('boom'));
    const { res, api } = mockRes();
    await handler(mockReq({ query: { day: String(today), timeMs: '45000' } }), api);
    expect(res.statusCode).toBe(502);
  });
});
