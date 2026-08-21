import { describe, expect, it, vi } from 'vitest';
import { createPowerShellFetcher, selectJikanFetcher } from '../windows-fetch';

describe('createPowerShellFetcher', () => {
  it('convertit le résultat PowerShell en Response compatible avec le limiteur commun', async () => {
    const execute = vi.fn().mockResolvedValue({ status: 200, body: '{"data":[]}' });
    const fetcher = createPowerShellFetcher(execute);

    const response = await fetcher('https://api.jikan.moe/v4/top/characters?page=2', {
      headers: { Accept: 'application/json', 'User-Agent': 'Animantix-Test' },
    });

    expect(execute).toHaveBeenCalledWith(
      'https://api.jikan.moe/v4/top/characters?page=2',
      { Accept: 'application/json', 'User-Agent': 'Animantix-Test' },
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: [] });
  });

  it('préserve un statut HTTP en erreur pour déclencher le retry existant', async () => {
    const fetcher = createPowerShellFetcher(async () => ({ status: 504, body: '' }));

    await expect(fetcher('https://api.jikan.moe')).resolves.toMatchObject({ status: 504 });
  });
});

describe('selectJikanFetcher', () => {
  it('utilise SChannel sous Windows et le fetch natif ailleurs', () => {
    const windowsFetcher = vi.fn() as unknown as typeof fetch;
    const nativeFetcher = vi.fn() as unknown as typeof fetch;

    expect(selectJikanFetcher('win32', windowsFetcher, nativeFetcher)).toBe(windowsFetcher);
    expect(selectJikanFetcher('linux', windowsFetcher, nativeFetcher)).toBe(nativeFetcher);
  });
});
