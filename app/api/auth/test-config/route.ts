import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Test endpoint to verify NextAuth configuration can be loaded
 * This helps diagnose Configuration errors by testing the actual auth import
 */
export async function GET() {
  try {
    // Try to import the auth configuration
    const { auth } = await import('@/lib/auth');

    // Try to call auth() to see if it initializes
    const session = await auth();

    return NextResponse.json({
      success: true,
      message: 'Auth configuration loaded successfully',
      sessionExists: !!session,
      hasUser: !!session?.user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // If there's an error loading or initializing auth, return it
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
