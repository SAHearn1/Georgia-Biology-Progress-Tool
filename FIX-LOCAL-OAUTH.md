# Fix OAuth for Local Development

## Step 1: Add Redirect URI to Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (the one with ID: `902576637462-gmqm26b02j8jbtguk1ggchrboj3not4e.apps.googleusercontent.com`)
3. Click on it to edit
4. Scroll to **Authorized redirect URIs**
5. Click **+ ADD URI**
6. Paste this EXACT value:

```
http://localhost:3000/api/auth/callback/google
```

**IMPORTANT**:
- Use `http://` (NOT `https://`)
- No trailing slash
- Exact path: `/api/auth/callback/google`

7. Click **SAVE**
8. Wait 5 minutes

## Step 2: Verify Your .env File

Your `.env` file should have:

```env
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET=kL8mN2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA0b
NEXTAUTH_SECRET=kL8mN2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA0b
GOOGLE_CLIENT_ID=902576637462-gmqm26b02j8jbtguk1ggchrboj3not4e.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## Step 3: Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
npm run dev
```

## Step 4: Test

1. Wait 5 minutes after Step 1 (for Google to propagate changes)
2. Go to http://localhost:3000
3. Click "Teacher Login"
4. Should redirect to Google sign-in
5. Sign in should work

## If Still Not Working

Clear your browser cache and cookies, then try in an incognito window.
