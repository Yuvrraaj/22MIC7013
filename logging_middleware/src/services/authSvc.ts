import { cfg } from '../config/env';
import type { AuthRes, TokenCache } from '../types/log';

let cache: TokenCache | null = null;

export async function getTok(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cache && cache.expAt > now + 60) {
    return cache.tok;
  }

  const res = await fetch(`${cfg.baseUrl}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: cfg.email,
      name: cfg.name,
      rollNo: cfg.rollNo,
      accessCode: cfg.accessCode,
      clientID: cfg.clientID,
      clientSecret: cfg.clientSecret,
    }),
    signal: AbortSignal.timeout(cfg.timeout),
  });

  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status}`);
  }

  const data = await res.json() as AuthRes;

  cache = {
    tok: data.access_token,
    expAt: data.expires_in,
  };

  return cache.tok;
}

export function clearTokCache(): void {
  cache = null;
}
