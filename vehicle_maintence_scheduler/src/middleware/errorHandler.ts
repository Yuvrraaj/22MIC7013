import type { Request, Response, NextFunction } from 'express';
import { log } from '../utils/log';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  log('error', 'middleware', `Unhandled error: ${err.message}`);
  console.error(err.stack);

  res.status(500).json({
    ok: false,
    error: 'Internal server error',
  });
}
