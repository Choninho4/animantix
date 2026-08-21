import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

interface PowerShellResult {
  status: number;
  body: string;
}

type ExecutePowerShell = (url: string, headers: Record<string, string>) => Promise<PowerShellResult>;

const execFileAsync = promisify(execFile);
const POWERSHELL_COMMAND = [
  '$headers = $env:ANIMANTIX_REQUEST_HEADERS | ConvertFrom-Json -AsHashtable',
  'try {',
  '  $response = Invoke-WebRequest -Uri $env:ANIMANTIX_REQUEST_URL -Headers $headers -TimeoutSec 20 -UseBasicParsing',
  '  [Console]::Out.Write($response.Content)',
  '  exit 0',
  '} catch {',
  '  $status = $_.Exception.Response.StatusCode.value__',
  '  if ($status) { [Console]::Error.Write("HTTP_STATUS=$status") } else { [Console]::Error.Write($_.Exception.Message) }',
  '  exit 1',
  '}',
].join('; ');

async function executePowerShell(url: string, headers: Record<string, string>): Promise<PowerShellResult> {
  try {
    const { stdout } = await execFileAsync('pwsh.exe', ['-NoProfile', '-NonInteractive', '-Command', POWERSHELL_COMMAND], {
      env: {
        ...process.env,
        ANIMANTIX_REQUEST_URL: url,
        ANIMANTIX_REQUEST_HEADERS: JSON.stringify(headers),
      },
      maxBuffer: 10 * 1024 * 1024,
      timeout: 25_000,
      windowsHide: true,
    });
    return { status: 200, body: stdout };
  } catch (error) {
    const stderr = String((error as Error & { stderr?: string }).stderr ?? '');
    const status = Number(/HTTP_STATUS=(\d+)/.exec(stderr)?.[1]);
    if (status) return { status, body: '' };
    throw error;
  }
}

function headersRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  if (!Array.isArray(headers) && !(headers instanceof Headers)) return { ...headers };
  return Object.fromEntries(new Headers(headers).entries());
}

export function createPowerShellFetcher(execute: ExecutePowerShell = executePowerShell): typeof fetch {
  return (async (input: string | URL | Request, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input);
    const result = await execute(url, headersRecord(init?.headers));
    return new Response(result.body, { status: result.status });
  }) as typeof fetch;
}

export function selectJikanFetcher(
  platform: NodeJS.Platform,
  windowsFetcher: typeof fetch,
  nativeFetcher: typeof fetch,
): typeof fetch {
  return platform === 'win32' ? windowsFetcher : nativeFetcher;
}
