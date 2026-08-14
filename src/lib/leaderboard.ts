export interface CommunityStats {
  day: number;
  total: number;
}

export interface CommunityPercentile {
  total: number;
  rank: number;
  percentileTop: number;
  isFirst: boolean;
}

/** Tous les appels réseau échouent silencieusement (renvoient null) : le jeu ne doit jamais dépendre de cette API. */
export async function fetchCommunityStats(day: number): Promise<CommunityStats | null> {
  try {
    const res = await fetch(`/api/leaderboard/stats?day=${day}`);
    if (!res.ok) return null;
    return (await res.json()) as CommunityStats;
  } catch {
    return null;
  }
}

export async function fetchCommunityPercentile(day: number, timeMs: number): Promise<CommunityPercentile | null> {
  try {
    const res = await fetch(`/api/leaderboard/percentile?day=${day}&timeMs=${Math.round(timeMs)}`);
    if (!res.ok) return null;
    return (await res.json()) as CommunityPercentile;
  } catch {
    return null;
  }
}

export async function submitCommunityResult(
  playerId: string,
  day: number,
  timeMs: number,
): Promise<CommunityPercentile | null> {
  try {
    const res = await fetch('/api/leaderboard/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, day, timeMs: Math.round(timeMs) }),
    });
    if (!res.ok) return null;
    return (await res.json()) as CommunityPercentile;
  } catch {
    return null;
  }
}
