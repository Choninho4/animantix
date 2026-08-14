export interface PercentileResult {
  total: number;
  rank: number;
  percentileTop: number;
  isFirst: boolean;
}

/**
 * `faster` = nombre de joueurs strictement plus rapides que le temps considéré.
 * `total` = nombre de joueurs ayant déjà trouvé aujourd'hui (le joueur inclus
 * s'il est déjà enregistré). `rank` 0 = le plus rapide de tous.
 */
export function computePercentile(faster: number, total: number): PercentileResult {
  if (total <= 1) {
    return { total: Math.max(total, 1), rank: 0, percentileTop: 100, isFirst: true };
  }
  const rank = faster;
  const percentileTop = Math.max(1, Math.round(((rank + 1) / total) * 100));
  return { total, rank, percentileTop, isFirst: false };
}
