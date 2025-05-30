import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  
  // Database
  DATABASE_URL: z.string(),
  
  // Redis
  REDIS_URL: z.string(),
  
  // JWT
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d').refine((val) => 
    /^(\d+[smhdw]|\d+)$/.test(val), {
    message: 'JWT_REFRESH_EXPIRES_IN must be a valid time format (e.g., 7d, 24h, 3600s)'
  }),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  
  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  FROM_EMAIL: z.string().email(),
  
  // File Storage
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  
  // Frontend URL
  FRONTEND_URL: z.string().url(),
  
  // Other
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  EMAIL_VERIFICATION_EXPIRES_IN: z.string().default('24h'),
  PASSWORD_RESET_EXPIRES_IN: z.string().default('1h'),
});

// Validate and parse environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingFields = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingFields}`);
    }
    throw error;
  }
};

export const env = parseEnv();

// Type for environment variables
export type Env = z.infer<typeof envSchema>;
