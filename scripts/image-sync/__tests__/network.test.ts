import { describe, expect, it, vi } from 'vitest';
import { RequestGate, fetchWithRetry } from '../network';

describe('RequestGate', () => {
  it('espace les départs de requêtes pour rester à 50 par minute', async () => {
    let now = 10_000;
    const waits: number[] = [];
    const gate = new RequestGate({
      requestsPerMinute: 50,
      now: () => now,
      sleep: async (ms) => {
        waits.push(ms);
        now += ms;
      },
    });

    await gate.waitForTurn();
    await gate.waitForTurn();

    expect(waits).toEqual([1_200]);
  });
});

describe('fetchWithRetry', () => {
  it('respecte Retry-After avant de réessayer un 429', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('', { status: 429, headers: { 'Retry-After': '2' } }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    const waits: number[] = [];

    const response = await fetchWithRetry('https://example.test', {
      fetcher,
      sleep: async (ms) => waits.push(ms),
      maxAttempts: 3,
    });

    expect(response.status).toBe(200);
    expect(waits).toEqual([2_000]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('fait passer chaque tentative, y compris les retries, par le limiteur', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    const beforeAttempt = vi.fn(async () => undefined);

    await fetchWithRetry('https://example.test', {
      fetcher,
      sleep: async () => undefined,
      beforeAttempt,
      maxAttempts: 2,
    });

    expect(beforeAttempt).toHaveBeenCalledTimes(2);
  });

  it('réessaie aussi une panne réseau et borne chaque tentative dans le temps', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    const waits: number[] = [];

    const response = await fetchWithRetry('https://example.test', {
      fetcher,
      sleep: async (ms) => waits.push(ms),
      maxAttempts: 2,
      timeoutMs: 5_000,
    });

    expect(response.status).toBe(200);
    expect(waits).toEqual([1_000]);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it('abandonne une erreur non réessayable', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 404 }));

    await expect(
      fetchWithRetry('https://example.test', { fetcher, sleep: async () => undefined, maxAttempts: 3 }),
    ).rejects.toThrow('HTTP 404');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('transmet les en-têtes du client à chaque requête', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 200 }));

    await fetchWithRetry('https://example.test', {
      fetcher,
      headers: { Accept: 'application/json', 'User-Agent': 'Animantix-Test' },
    });

    expect(fetcher).toHaveBeenCalledWith(
      'https://example.test',
      expect.objectContaining({
        headers: { Accept: 'application/json', 'User-Agent': 'Animantix-Test' },
      }),
    );
  });
});
