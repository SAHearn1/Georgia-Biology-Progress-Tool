# Fix: NextAuth Configuration Error

## Problem
Getting `/api/auth/error?error=Configuration` when trying to sign in on Vercel deployment.

## Root Cause
NextAuth requires three environment variables to function. If any are missing or invalid in your Vercel deployment, you'll get a Configuration error.

## Required Environment Variables

These **MUST** be set in Vercel:

| Variable | Purpose | Example |
|----------|---------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxxxxxxxxxx` |
| `AUTH_SECRET` | Encryption key for JWT tokens | `openssl rand -base64 32` |

## Solution

### Step 1: Verify Variables Are Set

**Via Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select project: `georgia-biology-progress-tool`
3. Settings → Environment Variables
4. Check that all three variables above exist

**Via CLI:**
```bash
./scripts/check-vercel-env.sh
```

### Step 2: Add Missing Variables

If any variables are missing, add them:

**Via Vercel Dashboard:**
1. Settings → Environment Variables
2. Click "Add New"
3. Set:
   - **Key**: Variable name (e.g., `GOOGLE_CLIENT_ID`)
   - **Value**: The actual value
   - **Environments**: Select "Production", "Preview", and "Development"
4. Click "Save"

**Via CLI:**
```bash
vercel env add GOOGLE_CLIENT_ID
# Paste the value when prompted
# Select all environments (Production, Preview, Development)

vercel env add GOOGLE_CLIENT_SECRET
# Paste the value when prompted

vercel env add AUTH_SECRET
# Paste the value when prompted
```

### Step 3: Generate AUTH_SECRET (if needed)

If you don't have an AUTH_SECRET yet:

```bash
openssl rand -base64 32
```

Copy the output and use it as the value for `AUTH_SECRET`.

### Step 4: Get Google OAuth Credentials (if needed)

If you don't have Google credentials yet:

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `https://georgia-biology-progress-tool.vercel.app/api/auth/callback/google`
     - `https://georgia-biology-progress-tool-*.vercel.app/api/auth/callback/google` (for preview deployments)
3. Copy Client ID → use for `GOOGLE_CLIENT_ID`
4. Copy Client Secret → use for `GOOGLE_CLIENT_SECRET`

### Step 5: Redeploy

After adding/updating environment variables:

**Option A: Trigger new deployment**
```bash
git commit --allow-empty -m "Trigger redeploy after env vars update"
git push
```

**Option B: Redeploy from Vercel Dashboard**
1. Go to Deployments tab
2. Find the latest deployment
3. Click "..." → "Redeploy"

## Verification

After redeployment:
1. Go to https://georgia-biology-progress-tool.vercel.app
2. Click "Sign In"
3. You should be redirected to Google (not to `/api/auth/error?error=Configuration`)

## Common Issues

### Still Getting Configuration Error

**Check 1: Are variables in ALL environments?**
- Make sure variables are set for Production, Preview, AND Development

**Check 2: Did you redeploy after adding variables?**
- Environment variable changes don't take effect until a new deployment

**Check 3: Are the Google credentials valid?**
- Make sure the Client ID and Secret are copied correctly (no extra spaces)
- Make sure the Google OAuth redirect URIs match your Vercel domain

### Variables Are Set But Still Failing

Check the function logs in Vercel:
1. Go to project → Deployments
2. Click on the latest deployment
3. Go to "Functions" tab
4. Look for error messages about missing env vars

## Technical Details

The auth configuration is in `lib/auth.ts`:
- Line 20: `trustHost: true` - Allows dynamic domain (no NEXTAUTH_URL needed)
- Lines 29-30: Google OAuth requires CLIENT_ID and CLIENT_SECRET
- Line 88: AUTH_SECRET is required for JWT encryption

With `trustHost: true`, you do NOT need to set `NEXTAUTH_URL` in Vercel.
