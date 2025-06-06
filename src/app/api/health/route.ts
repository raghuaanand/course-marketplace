import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      success: true,
      message: 'Application is healthy',
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Application is unhealthy',
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 503 });
  }
}
