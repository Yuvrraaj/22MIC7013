const BASE_URL = process.env.LOG_BASE_URL || 'http://4.224.186.213/evaluation-service';
const TIMEOUT = 5000;
const MAX_RETRIES = 3;

interface TokenCache {
  tok: string;
  expAt: number;
}

let cache: TokenCache | null = null;

const authCfg = {
  email: process.env.LOG_EMAIL || '',
  name: process.env.LOG_NAME || '',
  rollNo: process.env.LOG_ROLL_NO || '',
  accessCode: process.env.LOG_ACCESS_CODE || '',
  clientID: process.env.LOG_CLIENT_ID || '',
  clientSecret: process.env.LOG_CLIENT_SECRET || '',
};

async function getTok(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cache && cache.expAt > now + 60) {
    return cache.tok;
  }

  const res = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(authCfg),
    signal: AbortSignal.timeout(TIMEOUT),
  });

  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);

  const data = await res.json() as { access_token: string; expires_in: number };
  cache = { tok: data.access_token, expAt: data.expires_in };
  return cache.tok;
}

type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type Pkg = 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service' | 'auth' | 'config' | 'middleware' | 'utils';

async function sendLog(lvl: Level, pkg: Pkg, msg: string, attempt = 1): Promise<void> {
  const tok = await getTok();

  const res = await fetch(`${BASE_URL}/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tok}`,
    },
    body: JSON.stringify({ stack: 'backend', level: lvl, package: pkg, message: msg }),
    signal: AbortSignal.timeout(TIMEOUT),
  });

  if (res.status >= 500 && attempt < MAX_RETRIES) {
    await new Promise((r) => setTimeout(r, attempt * 500));
    return sendLog(lvl, pkg, msg, attempt + 1);
  }

  if (!res.ok) throw new Error(`Log failed: ${res.status}`);
}

export function log(lvl: Level, pkg: Pkg, msg: string): void {
  sendLog(lvl, pkg, msg).catch((e) => {
    console.error(`[LOG] ${e instanceof Error ? e.message : e}`);
  });
}

export async function logAsync(lvl: Level, pkg: Pkg, msg: string): Promise<void> {
  try {
    await sendLog(lvl, pkg, msg);
  } catch (e) {
    console.error(`[LOG] ${e instanceof Error ? e.message : e}`);
  }
}
