# Monorepo Structure

The Georgia Biology Progress Tool uses a monorepo architecture powered by pnpm workspaces and Turborepo.

## Directory Structure

```
ga-biology-pm/
├── apps/                          # Applications
│   ├── web/                      # Next.js web application
│   └── psychometrics/            # Python FastAPI service
├── packages/                      # Shared packages
│   ├── database/                 # Prisma schema and migrations
│   ├── shared/                   # Shared types, constants, utils
│   └── integrations/             # LMS/SIS integration packages
│       ├── clever/
│       ├── canvas/
│       └── oneroster/
├── docs/                          # Documentation
│   ├── architecture/             # System architecture docs
│   ├── user-guides/             # End-user documentation
│   └── ai-development/          # AI agent context
├── .github/                       # GitHub configuration
│   └── workflows/               # CI/CD workflows
├── turbo.json                    # Turborepo configuration
├── pnpm-workspace.yaml          # pnpm workspace configuration
└── package.json                  # Root package configuration
```

## Workspace Configuration

### pnpm Workspaces
Defined in `pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/integrations/*"
```

### Turborepo Pipeline
Defined in `turbo.json`:
- Manages build, dev, test, lint, and typecheck tasks
- Handles task dependencies and caching
- Optimizes parallel execution

## Package Naming Convention

All internal packages use the `@ga-biology` scope:
- `@ga-biology/shared` - Shared utilities
- `@ga-biology/database` - Database package
- `@ga-biology/integration-clever` - Clever integration
- `@ga-biology/integration-canvas` - Canvas integration
- `@ga-biology/integration-oneroster` - OneRoster integration

## Apps

### web (`apps/web/`)
Next.js application serving the main web interface.

**Structure**:
```
apps/web/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Protected dashboard routes
│   ├── (assessment)/    # Assessment taking interface
│   └── api/            # API routes
├── components/          # React components
├── lib/                # Utilities and configurations
├── hooks/              # Custom React hooks
└── stores/             # State management
```

### psychometrics (`apps/psychometrics/`)
Python FastAPI service for ML predictions and psychometric analysis.

**Structure**:
```
apps/psychometrics/
├── app/
│   ├── routers/        # API route handlers
│   ├── models/         # Data models
│   └── main.py        # FastAPI app entry
├── tests/              # Test files
└── requirements.txt    # Python dependencies
```

## Packages

### database (`packages/database/`)
Contains Prisma schema, migrations, and seed data.

**Key Files**:
- `prisma/schema.prisma` - Database schema
- `prisma/migrations/` - Migration history
- `seed/index.ts` - Seed script with Georgia standards

### shared (`packages/shared/`)
Shared TypeScript code used across applications.

**Exports**:
- `types/` - TypeScript type definitions
- `constants/` - Shared constants
- `utils/` - Utility functions

### integrations (`packages/integrations/`)
Plugin packages for external system integrations.

**Packages**:
- `clever/` - Clever SSO and roster sync
- `canvas/` - Canvas LMS integration
- `oneroster/` - OneRoster SIS integration

## Dependency Management

### Internal Dependencies
Packages reference each other using workspace protocol:
```json
{
  "dependencies": {
    "@ga-biology/shared": "workspace:*"
  }
}
```

### External Dependencies
- Shared dev dependencies in root `package.json`
- App-specific dependencies in app `package.json`
- Package-specific dependencies in package `package.json`

## Scripts

### Root-level scripts
```bash
pnpm dev              # Start all dev servers
pnpm build            # Build all apps and packages
pnpm test             # Run all tests
pnpm lint             # Lint all code
pnpm typecheck        # Type check all TypeScript
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database
```

### App-specific scripts
```bash
pnpm --filter web dev         # Start web app only
pnpm --filter web build       # Build web app only
```

## Benefits of Monorepo

1. **Code Sharing**: Easy sharing of types, utilities, and constants
2. **Consistent Tooling**: Single configuration for linting, formatting, testing
3. **Atomic Changes**: Update multiple packages in a single commit
4. **Type Safety**: Cross-package type checking
5. **Efficient CI**: Turborepo caching and parallel execution
6. **Clear Dependencies**: Explicit package boundaries and dependencies
