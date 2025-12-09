# Google OAuth Setup Guide

This guide explains how to properly configure Google OAuth authentication to avoid URI mismatch errors.

## Common URI Mismatch Errors

If you see errors like:
- "redirect_uri_mismatch"
- "Error 400: redirect_uri_mismatch"
- "The redirect URI in the request does not match the ones authorized for the OAuth client"

This means the redirect URI configured in Google Cloud Console doesn't match what your application is sending.

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project name for reference

### 2. Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace organization)
3. Fill in the required fields:
   - **App name**: Georgia Biology Progress Tool
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. Skip adding scopes (default scopes are sufficient)
6. Add test users if needed (only required during development)
7. Click **Save and Continue**

### 4. Create OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. Give it a name (e.g., "Georgia Biology Tool - Web Client")

### 5. Configure Authorized Redirect URIs

This is the **CRITICAL STEP** to avoid URI mismatch errors.

#### For Local Development:
```
http://localhost:3000/api/auth/callback/google
```

#### For Production (Vercel):
```
https://your-actual-vercel-domain.vercel.app/api/auth/callback/google
```

**Important Notes:**
- ✅ Use the **exact** domain from your Vercel deployment
- ✅ Include `/api/auth/callback/google` at the end
- ✅ Use `https://` for production (not `http://`)
- ✅ Use `http://` for localhost (not `https://`)
- ❌ Do NOT add trailing slashes
- ❌ Do NOT use placeholder domains like "your-app.vercel.app"

#### Finding Your Vercel Domain:
1. Go to your Vercel project dashboard
2. Look for the deployment URL (e.g., `georgia-biology-tool-abc123.vercel.app`)
3. Use this exact domain in the redirect URI

### 6. Copy Credentials to Environment Variables

After creating the OAuth client:

1. Copy the **Client ID** (looks like: `902576637462-abc123.apps.googleusercontent.com`)
2. Copy the **Client Secret** (looks like: `GOCSPX-abc123xyz`)
3. Add them to your `.env` file:

```env
GOOGLE_CLIENT_ID=902576637462-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
```

### 7. Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables for **Production**, **Preview**, and **Development**:

```env
# Authentication
NEXTAUTH_URL=https://your-actual-vercel-domain.vercel.app
AUTH_SECRET=your-random-secret-here
NEXTAUTH_SECRET=your-random-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=902576637462-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 8. Update Redirect URIs When Deploying

**CRITICAL**: Every time you get a new Vercel domain (new deployment, branch preview, etc.), you must:

1. Copy the new Vercel URL
2. Go to Google Cloud Console → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add the new redirect URI: `https://new-domain.vercel.app/api/auth/callback/google`
5. Click **Save**
6. Update `NEXTAUTH_URL` in Vercel environment variables

## Testing the Configuration

### Local Development Test:
1. Start your dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Teacher Login"
4. Should redirect to Google sign-in
5. After authentication, should redirect back to dashboard

### Production Test:
1. Deploy to Vercel
2. Navigate to your production URL
3. Click "Teacher Login"
4. Complete Google authentication
5. Should redirect to dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URI in Google Cloud Console doesn't match what the app is sending.

**Solution**:
1. Check what URI your app is sending (look at the error URL)
2. Go to Google Cloud Console → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add the **exact** URI from the error message
5. Click **Save** and wait 5 minutes for propagation

### Error: "invalid_client"

**Cause**: `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` is incorrect.

**Solution**:
1. Verify the credentials in Google Cloud Console
2. Re-copy them to your `.env` file
3. Make sure there are no extra spaces or quotes
4. Redeploy if on Vercel

### Error: "NEXTAUTH_URL environment variable is not set"

**Cause**: Missing `NEXTAUTH_URL` in environment variables.

**Solution**:
1. Add `NEXTAUTH_URL` to your `.env` file
2. For local: `NEXTAUTH_URL="http://localhost:3000"`
3. For production: Set in Vercel environment variables
4. Restart your dev server or redeploy

### Error: "No session found" or constant redirects

**Cause**: Missing or incorrect `AUTH_SECRET` / `NEXTAUTH_SECRET`.

**Solution**:
1. Generate a new secret: `openssl rand -base64 32`
2. Set both `AUTH_SECRET` and `NEXTAUTH_SECRET` to the same value
3. Update in `.env` for local and Vercel for production
4. Redeploy if on Vercel

## Multiple Environments Setup

If you have multiple environments (development, staging, production):

### Google Cloud Console:
Add ALL redirect URIs:
```
http://localhost:3000/api/auth/callback/google
https://georgia-biology-tool-dev.vercel.app/api/auth/callback/google
https://georgia-biology-tool-staging.vercel.app/api/auth/callback/google
https://georgia-biology-tool.vercel.app/api/auth/callback/google
```

### Vercel Environment Variables:
Set `NEXTAUTH_URL` differently for each environment:
- **Development**: `http://localhost:3000`
- **Preview**: `https://georgia-biology-tool-git-branch-name.vercel.app`
- **Production**: `https://georgia-biology-tool.vercel.app`

## Security Best Practices

1. **Never commit credentials to Git**
   - Keep `.env` in `.gitignore`
   - Use `.env.example` as a template

2. **Use different OAuth clients for dev/prod**
   - Create separate OAuth clients for development and production
   - Use different client IDs and secrets

3. **Rotate secrets regularly**
   - Generate new `AUTH_SECRET` periodically
   - Update in both local `.env` and Vercel

4. **Restrict OAuth consent screen**
   - Only add necessary scopes
   - Add only required test users during development
   - Publish the app for production use

## Quick Reference

### Required Environment Variables:
```env
NEXTAUTH_URL="http://localhost:3000"  # or production URL
AUTH_SECRET="random-32-char-string"
NEXTAUTH_SECRET="random-32-char-string"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### Authorized Redirect URI Format:
```
{NEXTAUTH_URL}/api/auth/callback/google
```

Examples:
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.vercel.app/api/auth/callback/google`

---

**Last Updated**: December 9, 2024
