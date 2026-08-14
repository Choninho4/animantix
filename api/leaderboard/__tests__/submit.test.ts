import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockReq, mockRes } from '../../_lib/__tests__/testHelpers';
import { DATE_REF } from '../../../src/lib/constants';

const today = Math.floor((Date.now() - DATE_REF) / 86_400_000);
const PLAYER_ID = 'a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890';

vi.mock('../../_lib/redis', () => ({
  redis: { zscore: vi.fn(), zadd: vi.fn(), expire: vi.fn(), zcount: vi.fn(), zcard: vi.fn() },
}));
vi.mock('../../_lib/ratelimit', () => ({
  leaderboardRatelimit: { limit: vi.fn() },
}));

import handler from '../submit';
import { redis } from '../../_lib/redis';
import { leaderboardRatelimit } from '../../_lib/ratelimit';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(leaderboardRatelimit.limit).mockResolvedValue({ success: true } as never);
  vi.mocked(redis.zadd).mockResolvedValue(1);
  vi.mocked(redis.expire).mockResolvedValue(1);
});

function body(overrides: Record<string, unknown> = {}) {
  return { playerId: PLAYER_ID, day: today, timeMs: 45_000, ...overrides };
}

describe('POST /api/leaderboard/submit', () => {
  it('rejette les méthodes autres que POST', async () => {
    const { res, api } = mockRes();
    await handler(mockReq({ method: 'GET' }), api);
    expect(res.statusCode).toBe(405);
  });

  it('rejette un payload invalide (playerId manquant)', async () => {
    const { res, api } = mockRes();
    await handler(mockReq({ method: 'POST', body: body({ playerId: undefined }) }), api);
    expect(res.statusCode).toBe(400);
  });

  it('rejette un temps de résolution aberrant', async () => {
    const { res, api } = mockRes();
    await handler(mockReq({ method: 'POST', body: body({ timeMs: 500 }) }), api);
    expect(res.statusCode).toBe(400);
  });

  it('enregistre une nouvelle victoire et retourne le percentile', async () => {
    vi.mocked(redis.zscore).mockResolvedValue(null);
    vi.mocked(redis.zcount).mockResolvedValue(0);
    vi.mocked(redis.zcard).mockResolvedValue(1);

    const { res, api } = mockRes();
    await handler(mockReq({ method: 'POST', body: body() }), api);

    expect(redis.zadd).toHaveBeenCalledWith(`animantix:day:${today}:times`, { score: 45, member: PLAYER_ID });
    expect(redis.expire).toHaveBeenCalledWith(`animantix:day:${today}:times`, 172_800);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ total: 1, rank: 0, percentileTop: 100, isFirst: true });
  });

  it('ne réenregistre pas un joueur déjà présent aujourd\'hui (anti-doublon)', async () => {
    vi.mocked(redis.zscore).mockResolvedValue(45);
    vi.mocked(redis.zcount).mockResolvedValue(4);
    vi.mocked(redis.zcard).mockResolvedValue(9);

    const { res, api } = mockRes();
    await handler(mockReq({ method: 'POST', body: body() }), api);

    expect(redis.zadd).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ total: 9, rank: 4, percentileTop: 56, isFirst: false });
  });

  it('applique le rate-limit avant tout accès Redis', async () => {
    vi.mocked(leaderboardRatelimit.limit).mockResolvedValue({ success: false } as never);
    const { res, api } = mockRes();
    await handler(mockReq({ method: 'POST', body: body() }), api);
    expect(res.statusCode).toBe(429);
    expect(redis.zscore).not.toHaveBeenCalled();
  });

  it('dégrade proprement si Redis échoue', async () => {
    vi.mocked(redis.zscore).mockRejectedValue(new Error('boom'));
    const { res, api } = mockRes();
    await handler(mockReq({ method: 'POST', body: body() }), api);
    expect(res.statusCode).toBe(502);
  });
});
