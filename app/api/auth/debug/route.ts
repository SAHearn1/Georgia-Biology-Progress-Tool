import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check auth configuration
 * This helps diagnose Configuration errors
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    checks: {
      googleClientId: {
        exists: !!process.env.GOOGLE_CLIENT_ID,
        value: process.env.GOOGLE_CLIENT_ID
          ? `${process.env.GOOGLE_CLIENT_ID.slice(0, 10)}...`
          : 'NOT SET',
      },
      googleClientSecret: {
        exists: !!process.env.GOOGLE_CLIENT_SECRET,
        value: process.env.GOOGLE_CLIENT_SECRET
          ? `${process.env.GOOGLE_CLIENT_SECRET.slice(0, 10)}...`
          : 'NOT SET',
      },
      authSecret: {
        exists: !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
        which: process.env.AUTH_SECRET
          ? 'AUTH_SECRET'
          : process.env.NEXTAUTH_SECRET
            ? 'NEXTAUTH_SECRET'
            : 'NONE',
        length: (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '').length,
      },
      nextauthUrl: {
        exists: !!process.env.NEXTAUTH_URL,
        value: process.env.NEXTAUTH_URL || 'NOT SET (trustHost: true - not required)',
      },
    },
    allEnvVarsSet:
      !!process.env.GOOGLE_CLIENT_ID &&
      !!process.env.GOOGLE_CLIENT_SECRET &&
      !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
  };

  return NextResponse.json(diagnostics, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
