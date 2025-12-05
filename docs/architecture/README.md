# Architecture Documentation

This directory contains architectural documentation for the Georgia Biology Progress Tool.

## Documents

- [System Overview](./system-overview.md) - High-level system architecture
- [Monorepo Structure](./monorepo-structure.md) - Project organization and workspace setup
- [Database Design](./database-design.md) - Database schema and relationships
- [API Design](./api-design.md) - API endpoints and patterns
- [Psychometrics Service](./psychometrics-service.md) - ML and IRT service architecture
- [Integration Architecture](./integration-architecture.md) - LMS/SIS integration patterns

## Architecture Principles

### Monorepo Architecture
The project uses a monorepo structure with pnpm workspaces and Turborepo for:
- Code sharing and reusability
- Consistent tooling and dependencies
- Efficient builds and caching
- Clear separation of concerns

### Microservices
- **Web App**: Next.js application for UI and business logic
- **Psychometrics Service**: Python FastAPI service for ML predictions and IRT analysis
- **Database Package**: Shared Prisma schema and seed data

### Integration Strategy
- Plugin-based integration packages
- Standardized data sync patterns
- OAuth/API key authentication
- Incremental and full sync support

## Technology Stack

### Frontend (Web App)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks + server state
- **Authentication**: NextAuth.js v5

### Backend Services
- **Web API**: Next.js API Routes
- **Psychometrics**: FastAPI (Python)
- **Database**: PostgreSQL with Prisma ORM

### Infrastructure
- **Hosting**: Vercel (web), Cloud Run/Lambda (psychometrics)
- **Database**: Vercel Postgres, Supabase, or Railway
- **CI/CD**: GitHub Actions
- **Monitoring**: TBD (Sentry, DataDog, etc.)

## Design Patterns

### API Design
- RESTful endpoints for CRUD operations
- Consistent error handling and response formats
- Request validation with Zod
- Pagination for list endpoints

### Database Access
- Prisma ORM for type-safe queries
- Connection pooling for performance
- Transactions for data integrity
- Soft deletes where appropriate

### Authentication & Authorization
- JWT-based sessions
- Role-based access control (RBAC)
- Protected API routes
- Middleware for auth checks

## Security Considerations

- Password hashing with bcrypt
- SQL injection prevention via Prisma
- CSRF protection
- Rate limiting on API endpoints
- Secure environment variable management
- Regular dependency updates

## Performance Optimization

- Server-side rendering (SSR) for initial page loads
- Static generation for public pages
- API route caching
- Database query optimization
- CDN for static assets
- Code splitting and lazy loading

## Scalability

The architecture is designed to scale:
- Horizontal scaling for web and API services
- Database connection pooling
- Caching layers (Redis future enhancement)
- Async job processing for heavy operations
- Microservice separation for independent scaling
