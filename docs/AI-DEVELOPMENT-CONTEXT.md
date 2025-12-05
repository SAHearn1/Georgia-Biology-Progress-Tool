# GA Biology Progress Monitor — AI Development Context

> **Purpose**: This file provides context for AI coding assistants (Claude Code, Codex, Cursor, etc.) working on this project. Read this file at the start of each development session.

---

## Project Overview

**Georgia High School Biology Progress Monitoring System** — A standalone-first assessment platform for tracking student mastery of GSE Biology standards, designed for deployment without LMS dependencies.

### Current Status: MVP Phase 1

**What's Built** (v0.1.0):
- ✅ Teacher authentication (NextAuth.js with credentials)
- ✅ Class management (create, edit, delete)
- ✅ Student records (CRUD operations)
- ✅ Enrollment system (student-class relationships)
- ✅ PostgreSQL database with Prisma ORM
- ✅ Responsive UI with Tailwind CSS

**What's Planned** (Future Phases):
- 📋 GSE Biology standards alignment (SB1-SB6)
- 📋 Assessment creation and delivery
- 📋 Psychometric analysis (IRT models)
- 📋 Progress monitoring dashboards
- 📋 EOC prediction models
- 📋 Optional LMS/SIS integrations

### Key Constraints

1. **Standalone First**: No external integrations required for core functionality
2. **FERPA Compliant**: Student data privacy is paramount
3. **Accessibility Required**: WCAG 2.1 AA compliance (to be implemented)
4. **Georgia-Specific**: Aligned to GSE Biology standards (SB1-SB6)

---

## Technology Stack

| Layer | Technology | Version | Status |
|-------|------------|---------|--------|
| Framework | Next.js (App Router) | 16.x | ✅ Current |
| Language | TypeScript | 5.x | ✅ Current |
| Styling | Tailwind CSS | 4.x | ✅ Current |
| Database | PostgreSQL + Prisma | 5.x | ✅ Current |
| Auth | NextAuth.js | 5.x (beta) | ✅ Current |
| Forms | React Hook Form + Zod | Latest | ✅ Current |
| UI Library | shadcn/ui | - | 📋 Planned |
| State | Zustand + TanStack Query | - | 📋 Planned |
| Testing | Vitest + Playwright | - | 📋 Planned |

---

## Project Structure

### Current Structure (MVP)

```
Georgia-Biology-Progress-Tool/
├── app/                       # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── register/             # Teacher registration
│   ├── login/                # (planned - uses NextAuth routes)
│   └── dashboard/            # Protected dashboard
│       ├── page.tsx          # Overview
│       ├── classes/          # Class management
│       ├── students/         # Student management
│       └── enrollments/      # (integrated in classes)
├── components/               # React components
│   ├── DeleteClassButton.tsx
│   ├── DeleteStudentButton.tsx
│   ├── EnrollStudentForm.tsx
│   └── SignOutButton.tsx
├── lib/                      # Utilities
│   ├── auth.ts              # NextAuth config
│   └── prisma.ts            # Prisma client
├── prisma/                   # Database
│   └── schema.prisma        # Database schema
├── types/                    # TypeScript types
│   └── next-auth.d.ts       # NextAuth type extensions
└── middleware.ts             # Route protection
```

### Future Structure (Full Vision)

```
ga-biology-pm/
├── apps/
│   ├── web/                    # Next.js application
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/              # Utilities
│   │   ├── hooks/            # Custom hooks
│   │   └── stores/           # Zustand stores
│   └── psychometrics/         # Python FastAPI service
├── packages/
│   ├── database/              # Prisma schema & migrations
│   ├── shared/                # Shared types & constants
│   └── integrations/          # Optional integration plugins
└── docs/
```

---

## Coding Standards

### TypeScript

```typescript
// ✅ DO: Use explicit types
function getStudent(id: string): Promise<Student | null> {
  return prisma.student.findUnique({ where: { id } });
}

// ❌ DON'T: Use any
function getStudent(id: any): any {
  return prisma.student.findUnique({ where: { id } });
}
```

### React Components

```typescript
// ✅ DO: Server Components by default
// app/students/page.tsx
export default async function StudentsPage() {
  const students = await getStudents();
  return <StudentList students={students} />;
}

// ✅ DO: Client Components only when needed
// components/student-search.tsx
'use client';

import { useState } from 'react';

export function StudentSearch() {
  const [query, setQuery] = useState('');
  // Interactive component logic
}
```

### API Routes

```typescript
// ✅ DO: Use Route Handlers with validation
// app/api/students/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  gradeLevel: z.number().min(9).max(12),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createStudentSchema.parse(body);

    const student = await prisma.student.create({
      data: validated,
    });

    return NextResponse.json({ data: student }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Response Format

```typescript
// ✅ DO: Consistent API responses
interface ApiResponse<T> {
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

// Success
return NextResponse.json({ data: student });

// Error
return NextResponse.json({ error: 'Student not found' }, { status: 404 });

// Paginated
return NextResponse.json({
  data: students,
  meta: { page: 1, pageSize: 20, total: 150 }
});
```

---

## Database Patterns

### Current Schema

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  password      String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  classes       Class[]
}

model Class {
  id          String       @id @default(cuid())
  name        String
  period      String?
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  enrollments Enrollment[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Student {
  id          String       @id @default(cuid())
  studentId   String       @unique
  firstName   String
  lastName    String
  gradeLevel  Int?
  enrollments Enrollment[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Enrollment {
  id        String   @id @default(cuid())
  studentId String
  classId   String
  student   Student  @relation(fields: [studentId], references: [id])
  class     Class    @relation(fields: [classId], references: [id])
  createdAt DateTime @default(now())

  @@unique([studentId, classId])
}
```

### Prisma Queries

```typescript
// ✅ DO: Select only needed fields
const students = await prisma.student.findMany({
  where: { classId },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    // Don't select sensitive demographics unless needed
  },
});

// ✅ DO: Use transactions for multi-table operations
await prisma.$transaction([
  prisma.enrollment.deleteMany({ where: { studentId } }),
  prisma.student.update({
    where: { id: studentId },
    data: { deletedAt: new Date() }, // Soft delete (to be implemented)
  }),
]);
```

### Soft Deletes (FERPA Compliance - To Be Implemented)

```typescript
// 📋 PLANNED: Soft delete student records
await prisma.student.update({
  where: { id },
  data: { deletedAt: new Date() },
});

// 📋 PLANNED: Filter out deleted records by default
const students = await prisma.student.findMany({
  where: {
    classId,
    deletedAt: null, // Exclude soft-deleted
  },
});
```

---

## Component Patterns

### Current Pattern (Server Components)

```typescript
// ✅ Current approach: Server Components with forms
export default async function StudentsPage() {
  const students = await prisma.student.findMany();

  return (
    <div>
      <h1>Students</h1>
      <Link href="/dashboard/students/new">Add Student</Link>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.firstName} {student.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Future Pattern (shadcn/ui)

```typescript
// 📋 PLANNED: shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function StudentCard({ student }: { student: Student }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{student.firstName} {student.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Grade: {student.gradeLevel}</p>
      </CardContent>
    </Card>
  );
}
```

### Loading States

```typescript
// 📋 PLANNED: Use Suspense with loading.tsx
// app/students/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
```

### Error Handling

```typescript
// 📋 PLANNED: Use error.tsx for error boundaries
// app/students/error.tsx
'use client';

export default function StudentsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-4 border border-red-500 rounded">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## State Management

### Current Approach

Currently using React Server Components with server actions (planned) and form submissions. No client-side state management library yet.

### Future: Server State (TanStack Query)

```typescript
// 📋 PLANNED: Use TanStack Query for server state
// hooks/use-students.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useStudents(classId: string) {
  return useQuery({
    queryKey: ['students', classId],
    queryFn: () => fetch(`/api/students?classId=${classId}`).then(r => r.json()),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentInput) =>
      fetch('/api/students', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
```

### Future: Client State (Zustand)

```typescript
// 📋 PLANNED: Use Zustand for UI state
// stores/assessment-store.ts
import { create } from 'zustand';

interface AssessmentStore {
  currentItemIndex: number;
  responses: Record<string, string>;
  setResponse: (itemId: string, response: string) => void;
  nextItem: () => void;
  prevItem: () => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  currentItemIndex: 0,
  responses: {},
  setResponse: (itemId, response) =>
    set((state) => ({
      responses: { ...state.responses, [itemId]: response },
    })),
  nextItem: () =>
    set((state) => ({ currentItemIndex: state.currentItemIndex + 1 })),
  prevItem: () =>
    set((state) => ({ currentItemIndex: Math.max(0, state.currentItemIndex - 1) })),
}));
```

---

## Authentication Patterns

### Current Implementation

```typescript
// ✅ Current: NextAuth.js with credentials provider
// lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/register',
  },
});
```

### Protecting Routes

```typescript
// ✅ Current: Middleware for route protection
// middleware.ts
export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### Future: Role-Based Access

```typescript
// 📋 PLANNED: Check roles in API routes and pages
// lib/auth.ts
import { getServerSession } from 'next-auth';

export async function requireRole(roles: Role[]) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  if (!roles.includes(session.user.role)) {
    throw new Error('Forbidden');
  }

  return session.user;
}

// Usage in API route
export async function GET() {
  const user = await requireRole(['ADMIN', 'TEACHER']);
  // ...
}
```

---

## Testing Patterns

### Current Status

No automated testing yet (MVP phase).

### Future: Unit Tests (Vitest)

```typescript
// 📋 PLANNED: Test business logic
// lib/scoring.test.ts
import { describe, it, expect } from 'vitest';
import { scoreMultipleChoice, scoreMultiSelect } from './scoring';

describe('scoreMultipleChoice', () => {
  it('returns 1 for correct answer', () => {
    expect(scoreMultipleChoice('A', 'A')).toBe(1);
  });

  it('returns 0 for incorrect answer', () => {
    expect(scoreMultipleChoice('A', 'B')).toBe(0);
  });
});
```

### Future: E2E Tests (Playwright)

```typescript
// 📋 PLANNED: Test critical user flows
// e2e/assessment.spec.ts
import { test, expect } from '@playwright/test';

test('teacher can manage students', async ({ page }) => {
  // Login as teacher
  await page.goto('/register');
  await page.fill('[name=email]', 'teacher@test.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');

  // Navigate to students
  await page.goto('/dashboard/students');

  // Add student
  await page.click('text=Add Student');
  await page.fill('[name=firstName]', 'John');
  await page.fill('[name=lastName]', 'Doe');
  await page.click('button[type=submit]');

  // Verify student shown
  await expect(page.locator('text=John Doe')).toBeVisible();
});
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `app/students/page.tsx` |
| Layouts | `layout.tsx` | `app/students/layout.tsx` |
| Loading | `loading.tsx` | `app/students/loading.tsx` |
| Error | `error.tsx` | `app/students/error.tsx` |
| Components | `PascalCase.tsx` | `DeleteStudentButton.tsx` |
| Hooks | `use-*.ts` | `use-students.ts` |
| Stores | `*-store.ts` | `assessment-store.ts` |
| Utils | `kebab-case.ts` | `scoring-utils.ts` |
| Types | `*.types.ts` | `student.types.ts` |

**Note**: Current codebase uses PascalCase for components. Future code should follow kebab-case for consistency with Next.js conventions.

---

## Key Domain Concepts

### GSE Biology Standards (Planned)

```typescript
// 📋 PLANNED: Standards hierarchy
interface Standard {
  id: string;
  code: string;      // "SB1", "SB2", etc.
  title: string;
  domain: string;    // "Cells", "Genetics", etc.
  elements: Element[];
}

interface Element {
  id: string;
  code: string;      // "SB1a", "SB1b", etc.
  description: string;
  dokLevel: 1 | 2 | 3;
}
```

### Assessment Types (Planned)

```typescript
// 📋 PLANNED
type AssessmentType =
  | 'DIAGNOSTIC'   // Start of course, identify gaps
  | 'FORMATIVE'    // During instruction, quick checks
  | 'BENCHMARK'    // End of unit, mastery check
  | 'SUMMATIVE';   // EOC practice
```

### Item Types (Planned)

```typescript
// 📋 PLANNED
type ItemType =
  | 'MC'   // Multiple choice (single answer)
  | 'MS'   // Multi-select (multiple answers)
  | 'CR'   // Constructed response (free text)
  | 'TE';  // Technology-enhanced
```

### IRT Parameters (Phase 2+)

```typescript
// 📋 PLANNED: Psychometric analysis
interface IRTParams {
  a: number;  // Discrimination (0.5 - 2.5)
  b: number;  // Difficulty (-2.5 - 2.5)
  c: number;  // Pseudo-guessing (0 - 0.35)
}
```

---

## Current Development Phase

### Phase 1.1: MVP Foundation ✅ COMPLETE

**Completed**:
- [x] Teacher registration and authentication
- [x] Basic class management
- [x] Student CRUD operations
- [x] Enrollment system
- [x] PostgreSQL + Prisma setup
- [x] Basic responsive UI

### Phase 1.2: Standards & Assessments 📋 NEXT

**Planned Tasks**:
- [ ] GSE Biology standards data model
- [ ] Seed database with SB1-SB6 standards
- [ ] Basic assessment creation UI
- [ ] Question bank structure
- [ ] Simple assessment delivery (no IRT)

### Phase 1.3: Progress Tracking 📋 FUTURE

**Planned Tasks**:
- [ ] Student performance tracking
- [ ] Class-level progress dashboard
- [ ] Simple mastery calculations
- [ ] Export to CSV functionality

---

## Common Gotchas

### 1. Prisma Client Generation
```bash
# After schema changes, regenerate client
npx prisma generate
# Or for development
npx prisma db push
```

### 2. NextAuth Session Types
```typescript
// ✅ Current: Extended in types/next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

// 📋 Planned: Add role support
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      schoolId: string;
    } & DefaultSession['user'];
  }
}
```

### 3. Server vs Client Components
```typescript
// ❌ This will fail - hooks in Server Component
export default async function Page() {
  const [state, setState] = useState(); // Error!
}

// ✅ Correct - separate client component
export default async function Page() {
  const data = await getData();
  return <ClientComponent data={data} />;
}
```

### 4. Database Connection
```bash
# Current: Direct connection for development
DATABASE_URL="postgresql://user:password@localhost:5432/biology_tool"

# 📋 Planned: Connection pooling for production
DATABASE_URL="${POSTGRES_PRISMA_URL}"
DIRECT_URL="${POSTGRES_URL_NON_POOLING}"
```

---

## Reference Files

When implementing features, reference these existing patterns:

| Pattern | Reference File |
|---------|----------------|
| Page with data | `app/dashboard/students/page.tsx` |
| Form submission | `app/dashboard/students/new/page.tsx` |
| Dynamic routes | `app/dashboard/classes/[id]/page.tsx` |
| Edit forms | `app/dashboard/students/[id]/edit/page.tsx` |
| Client components | `components/DeleteStudentButton.tsx` |
| Database queries | Check any page.tsx file |
| Auth config | `lib/auth.ts` |
| Prisma client | `lib/prisma.ts` |

---

## Environment Variables

### Required (Current)

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### Future Requirements

```bash
# Optional: LMS Integration
LMS_API_KEY=""
LMS_API_URL=""

# Optional: Psychometrics Service
PSYCHOMETRICS_API_URL="http://localhost:8000"

# Optional: Analytics
ANALYTICS_ENABLED="false"
```

---

## Questions?

If you encounter unclear requirements:
1. Check existing similar code in the codebase
2. Refer to this document for patterns and standards
3. Check the README.md for setup instructions
4. Ask the developer for clarification before proceeding
5. Document assumptions in code comments

---

## Version History

- **v0.1.0** (Current): MVP with teacher auth, classes, students, enrollments
- **v0.2.0** (Planned): GSE standards integration and basic assessments
- **v0.3.0** (Planned): Progress tracking and analytics
- **v1.0.0** (Future): Full psychometric analysis with IRT models

---

*Last Updated: 2025-12-05*
*Project Status: MVP Phase 1.1 Complete, Phase 1.2 Planning*
