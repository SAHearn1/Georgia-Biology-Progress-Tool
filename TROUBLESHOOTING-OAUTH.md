# OAuth redirect_uri_mismatch Troubleshooting

## Current Error
```
Error 400: redirect_uri_mismatch
Access blocked: This app's request is invalid
```

## Quick Fix Steps

### Step 1: Find the Exact Redirect URI Being Sent

When you see the error in your browser, look at the URL bar. It will contain the exact redirect_uri that your app is trying to use.

The URL will look something like:
```
https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fgoogle&...
```

The `redirect_uri` parameter (URL decoded) shows what your app is sending. Common values:
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-vercel-domain.vercel.app/api/auth/callback/google`

### Step 2: Add This EXACT URI to Google Cloud Console

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID (should be named something like "Web client 1")
3. Scroll to **Authorized redirect URIs**
4. Click **+ ADD URI**
5. Paste the EXACT redirect URI from Step 1
6. Click **SAVE**
7. Wait 5 minutes for changes to propagate

### Step 3: Verify Your Current Setup

Are you testing locally or on Vercel production?

#### If Testing Locally:
Your Google OAuth Client should have this redirect URI:
```
http://localhost:3000/api/auth/callback/google
```

Check your `.env` file has:
```env
NEXTAUTH_URL="http://localhost:3000"
```

#### If Testing on Production (Vercel):
Your Google OAuth Client should have this redirect URI:
```
https://YOUR-ACTUAL-VERCEL-DOMAIN.vercel.app/api/auth/callback/google
```

Example:
```
https://georgia-biology-tool.vercel.app/api/auth/callback/google
```

In Vercel Environment Variables, you should have:
```env
NEXTAUTH_URL=https://YOUR-ACTUAL-VERCEL-DOMAIN.vercel.app
```

## Common Mistakes

### ❌ Wrong: Using placeholder/example domains
```
https://your-app.vercel.app/api/auth/callback/google  ❌ Generic placeholder
https://example.com/api/auth/callback/google          ❌ Example domain
```

### ✅ Correct: Using your actual domain
```
https://georgia-biology-tool-abc123.vercel.app/api/auth/callback/google  ✅
```

### ❌ Wrong: Trailing slash
```
http://localhost:3000/api/auth/callback/google/  ❌ Has trailing slash
```

### ✅ Correct: No trailing slash
```
http://localhost:3000/api/auth/callback/google  ✅
```

### ❌ Wrong: Wrong protocol
```
https://localhost:3000/api/auth/callback/google  ❌ Should be http for localhost
http://my-app.vercel.app/api/auth/callback/google  ❌ Should be https for Vercel
```

### ✅ Correct: Right protocol
```
http://localhost:3000/api/auth/callback/google   ✅ http for localhost
https://my-app.vercel.app/api/auth/callback/google  ✅ https for Vercel
```

## How to Find Your Vercel Domain

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Look at the "Domains" section
4. Copy the domain exactly (e.g., `georgia-biology-tool.vercel.app`)
5. The full redirect URI is: `https://[YOUR-DOMAIN]/api/auth/callback/google`

## Screenshot: Where to Add Redirect URI in Google Cloud

In Google Cloud Console, your OAuth 2.0 Client ID page should look like this:

```
Authorized redirect URIs
┌─────────────────────────────────────────────────────────────────┐
│ http://localhost:3000/api/auth/callback/google                  │ [X]
├─────────────────────────────────────────────────────────────────┤
│ https://georgia-biology-tool.vercel.app/api/auth/callback/google│ [X]
└─────────────────────────────────────────────────────────────────┘
                                                         [+ ADD URI]
```

## Quick Test

After adding the redirect URI:

1. **Wait 5 minutes** (Google needs time to propagate changes)
2. Clear your browser cookies for `accounts.google.com`
3. Try signing in again
4. If still fails, check the error URL again for the exact redirect_uri

## Still Not Working?

Check these:

1. **Multiple OAuth Clients**: Make sure you're editing the correct OAuth 2.0 Client ID
   - The Client ID in Google Console should match your `GOOGLE_CLIENT_ID` in `.env`

2. **Environment Variables**:
   - Restart your dev server after changing `.env`
   - Redeploy Vercel after changing environment variables

3. **Browser Cache**:
   - Clear browser cache and cookies
   - Try in an incognito/private window

4. **Copy-Paste Errors**:
   - Make sure there are no spaces before/after the URI
   - Make sure you didn't copy markdown formatting or quotes

## Debug: Check What Your App Is Sending

You can inspect the exact redirect URI your app is trying to use:

1. When you click "Sign in with Google", immediately look at the browser URL
2. Copy the entire URL
3. Decode the `redirect_uri` parameter using a URL decoder
4. Add that EXACT value to Google Cloud Console

Example URL decoder: https://www.urldecoder.org/

## Contact Information

If you still can't resolve this:
1. Take a screenshot of your Google Cloud Console OAuth client configuration
2. Take a screenshot of the error page showing the full URL
3. Share your Vercel domain name
4. Check if NEXTAUTH_URL in Vercel matches your actual domain
