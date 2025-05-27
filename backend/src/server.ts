import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

import { env } from './utils/env';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { courseRoutes } from './routes/courses';
import { enrollmentRoutes } from './routes/enrollments';
import { paymentRoutes } from './routes/payments';
import { reviewRoutes } from './routes/reviews';
import { categoryRoutes } from './routes/categories';
import { uploadRoutes } from './routes/uploads';
import { adminRoutes } from './routes/admin';
import { healthRoutes } from './routes/health';
import { emailQueue, videoProcessingQueue } from './jobs/queues';

// Initialize Prisma client
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
// app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(requestLogger);

// Health check
app.use('/health', healthRoutes);

// API routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/enrollments', enrollmentRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/admin', adminRoutes);

app.use('/api/v1', apiRouter);

// Bull dashboard for queue monitoring (development only)
if (env.NODE_ENV === 'development') {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');
  
  createBullBoard({
    queues: [
      new BullMQAdapter(emailQueue),
      new BullMQAdapter(videoProcessingQueue),
    ],
    serverAdapter: serverAdapter,
  });
  
  app.use('/admin/queues', serverAdapter.getRouter());
}

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = env.PORT || 5000;

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Received shutdown signal. Starting graceful shutdown...');
  
  // Close database connections
  await prisma.$disconnect();
  
  // Close queue connections
  await emailQueue.close();
  await videoProcessingQueue.close();
  
  console.log('Graceful shutdown completed.');
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  if (env.NODE_ENV === 'development') {
    console.log(`📈 Queue dashboard: http://localhost:${PORT}/admin/queues`);
  }
});

export default app;
