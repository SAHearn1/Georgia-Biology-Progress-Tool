# AI Development Context - Georgia Biology Progress Tool

## Project Overview

The Georgia Biology Progress Tool is a comprehensive web application designed to help teachers prepare students for Biology EOC (End of Course) testing and predict individual student performance. Built with the RootWork Framework ecosystem.

## Architecture

### Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta) with credentials provider
- **Deployment**: Vercel-ready

### Project Structure
```
ga-biology-pm/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/         # NextAuth handlers
│   │   ├── classes/      # Class CRUD operations
│   │   ├── students/     # Student CRUD operations
│   │   ├── enrollments/  # Enrollment CRUD operations
│   │   └── register/     # User registration
│   ├── dashboard/        # Teacher dashboard
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/            # React components
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   └── prisma.ts        # Prisma client singleton
├── packages/
│   └── database/        # Database package
│       ├── prisma/
│       │   └── schema.prisma
│       └── seed/
│           └── index.ts
├── types/               # TypeScript type definitions
└── docs/
    └── ai-development/  # AI agent documentation
```

## Core Domain Models

### User (Teacher)
- Teachers create accounts and manage their classes
- Authentication via NextAuth.js with bcrypt password hashing
- Each teacher owns multiple classes

### Class
- Represents a biology class period
- Owned by a teacher
- Has many students through enrollments
- Fields: name, period, teacher reference

### Student
- Individual student records
- Can be enrolled in multiple classes
- Fields: firstName, lastName, studentId (unique identifier)

### Enrollment
- Junction table linking students to classes
- Tracks enrollment date
- Many-to-many relationship between students and classes

## Key Standards Alignment

The application is designed to support Georgia's Biology End of Course (EOC) standards, which include:

### Georgia Standards of Excellence (GSE) for Biology
1. **Cells and Cellular Processes** (SB1-SB2)
2. **Genetics** (SB3)
3. **Evolution** (SB4-SB5)
4. **Ecology** (SB6)

*Note: Full standards integration is planned for future iterations*

## Development Guidelines

### Database Operations
- Always use Prisma client from `lib/prisma.ts` singleton
- Use transactions for operations affecting multiple tables
- Validate data with Zod schemas before database operations

### Authentication
- NextAuth v5 beta configuration in `lib/auth.ts`
- Protected routes use middleware.ts for auth checks
- API routes validate session before processing requests

### API Route Patterns
```typescript
// Example protected API route
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Proceed with authorized operation
}
```

### Component Patterns
- Use Server Components by default
- Client Components only when needed (forms, interactivity)
- Co-locate related components when possible

## Security Considerations

1. **Password Security**: Passwords hashed with bcrypt (10 rounds)
2. **SQL Injection**: Prevented via Prisma ORM
3. **Authentication**: JWT sessions via NextAuth
4. **Authorization**: Middleware protects authenticated routes
5. **Input Validation**: Zod schemas for API request validation

## Future Enhancements (Roadmap)

1. **Progress Tracking**: Track student progress on specific standards
2. **EOC Predictions**: ML-based prediction of student EOC performance
3. **Analytics Dashboard**: Visual reports on class and student performance
4. **LMS/SIS Integration**: Import students and grades from existing systems
5. **Parent Portal**: Allow parents to view student progress
6. **Assessment Creation**: Create and assign practice assessments
7. **Standards Mapping**: Map lessons and assessments to GSE standards

## Testing Approach

- Integration tests for API routes
- Component tests for UI interactions
- Database operations tested against test database
- Authentication flows tested end-to-end

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret key for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Application URL (http://localhost:3000 for local dev)

## Common Development Tasks

### Adding a New Database Model
1. Update `packages/database/prisma/schema.prisma`
2. Run `npx prisma generate` to update client
3. Run `npx prisma db push` to update database
4. Create API routes for CRUD operations
5. Add TypeScript types in `types/` directory

### Creating a New API Route
1. Create file in `app/api/[route]/route.ts`
2. Implement HTTP methods (GET, POST, PUT, DELETE)
3. Add authentication check
4. Validate input with Zod
5. Use Prisma for database operations
6. Return appropriate status codes and error messages

### Adding a New Page
1. Create route folder in `app/`
2. Create `page.tsx` with Server Component
3. Add to navigation if needed
4. Protect with middleware if authenticated route required

## Conventions

- **File naming**: kebab-case for files, PascalCase for components
- **API responses**: Always return JSON with appropriate status codes
- **Error handling**: Return descriptive error messages with proper HTTP codes
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
- **TypeScript**: Strict mode enabled, no implicit any

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js v5 Docs](https://authjs.dev/)
- [Georgia Biology Standards](https://www.georgiastandards.org/Georgia-Standards/Pages/Science.aspx)

## Contact & Support

For questions about this codebase, refer to:
- README.md for setup instructions
- TESTING.md for testing guidelines
- SECURITY.md for security policies
- DEPLOYMENT.md for deployment procedures
