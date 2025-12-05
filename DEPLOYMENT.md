# Deployment Guide

This guide will help you deploy the Georgia Biology Progress Tool to Vercel with a PostgreSQL database.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A PostgreSQL database (see database options below)

## Database Options

Choose one of the following PostgreSQL hosting options:

### Option 1: Vercel Postgres (Recommended)
1. In your Vercel project, go to the Storage tab
2. Click "Create Database" and select "Postgres"
3. Follow the prompts to create your database
4. The `DATABASE_URL` will be automatically added to your environment variables

### Option 2: Supabase
1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Get your connection string from Settings > Database > Connection string (URI)
4. Use the connection string as your `DATABASE_URL`

### Option 3: Railway
1. Create an account at [Railway](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection URL
4. Use it as your `DATABASE_URL`

### Option 4: Neon
1. Create an account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Use it as your `DATABASE_URL`

## Deployment Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3. Set Environment Variables

In the Vercel project settings, add the following environment variables:

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-app-name.vercel.app
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Deploy

Click "Deploy" and Vercel will:
1. Build your application
2. Run the build process
3. Deploy to a production URL

### 5. Run Database Migrations

After deployment, you need to set up your database schema:

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma db push
```

#### Option B: Using GitHub Actions (Recommended for production)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma db push
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

Add `DATABASE_URL` to your GitHub repository secrets.

#### Option C: Manual Database Setup

1. Connect to your database using a tool like pgAdmin or psql
2. Copy the SQL from `prisma/migrations` or use:
```bash
npx prisma db push
```

### 6. Create Your First User

After deployment, visit your app URL and:
1. Click "Get Started" or "Register"
2. Fill in your information
3. Create your teacher account
4. Start using the app!

## Post-Deployment Checklist

- [ ] Test the registration flow
- [ ] Test the login flow
- [ ] Create a test class
- [ ] Add a test student
- [ ] Enroll the student in the class
- [ ] Test all CRUD operations
- [ ] Verify data persists correctly
- [ ] Check that authentication protects routes properly

## Updating Your Deployment

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically deploy your changes.

## Troubleshooting

### Build Errors
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Verify your database connection string is valid

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your database allows connections from Vercel's IP ranges
- For Supabase: Make sure to use the "Connection pooling" URL for production
- Ensure SSL is properly configured (most providers require it)

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your production URL
- Ensure `NEXTAUTH_SECRET` is set and is a strong secret
- Check browser console for any errors

### Performance Optimization
- Enable Vercel's Edge Config for faster authentication
- Consider using connection pooling (Prisma Data Proxy or PgBouncer)
- Monitor database query performance

## Security Recommendations

1. **Use Strong Secrets**: Generate a new `NEXTAUTH_SECRET` for production
2. **Enable SSL**: Ensure your database requires SSL connections
3. **Database Access**: Restrict database access to specific IP ranges if possible
4. **Rate Limiting**: Consider adding rate limiting for API routes
5. **Regular Updates**: Keep dependencies updated with `npm update`
6. **Monitor Logs**: Regularly check Vercel logs for suspicious activity

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Review the application logs in Vercel dashboard
3. Verify all environment variables are correctly set
4. Test database connectivity separately

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
