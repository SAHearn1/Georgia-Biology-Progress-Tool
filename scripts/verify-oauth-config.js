// OAuth Configuration Verification Script
// Run this with: node scripts/verify-oauth-config.js

console.log('\n🔍 OAuth Configuration Verification\n');
console.log('=' .repeat(60));

// Check environment variables
const requiredVars = {
  'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
  'AUTH_SECRET': process.env.AUTH_SECRET ? '✓ Set' : '✗ Missing',
  'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing',
  'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : '✗ Missing',
  'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET ? '✓ Set (hidden)' : '✗ Missing',
};

console.log('\n📋 Environment Variables:');
console.log('-'.repeat(60));
Object.entries(requiredVars).forEach(([key, value]) => {
  const status = value?.includes('✗') ? '❌' : '✅';
  console.log(`${status} ${key}: ${value || '✗ Not set'}`);
});

// Calculate expected redirect URI
const nextAuthUrl = process.env.NEXTAUTH_URL;
if (nextAuthUrl) {
  console.log('\n🎯 Expected OAuth Redirect URIs:');
  console.log('-'.repeat(60));

  const baseUrl = nextAuthUrl.replace(/\/$/, ''); // Remove trailing slash
  const googleRedirectUri = `${baseUrl}/api/auth/callback/google`;

  console.log('For Google OAuth:');
  console.log(`  ${googleRedirectUri}`);

  console.log('\n📝 Add this EXACT URI to Google Cloud Console:');
  console.log('-'.repeat(60));
  console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
  console.log('2. Click on your OAuth 2.0 Client ID');
  console.log('3. Under "Authorized redirect URIs", click "+ ADD URI"');
  console.log('4. Paste this EXACT value:');
  console.log(`\n   ${googleRedirectUri}\n`);
  console.log('5. Click SAVE');
  console.log('6. Wait 5 minutes for changes to propagate');
} else {
  console.log('\n❌ NEXTAUTH_URL is not set!');
  console.log('Set it in your .env file:');
  console.log('  - Local: NEXTAUTH_URL="http://localhost:3000"');
  console.log('  - Production: NEXTAUTH_URL="https://your-vercel-domain.vercel.app"');
}

// Check for common issues
console.log('\n⚠️  Common Issues to Check:');
console.log('-'.repeat(60));

const issues = [];

if (!process.env.NEXTAUTH_URL) {
  issues.push('NEXTAUTH_URL is not set');
}

if (nextAuthUrl && nextAuthUrl.includes('your-app')) {
  issues.push('NEXTAUTH_URL contains placeholder "your-app" - replace with actual domain');
}

if (nextAuthUrl && nextAuthUrl.endsWith('/')) {
  issues.push('NEXTAUTH_URL has trailing slash - remove it');
}

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  issues.push('Neither AUTH_SECRET nor NEXTAUTH_SECRET is set');
}

if (!process.env.GOOGLE_CLIENT_ID) {
  issues.push('GOOGLE_CLIENT_ID is not set');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  issues.push('GOOGLE_CLIENT_SECRET is not set');
}

if (issues.length === 0) {
  console.log('✅ No obvious configuration issues found!');
  console.log('\nIf you still get redirect_uri_mismatch:');
  console.log('1. Make sure the redirect URI is added to Google Cloud Console');
  console.log('2. Wait 5 minutes after adding it');
  console.log('3. Clear browser cookies and try again');
} else {
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ❌ ${issue}`);
  });
}

console.log('\n' + '='.repeat(60));
console.log('✅ Verification Complete\n');
