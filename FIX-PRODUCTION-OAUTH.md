# Fix OAuth for Production (Vercel)

## Step 1: Find Your Vercel Domain

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Copy your production domain (example: `georgia-biology-tool.vercel.app`)

**Let's say your domain is**: `georgia-biology-tool.vercel.app`

## Step 2: Add Redirect URI to Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (the one with ID: `902576637462-gmqm26b02j8jbtguk1ggchrboj3not4e.apps.googleusercontent.com`)
3. Click on it to edit
4. Scroll to **Authorized redirect URIs**
5. Click **+ ADD URI**
6. Paste your redirect URI (replace with YOUR actual domain):

```
https://georgia-biology-tool.vercel.app/api/auth/callback/google
```

**IMPORTANT**:
- Use `https://` (NOT `http://`)
- Replace `georgia-biology-tool` with YOUR actual Vercel domain
- No trailing slash
- Exact path: `/api/auth/callback/google`

7. Click **SAVE**
8. Wait 5 minutes

## Step 3: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Find or add these variables (set for Production, Preview, and Development):

```env
NEXTAUTH_URL=https://georgia-biology-tool.vercel.app
AUTH_SECRET=kL8mN2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA0b
NEXTAUTH_SECRET=kL8mN2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA0b
GOOGLE_CLIENT_ID=902576637462-gmqm26b02j8jbtguk1ggchrboj3not4e.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

**CRITICAL**: Replace `georgia-biology-tool.vercel.app` with YOUR actual Vercel domain!

4. Click **Save**

## Step 4: Redeploy

After saving environment variables:
1. Go to **Deployments** tab
2. Click the **...** menu on your latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Step 5: Test

1. Wait 5 minutes after Step 2 (for Google to propagate changes)
2. Go to your production URL (e.g., https://georgia-biology-tool.vercel.app)
3. Click "Teacher Login"
4. Should redirect to Google sign-in
5. Sign in should work

## Common Mistakes

❌ Using `http://` instead of `https://` for Vercel
❌ Using `your-app.vercel.app` (placeholder) instead of actual domain
❌ Forgetting to redeploy after changing environment variables
❌ Not waiting 5 minutes for Google changes to propagate
