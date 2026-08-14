import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

// Pensé pour bloquer le spam d'un identifiant/IP donné, pas pour plafonner le
// nombre de joueurs différents lors d'un pic de trafic légitime.
export const leaderboardRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  prefix: 'animantix:rl',
  analytics: false,
});
