# Testing Guide

This project is a Next.js 14 app with Prisma, NextAuth, and an adaptive testing engine. Automated checks focus on keeping the database schema in sync, ensuring authentication prerequisites are configured, and paving the way for UI and API coverage.

## 1) Prerequisites
- Install dependencies: `npm install` (done after cloning).
- Copy `.env.example` to `.env` and fill the values below.
- Ensure Node.js 20+ is available.

### Required environment variables
- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `NEXTAUTH_URL` and `NEXTAUTH_SECRET` or `AUTH_SECRET`: for NextAuth callbacks and session signing.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: enables Google OAuth on `/auth/signin`.
- `NEXT_PUBLIC_ENABLE_CAT_ALGORITHM`: toggles the adaptive flow.
- `NEXT_PUBLIC_SCHOOL_YEAR`: displayed in the UI header and metadata.

### Optional environment variables
- `ANTHROPIC_API_KEY`: unlocks `/api/items/generate` for AI item authoring.

> Tip: run `npm run env:check` to validate your `.env` (or `.env.local`) includes everything required before running tests.

## 2) Database preparation (run once per clean environment)
```bash
# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Seed baseline data (teacher, class, students, item bank)
npx prisma db seed
```

## 3) Automated checks
| Suite | Command | Notes |
| --- | --- | --- |
| Env validation | `npm run env:check` | Verifies required env vars are present before running other checks. |
| Lint | `npm run lint` | Runs ESLint on the Next.js app. |
| DB schema sync | `npx prisma db push` | Validates schema matches the target database. |
| Seed verification | `npx prisma db seed` | Ensures baseline data loads for local/e2e tests. |

> End-to-end and API contract tests are not yet implemented. Playwright is the recommended choice for UI flows once test users and deterministic fixtures are available.

## 4) Manual smoke flow (until E2E tests are added)
1. Start the app: `npm run dev`.
2. Sign in via Google on `/auth/signin` (requires configured credentials).
3. Join as a student using the sample class code from the seed data.
4. Submit responses until the 10-item cap is reached, verifying theta updates and next-item selection.
5. Optionally call `/api/items/generate` with valid auth and `ANTHROPIC_API_KEY` to create new items.
