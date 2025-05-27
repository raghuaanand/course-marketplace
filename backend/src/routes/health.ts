import { Router } from 'express';
const createSuccessResponse = <T>(data?: T, message?: string) => ({
  success: true,
  message,
  data
});
import { prisma } from '../server';
import { redis } from '../jobs/queues';
import { env } from '../utils/env';

const router = Router();

router.get('/', async (_req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    services: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'connected';
  } catch (error) {
    health.services.database = 'disconnected';
    health.status = 'degraded';
  }

  try {
    // Check Redis connection
    await redis.ping();
    health.services.redis = 'connected';
  } catch (error) {
    health.services.redis = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(createSuccessResponse(health));
});

export { router as healthRoutes };
