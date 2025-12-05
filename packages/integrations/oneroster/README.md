# OneRoster Integration

Integration package for OneRoster v1.1/1.2 compliant Student Information Systems (SIS).

## Features

- Full roster data synchronization
- Incremental updates support
- OAuth 1.0 authentication
- Support for both OneRoster 1.1 and 1.2

## Supported Entities

- Organizations (districts and schools)
- Users (students, teachers, administrators)
- Classes (courses and sections)
- Enrollments (student-class associations)

## Setup

1. Obtain OneRoster credentials from your SIS provider
2. Configure API endpoint and credentials
3. Add environment variables:

```bash
ONEROSTER_BASE_URL=https://your-sis-provider.com/ims/oneroster/v1p1
ONEROSTER_CLIENT_ID=your-client-id
ONEROSTER_CLIENT_SECRET=your-client-secret
ONEROSTER_VERSION=1.1
```

## Usage

```typescript
import { OneRosterClient } from '@ga-biology/integration-oneroster';

const client = new OneRosterClient({
  baseUrl: process.env.ONEROSTER_BASE_URL!,
  clientId: process.env.ONEROSTER_CLIENT_ID!,
  clientSecret: process.env.ONEROSTER_CLIENT_SECRET!,
  version: '1.1',
});

// Full sync (first time)
const result = await client.syncAll();
console.log('Synced:', result);

// Incremental sync (subsequent updates)
const lastSync = new Date('2024-01-01');
const updates = await client.syncIncremental(lastSync);
console.log('Updates:', updates);
```

## Supported SIS Providers

- PowerSchool
- Infinite Campus
- Skyward
- Aeries
- Any OneRoster 1.1/1.2 compliant system

## API Documentation

- OneRoster Spec: https://www.imsglobal.org/activity/onerosterlis
- OneRoster 1.1: https://www.imsglobal.org/oneroster-v11-final-specification
- OneRoster 1.2: https://www.imsglobal.org/spec/oneroster/v1p2
