import { cfg } from '../config/env';
import { getTok } from './authSvc';
import type { LogReq, LogRes } from '../types/log';

async function sendLog(req: LogReq, attempt = 1): Promise<LogRes> {
  const tok = await getTok();

  const res = await fetch(`${cfg.baseUrl}/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tok}`,
    },
    body: JSON.stringify(req),
    signal: AbortSignal.timeout(cfg.timeout),
  });

  if (res.status >= 500 && attempt < cfg.maxRetries) {
    await delay(attempt * 500);
    return sendLog(req, attempt + 1);
  }

  if (!res.ok) {
    throw new Error(`Log failed: ${res.status}`);
  }

  return await res.json() as LogRes;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export { sendLog };
