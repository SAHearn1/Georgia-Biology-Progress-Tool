# Canvas LMS Integration

Integration package for Canvas Learning Management System.

## Features

- Assignment creation and management
- Grade passback (LTI 1.3 compliant)
- Student enrollment synchronization
- Course data sync

## Setup

1. Generate Canvas API token from your Canvas instance
2. Configure API endpoint
3. Add environment variables:

```bash
CANVAS_API_URL=https://your-school.instructure.com
CANVAS_API_KEY=your-api-key
```

## Usage

```typescript
import { CanvasClient } from '@ga-biology/integration-canvas';

const client = new CanvasClient({
  apiUrl: process.env.CANVAS_API_URL!,
  apiKey: process.env.CANVAS_API_KEY!,
});

// Create assignment
const assignment = await client.createAssignment(courseId, {
  name: 'Biology Quiz 1',
  points_possible: 100,
  due_at: '2024-12-31T23:59:59Z',
});

// Submit grades
await client.submitGrade(courseId, assignmentId, userId, 95);
```

## API Documentation

- Canvas API: https://canvas.instructure.com/doc/api/
- LTI 1.3: https://www.imsglobal.org/spec/lti/v1p3/
