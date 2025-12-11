import { NextResponse } from 'next/server';
import { getEnvStatus } from '@/lib/env';

export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check auth configuration
 * This helps diagnose Configuration errors
 * Uses centralized environment validation from lib/env.ts
 */
export async function GET() {
  try {
    const envStatus = getEnvStatus();

    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: envStatus.nodeEnv,
      status: envStatus.configured.googleOAuth &&
        envStatus.configured.authSecret &&
        envStatus.configured.database
        ? 'ALL_REQUIRED_VARS_SET'
        : 'MISSING_REQUIRED_VARS',
      configured: envStatus.configured,
      preview: envStatus.preview,
      notes: {
        trustHost: 'Enabled - NEXTAUTH_URL not required',
        strategy: 'JWT-only (no database adapter)',
        anthropicAI: envStatus.configured.anthropicAI
          ? 'Optional feature enabled'
          : 'Optional feature not configured',
      },
    };

    return NextResponse.json(diagnostics, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    // If env validation failed, return the error
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
