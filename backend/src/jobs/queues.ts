import { Queue } from 'bullmq';
import { env } from '../utils/env';

// Redis connection configuration
const redisConfig = {
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3,
};

// Parse Redis URL if provided
if (env.REDIS_URL) {
  try {
    const url = new URL(env.REDIS_URL);
    redisConfig.host = url.hostname;
    redisConfig.port = parseInt(url.port) || 6379;
  } catch (error) {
    console.warn('Invalid REDIS_URL format, using defaults');
  }
}

// Email queue
export const emailQueue = new Queue('email', {
  connection: redisConfig,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Video processing queue
export const videoProcessingQueue = new Queue('video-processing', {
  connection: redisConfig,
  defaultJobOptions: {
    removeOnComplete: 5,
    removeOnFail: 20,
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

// Email job types
export interface EmailJobData {
  to: string;
  template: string;
  data: Record<string, any>;
  subject?: string;
}

// Video processing job types
export interface VideoProcessingJobData {
  videoId: string;
  videoUrl: string;
  userId: string;
  courseId: string;
  lessonId: string;
}

// Graceful shutdown
export const shutdown = async () => {
  await Promise.all([
    emailQueue.close(),
    videoProcessingQueue.close(),
  ]);
  console.log('All queues closed');
};
