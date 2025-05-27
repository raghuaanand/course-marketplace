import { Request, Response, NextFunction } from 'express';
import { env } from '../utils/env';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  // Skip logging for health checks and static assets
  if (url.includes('/health') || url.includes('/favicon.ico')) {
    return next();
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    // Color code based on status
    let statusColor = '\x1b[32m'; // Green for 2xx
    if (statusCode >= 400 && statusCode < 500) {
      statusColor = '\x1b[33m'; // Yellow for 4xx
    } else if (statusCode >= 500) {
      statusColor = '\x1b[31m'; // Red for 5xx
    }

    const resetColor = '\x1b[0m';
    
    if (env.NODE_ENV === 'development') {
      console.log(
        `${statusColor}${method}${resetColor} ${url} - ${statusColor}${statusCode}${resetColor} - ${duration}ms - ${ip}`
      );
    } else {
      // In production, use structured logging
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        method,
        url,
        statusCode,
        duration,
        ip,
        userAgent: req.get('User-Agent'),
        userId: (req as any).user?.id,
      }));
    }
  });

  next();
};
