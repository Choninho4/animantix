export function getInitials(nom: string): string {
  return nom
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatCountdown(remainingMs: number): string {
  const rest = Math.max(0, remainingMs);
  const hours = Math.floor(rest / 3_600_000);
  const minutes = Math.floor(rest / 60_000) % 60;
  const seconds = Math.floor(rest / 1000) % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function msUntilNextMidnight(now: Date = new Date()): number {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  return Math.max(0, nextMidnight - now.getTime());
}

export function formatElapsed(elapsedMs: number): string {
  const mins = Math.floor(elapsedMs / 60_000);
  const secs = Math.floor(elapsedMs / 1000) % 60;
  return `${mins} min ${pad(secs)}`;
}
