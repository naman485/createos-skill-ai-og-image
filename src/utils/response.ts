import type { Response } from 'express';
import type { ApiResponse } from './types.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  meta?: { credits: number; processingMs: number }
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(meta && { meta })
  };
  res.json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string
): void {
  const response: ApiResponse = {
    success: false,
    error: { code, message }
  };
  res.status(statusCode).json(response);
}

export function setCorsHeaders(res: Response): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
