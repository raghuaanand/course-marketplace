import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { generateTokens } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Generate JWT tokens from NextAuth session
    const tokens = generateTokens({
      id: session.user.id,
      email: session.user.email,
      role: session.user.role as any,
    });

    return NextResponse.json({
      success: true,
      data: tokens
    });

  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate tokens' },
      { status: 500 }
    );
  }
}
