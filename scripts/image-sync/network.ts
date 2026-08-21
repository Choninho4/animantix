type Sleep = (milliseconds: number) => Promise<void>;

const defaultSleep: Sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

interface RequestGateOptions {
  requestsPerMinute: number;
  now?: () => number;
  sleep?: Sleep;
}

export class RequestGate {
  private readonly interval: number;
  private readonly now: () => number;
  private readonly sleep: Sleep;
  private lastStartedAt: number | null = null;

  constructor({ requestsPerMinute, now = Date.now, sleep = defaultSleep }: RequestGateOptions) {
    this.interval = 60_000 / requestsPerMinute;
    this.now = now;
    this.sleep = sleep;
  }

  async waitForTurn(): Promise<void> {
    if (this.lastStartedAt !== null) {
      const remaining = this.interval - (this.now() - this.lastStartedAt);
      if (remaining > 0) await this.sleep(remaining);
    }
    this.lastStartedAt = this.now();
  }
}

interface RetryOptions {
  fetcher?: typeof fetch;
  headers?: HeadersInit;
  sleep?: Sleep;
  maxAttempts?: number;
  beforeAttempt?: () => Promise<void>;
  timeoutMs?: number;
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

function retryDelay(response: Response, attempt: number): number {
  const retryAfter = response.headers.get('Retry-After');
  if (retryAfter && /^\d+$/.test(retryAfter)) return Number(retryAfter) * 1_000;
  return Math.min(1_000 * 2 ** (attempt - 1), 30_000);
}

export async function fetchWithRetry(
  input: string | URL,
  { fetcher = fetch, headers, sleep = defaultSleep, maxAttempts = 5, beforeAttempt, timeoutMs = 8_000 }: RetryOptions = {},
): Promise<Response> {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    await beforeAttempt?.();
    try {
      const response = await fetcher(input, { headers, signal: AbortSignal.timeout(timeoutMs) });
      if (response.ok) return response;
      if (!RETRYABLE_STATUSES.has(response.status) || attempt === maxAttempts) {
        throw new Error(`HTTP ${response.status} for ${input}`);
      }
      await sleep(retryDelay(response, attempt));
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('HTTP ')) throw error;
      if (attempt === maxAttempts) {
        throw new Error(`Network failure for ${input}: ${error instanceof Error ? error.message : String(error)}`);
      }
      await sleep(Math.min(1_000 * 2 ** (attempt - 1), 30_000));
    }
  }
  throw new Error(`Request failed for ${input}`);
}
