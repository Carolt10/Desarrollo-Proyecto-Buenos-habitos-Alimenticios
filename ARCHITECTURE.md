# Monolithic Modular Architecture

## Overview

This project follows a **monolithic modular architecture** pattern, maintaining a single deployment while organizing code into clearly separated concerns:

- **Single Codebase**: One repository, one deployment
- **Frontend/Backend Separation**: `/frontend` and `/backend` directories with distinct responsibilities
- **Module Organization**: Features organized by domain (recipes, education, testimonials, etc.)
- **Clean Code**: SOLID principles, proper layer separation, no circular dependencies

## Directory Structure

```
v0-project/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main entry point
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── api/                      # API routes (backend entry points)
│       ├── education/
│       ├── testimonials/
│       ├── recipes/
│       └── community/
│
├── frontend/                     # Frontend code
│   ├── shared/                   # Shared across all features
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── layout.tsx
│   │   ├── services/             # API client services
│   │   │   └── api.ts            # Centralized fetch calls
│   │   ├── hooks/                # Custom React hooks
│   │   └── index.ts              # Barrel export
│   │
│   └── modules/                  # Feature modules
│       ├── recipes/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── index.ts
│       ├── education/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── index.ts
│       ├── testimonials/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── index.ts
│       └── pages/                # Main page components
│           ├── home.tsx
│           ├── recipes.tsx
│           ├── education.tsx
│           └── community.tsx
│
├── backend/                      # Backend business logic
│   ├── shared/                   # Shared utilities
│   │   ├── config/               # Configuration
│   │   │   └── env.ts
│   │   ├── types/                # Shared types
│   │   │   └── api.ts
│   │   ├── utils/                # Helper functions
│   │   │   ├── errors.ts
│   │   │   └── validators.ts
│   │   └── index.ts
│   │
│   ├── lib/                      # External integrations
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── index.ts
│   │
│   └── modules/                  # Feature modules
│       ├── education/
│       │   ├── repository.ts     # Data access layer
│       │   ├── service.ts        # Business logic
│       │   └── index.ts
│       ├── testimonials/
│       │   ├── repository.ts
│       │   ├── service.ts
│       │   └── index.ts
│       ├── recipes/
│       │   ├── types.ts
│       │   └── repository.ts
│       └── index.ts
│
├── shared/                       # Truly shared (types, constants)
│   ├── types/
│   │   └── index.ts
│   ├── constants/
│   │   └── index.ts
│   └── utils/
│
├── lib/                          # Shared utilities (lib pattern)
├── components/                   # Original components (being refactored)
├── tsconfig.json                 # Updated with path aliases
└── package.json                  # Updated scripts and deps
```

## Layer Architecture

### Frontend Layer
- **UI Components** (`frontend/shared/components/ui`): Reusable shadcn/ui components
- **Shared Components** (`frontend/shared/components`): Layout, header, footer, etc.
- **Page Components** (`frontend/modules/*/pages`): Full page views
- **Services** (`frontend/shared/services`): API client layer (fetch wrappers)

**Data Flow**: User interactions → Page components → Services (API calls) → Backend APIs

### Backend Layer
- **API Routes** (`app/api/*/route.ts`): HTTP endpoints that handle requests
- **Services** (`backend/modules/*/service.ts`): Business logic
- **Repository** (`backend/modules/*/repository.ts`): Data access (Supabase)
- **Types/Utils** (`backend/shared`): Shared backend utilities

**Data Flow**: HTTP Request → API route → Service → Repository → Supabase → Response

## Key Principles

1. **Separation of Concerns**: Frontend doesn't access database directly; backend handles all data operations
2. **Module Independence**: Each module is self-contained (components, services, types)
3. **Centralized Services**: API calls are centralized in `frontend/shared/services/`
4. **Type Safety**: Shared types in `shared/types/` and `backend/shared/types/`
5. **Clean Imports**: Use barrel exports (`index.ts`) for cleaner imports

## Development Workflow

### Adding a New Feature

1. **Create Backend Module**:
   ```
   backend/modules/feature/
   ├── repository.ts    # Supabase queries
   ├── service.ts       # Business logic
   └── index.ts         # Exports
   ```

2. **Create API Route**:
   ```
   app/api/feature/route.ts  # GET, POST handlers
   ```

3. **Create Frontend Module**:
   ```
   frontend/modules/feature/
   ├── components/      # UI components
   ├── pages/           # Page views
   ├── services/        # API client service
   └── index.ts         # Exports
   ```

4. **Connect Services**:
   - Import from `@/frontend/shared/services`
   - Call backend API routes

## Import Patterns

### Frontend Components
```typescript
import { Button } from '@/frontend/shared/components/ui/button'
import Layout from '@/frontend/shared/components/layout'
import { fetchEducation } from '@/frontend/shared/services'
```

### Backend Services
```typescript
import { env } from '@/backend/shared/config'
import { supabaseClient } from '@/backend/lib/supabase'
import { EducationService } from '@/backend/modules/education'
```

## Build & Deployment

- **Single Build**: `npm run build` builds entire Next.js project (frontend + API routes)
- **Single Deploy**: Deploy to Vercel as a single Next.js application
- **Environment**: All env vars in root `.env` (sourced by both frontend and backend)

## Benefits

1. **Scalable Organization**: Easy to add new modules without affecting existing code
2. **Clear Responsibilities**: Frontend/Backend clearly separated
3. **Maintainable**: SOLID principles with proper abstraction layers
4. **Type-Safe**: Full TypeScript throughout
5. **Single Deployment**: Monolithic advantage - no microservices complexity
