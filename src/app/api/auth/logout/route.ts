import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    // In a more complete implementation, you might:
    // 1. Invalidate the refresh token in the database
    // 2. Add the access token to a blacklist
    // 3. Log the logout event
    
    // For now, we'll just return a success response
    // The client will handle clearing localStorage
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to logout'
    }, { status: 500 });
  }
});
