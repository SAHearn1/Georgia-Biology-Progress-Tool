# Clever Integration

Integration package for Clever SSO and data synchronization.

## Features

- OAuth 2.0 Single Sign-On (SSO)
- Student roster synchronization
- Class/Section synchronization
- Teacher data synchronization
- Automated data updates

## Setup

1. Register your application with Clever: https://clever.com/developers
2. Configure OAuth redirect URI
3. Add environment variables:

```bash
CLEVER_CLIENT_ID=your-client-id
CLEVER_CLIENT_SECRET=your-client-secret
CLEVER_REDIRECT_URI=https://yourapp.com/auth/clever/callback
CLEVER_DISTRICT=your-district-id
```

## Usage

```typescript
import { CleverClient } from '@ga-biology/integration-clever';

const client = new CleverClient({
  clientId: process.env.CLEVER_CLIENT_ID!,
  clientSecret: process.env.CLEVER_CLIENT_SECRET!,
  redirectUri: process.env.CLEVER_REDIRECT_URI!,
  district: process.env.CLEVER_DISTRICT!,
});

// Exchange OAuth code for token
const token = await client.exchangeCode(authCode);

// Sync student data
const result = await client.syncStudents();
console.log(`Created ${result.created}, Updated ${result.updated}`);
```

## API Documentation

- Clever API Docs: https://dev.clever.com/docs/api-overview
- OAuth 2.0: https://dev.clever.com/docs/identity-api
