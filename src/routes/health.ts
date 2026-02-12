import type { Request, Response } from 'express';

const startTime = Date.now();
const VERSION = '1.0.0';

export function handleHealth(_req: Request, res: Response): void {
  res.json({
    status: 'ok',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: VERSION
  });
}
