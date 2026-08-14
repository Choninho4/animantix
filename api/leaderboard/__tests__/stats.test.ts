import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockReq, mockRes } from '../../_lib/__tests__/testHelpers.js';
import { DATE_REF } from '../../../src/lib/constants.js';

const today = Math.floor((Date.now() - DATE_REF) / 86_400_000);

vi.mock('../../_lib/redis', () => ({
  redis: { zcard: vi.fn() },
}));

import handler from '../stats.js';
import { redis } from '../../_lib/redis.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/leaderboard/stats', () => {
  it('rejette les méthodes autres que GET', async () => {
    const { res, api } = mockRes();
    await handler(mockReq({ method: 'POST' }), api);
    expect(res.statusCode).toBe(405);
  });

  it('rejette un dayIndex invalide', async () => {
    const { res, api } = mockRes();
    await handler(mockReq({ query: { day: 'not-a-number' } }), api);
    expect(res.statusCode).toBe(400);
  });

  it('retourne le total et pose un Cache-Control court', async () => {
    vi.mocked(redis.zcard).mockResolvedValue(42);
    const { res, api } = mockRes();
    await handler(mockReq({ query: { day: String(today) } }), api);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ day: today, total: 42 });
    expect(res.headers['Cache-Control']).toContain('s-maxage=15');
  });

  it('dégrade proprement si Redis échoue', async () => {
    vi.mocked(redis.zcard).mockRejectedValue(new Error('boom'));
    const { res, api } = mockRes();
    await handler(mockReq({ query: { day: String(today) } }), api);
    expect(res.statusCode).toBe(502);
  });
});
