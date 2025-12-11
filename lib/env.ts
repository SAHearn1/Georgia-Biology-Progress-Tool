/**
 * Centralized Environment Variable Parser and Validator
 *
 * This module validates all required environment variables and provides
 * type-safe access to configuration values. It helps prevent Configuration
 * errors by failing fast with clear error messages.
 */

type EnvVarConfig = {
  required: boolean;
  description: string;
  validate?: (value: string) => boolean;
};

const ENV_CONFIG = {
  // Authentication (Required for production)
  GOOGLE_CLIENT_ID: {
    required: true,
    description: 'Google OAuth Client ID from Google Cloud Console',
    validate: (val) => val.length > 10 && val.includes('.apps.googleusercontent.com'),
  },
  GOOGLE_CLIENT_SECRET: {
    required: true,
    description: 'Google OAuth Client Secret from Google Cloud Console',
    validate: (val) => val.length > 10,
  },
  AUTH_SECRET: {
    required: true,
    description: 'Secret key for signing JWT tokens (generate with: openssl rand -base64 32)',
    validate: (val) => val.length >= 32,
  },

  // Database (Required for production)
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL connection string (from Vercel Postgres or Neon)',
    validate: (val) =>
      val.startsWith('postgres://') ||
      val.startsWith('postgresql://') ||
      val.startsWith('prisma+postgres://'), // Prisma Accelerate format
  },

  // AI Features (Optional)
  ANTHROPIC_API_KEY: {
    required: false,
    description: 'Anthropic API key for AI-powered assessment item generation',
    validate: (val) => val.startsWith('sk-ant-'),
  },

  // Optional/Legacy
  NEXTAUTH_SECRET: {
    required: false,
    description: 'Legacy NextAuth secret (use AUTH_SECRET instead)',
  },
  NEXTAUTH_URL: {
    required: false,
    description: 'Not needed with trustHost: true in NextAuth config',
  },
} as const satisfies Record<string, EnvVarConfig>;

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
 * Validates and returns environment variables
 * Throws EnvironmentError if required variables are missing or invalid
 */
function validateEnv() {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  // Check each configured environment variable
  for (const [key, config] of Object.entries(ENV_CONFIG)) {
    const value = process.env[key];

    // Handle missing required variables
    if (!value && config.required) {
      errors.push(
        `❌ Missing required environment variable: ${key}\n   ${config.description}`
      );
      continue;
    }

    // Handle missing optional variables
    if (!value && !config.required) {
      if (isProduction && key === 'ANTHROPIC_API_KEY') {
        warnings.push(
          `⚠️  Optional: ${key} not set\n   ${config.description}`
        );
      }
      continue;
    }

    // Validate value format if validator exists
    if (value && 'validate' in config && config.validate && !config.validate(value)) {
      errors.push(
        `❌ Invalid format for ${key}\n   ${config.description}\n   Current value: ${value.slice(0, 20)}...`
      );
    }
  }

  // Special case: AUTH_SECRET fallback to NEXTAUTH_SECRET
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    errors.push(
      `❌ Missing required environment variable: AUTH_SECRET (or NEXTAUTH_SECRET)\n   ${ENV_CONFIG.AUTH_SECRET.description}`
    );
  }

  // Log warnings in development
  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.warn('\n⚠️  Environment Warnings:\n');
    warnings.forEach((warning) => console.warn(warning));
    console.warn('');
  }

  // Throw error if any required variables are missing or invalid
  if (errors.length > 0) {
    const errorMessage = [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🚨 ENVIRONMENT CONFIGURATION ERROR',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      ...errors,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '📋 FIX INSTRUCTIONS:',
      '',
      isProduction
        ? '  1. Go to Vercel Dashboard → Settings → Environment Variables'
        : '  1. Copy .env.example to .env',
      isProduction
        ? '  2. Add the missing variables listed above'
        : '  2. Fill in the missing values in .env',
      isProduction
        ? '  3. Redeploy your application'
        : '  3. Restart your development server',
      '',
      '  For detailed setup instructions, see:',
      '  - docs/FIX-CONFIGURATION-ERROR.md',
      '  - GOOGLE-OAUTH-SETUP.md',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ].join('\n');

    throw new EnvironmentError(errorMessage);
  }
}

// Validate environment on module load
validateEnv();

/**
 * Type-safe, validated environment variables
 */
export const env = {
  // Authentication
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },

  auth: {
    // Prefer AUTH_SECRET, fallback to NEXTAUTH_SECRET for backwards compatibility
    secret: (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET)!,
    // trustHost is enabled in auth config, so URL is optional
    url: process.env.NEXTAUTH_URL,
  },

  // Database
  database: {
    url: process.env.DATABASE_URL!,
  },

  // AI Features
  ai: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  },

  // System
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
} as const;

/**
 * Export for diagnostic purposes
 */
export function getEnvStatus() {
  return {
    nodeEnv: env.nodeEnv,
    configured: {
      googleOAuth: !!(env.google.clientId && env.google.clientSecret),
      authSecret: !!env.auth.secret,
      database: !!env.database.url,
      anthropicAI: !!env.ai.anthropicApiKey,
    },
    // Safe partial values for debugging (never log full secrets!)
    preview: {
      googleClientId: env.google.clientId?.slice(0, 15) + '...',
      authSecretLength: env.auth.secret?.length || 0,
      databaseProvider: env.database.url?.startsWith('postgres') ? 'PostgreSQL' : 'Unknown',
      anthropicConfigured: !!env.ai.anthropicApiKey,
    },
  };
}
