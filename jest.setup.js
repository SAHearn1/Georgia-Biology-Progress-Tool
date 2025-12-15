// Mock environment variables for testing purposes
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.GOOGLE_CLIENT_ID = 'test-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
process.env.ANTHROPIC_API_KEY = 'test-key';

// Note: For Next.js API routes, we would typically use 'next-test-api-route-handler'
// or a similar library, but for a quick contract test, we will mock the request/response
// objects and directly call the handler functions.
