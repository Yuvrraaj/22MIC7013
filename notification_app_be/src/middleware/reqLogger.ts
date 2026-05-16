import type { Request, Response, NextFunction } from 'express';
import { log } from '../utils/log';

export function reqLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const msg = `${req.method} ${req.path} — ${res.statusCode} — ${duration}ms`;

    if (res.statusCode >= 500) {
      log('error', 'middleware', msg);
    } else if (res.statusCode >= 400) {
      log('warn', 'middleware', msg);
    } else {
      log('info', 'middleware', msg);
    }
  });

  next();
}
