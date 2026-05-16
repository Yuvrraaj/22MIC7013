import { sendLog } from '../services/logSvc';
import { STACKS, LEVELS, BE_ALLOWED, FE_ALLOWED } from '../constants/vals';
import type { Stack, Level, Pkg } from '../types/log';

function validate(stk: string, lvl: string, pkg: string): boolean {
  if (!(STACKS as readonly string[]).includes(stk)) return false;
  if (!(LEVELS as readonly string[]).includes(lvl)) return false;

  const allowed: readonly string[] = stk === 'backend' ? BE_ALLOWED : FE_ALLOWED;
  if (!allowed.includes(pkg)) return false;

  return true;
}

export async function Log(
  stk: Stack,
  lvl: Level,
  pkg: Pkg,
  msg: string
): Promise<void> {
  if (!validate(stk, lvl, pkg)) {
    console.error(`[LOG] Invalid params: stk=${stk}, lvl=${lvl}, pkg=${pkg}`);
    return;
  }

  try {
    await sendLog({ stack: stk, level: lvl, package: pkg, message: msg });
  } catch (e) {
    console.error(`[LOG] Failed: ${e instanceof Error ? e.message : e}`);
  }
}

export function LogSync(
  stk: Stack,
  lvl: Level,
  pkg: Pkg,
  msg: string
): void {
  Log(stk, lvl, pkg, msg).catch(() => {});
}
