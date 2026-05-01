# Project Structure Reference

## Complete Directory Tree

```
v0-project/
│
├── 📁 app/                           # Next.js App Router root
│   ├── page.tsx                      # Main entry point (renders Layout + page)
│   ├── layout.tsx                    # Root layout wrapper
│   ├── globals.css                   # Global Tailwind styles
│   ├── favicon.ico
│   └── 📁 api/                       # API Routes (backend entry points)
│       ├── 📁 education/
│       │   └── route.ts              # GET /api/education
│       ├── 📁 testimonials/
│       │   ├── route.ts              # GET/POST /api/testimonials
│       │   └── 📁 [id]/
│       │       └── route.ts          # DELETE /api/testimonials/[id]
│       ├── 📁 recipes/
│       │   └── route.ts              # GET /api/recipes
│       └── 📁 community/
│           └── route.ts              # GET/POST /api/community
│
├── 📁 frontend/                      # All frontend code
│   ├── index.ts                      # Barrel export
│   ├── 📁 shared/                    # Shared frontend code
│   │   ├── index.ts
│   │   ├── 📁 components/            # Reusable UI components
│   │   │   ├── index.ts              # Barrel export
│   │   │   ├── header.tsx            # Site header
│   │   │   ├── footer.tsx            # Site footer
│   │   │   ├── sidebar.tsx           # Navigation sidebar
│   │   │   ├── layout.tsx            # Layout wrapper
│   │   │   ├── testimonial-card.tsx  # Testimonial display
│   │   │   ├── share-story-modal.tsx # Story submission modal
│   │   │   ├── theme-provider.tsx    # Theme context provider
│   │   │   └── 📁 ui/                # shadcn/ui components
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── card.tsx
│   │   │       └── ... (30+ more)
│   │   ├── 📁 services/              # API client layer
│   │   │   ├── index.ts
│   │   │   └── api.ts                # Centralized fetch wrappers
│   │   └── 📁 hooks/                 # Custom React hooks
│   │       └── .gitkeep
│   │
│   └── 📁 modules/                   # Feature modules
│       ├── index.ts
│       ├── 📁 recipes/
│       │   ├── index.ts
│       │   ├── 📁 components/
│       │   │   └── recipe-card.tsx
│       │   ├── 📁 pages/
│       │   │   └── recipes.tsx
│       │   └── 📁 services/
│       │       └── recipes.ts
│       ├── 📁 education/
│       │   ├── index.ts
│       │   ├── 📁 components/
│       │   │   └── video-card.tsx
│       │   ├── 📁 pages/
│       │   │   └── education.tsx
│       │   └── 📁 services/
│       │       └── education.ts
│       ├── 📁 testimonials/
│       │   ├── index.ts
│       │   ├── 📁 components/
│       │   ├── 📁 pages/
│       │   │   └── testimonials.tsx
│       │   └── 📁 services/
│       │       └── testimonials.ts
│       └── 📁 pages/                 # Main page views
│           ├── home.tsx
│           ├── recipes.tsx
│           ├── education.tsx
│           ├── community.tsx
│           ├── games.tsx
│           └── alerts.tsx
│
├── 📁 backend/                       # All backend code
│   ├── index.ts                      # Barrel export
│   ├── 📁 shared/                    # Shared backend utilities
│   │   ├── 📁 config/
│   │   │   ├── env.ts                # Environment configuration
│   │   │   └── index.ts
│   │   ├── 📁 types/
│   │   │   ├── api.ts                # API response/request types
│   │   │   └── index.ts
│   │   ├── 📁 utils/
│   │   │   ├── errors.ts             # Error handling
│   │   │   ├── validators.ts         # Input validation
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── 📁 lib/                       # External integrations
│   │   └── 📁 supabase/
│   │       ├── client.ts             # Supabase client instance
│   │       └── index.ts
│   └── 📁 modules/                   # Feature modules
│       ├── index.ts
│       ├── 📁 education/             # Education module
│       │   ├── repository.ts         # Supabase queries
│       │   ├── service.ts            # Business logic
│       │   ├── types.ts              # Module types (if any)
│       │   └── index.ts
│       ├── 📁 testimonials/          # Testimonials module
│       │   ├── repository.ts
│       │   ├── service.ts
│       │   ├── types.ts
│       │   └── index.ts
│       └── 📁 recipes/               # Recipes module (stub)
│           ├── types.ts
│           └── repository.ts
│
├── 📁 shared/                        # Shared types and constants
│   ├── 📁 types/
│   │   └── index.ts                  # Shared TypeScript types
│   ├── 📁 constants/
│   │   └── index.ts                  # Shared constants
│   └── 📁 utils/
│
├── 📁 lib/                           # Shared utilities
│
├── 📁 components/                    # Original components (being refactored)
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   ├── testimonial-card.tsx
│   ├── share-story-modal.tsx
│   ├── theme-provider.tsx
│   ├── layout.tsx
│   ├── recipe-card.tsx
│   ├── video-card.tsx
│   └── 📁 ui/                        # shadcn/ui components
│
├── 📁 public/                        # Static assets
│   └── ... (icons, images, etc.)
│
├── tsconfig.json                     # TypeScript config with path aliases
├── tailwind.config.js                # Tailwind CSS config
├── next.config.js                    # Next.js config
├── package.json                      # Dependencies and scripts
├── package-lock.json                 # Dependency lock file
├── .env.local                        # Local environment variables
├── .gitignore
├── ARCHITECTURE.md                   # Architecture documentation
├── DEVELOPMENT.md                    # Development guide
└── STRUCTURE.md                      # This file
```

## Module Breakdown

### Education Module
**Purpose**: Manage educational content (videos, articles, categories)

- Backend: `backend/modules/education/`
  - Repository: Queries for videos, articles, categories from Supabase
  - Service: Business logic for education features
  
- Frontend: `frontend/modules/education/`
  - Pages: Main education page
  - Components: Video cards, article previews
  - Services: API client for education endpoints

- API: `app/api/education/route.ts`

### Testimonials Module
**Purpose**: Manage user testimonials/stories

- Backend: `backend/modules/testimonials/`
  - Repository: CRUD operations for testimonials
  - Service: Validation, submission logic
  
- Frontend: `frontend/modules/testimonials/`
  - Pages: Testimonials listing
  - Components: Testimonial cards, share modal
  - Services: API client for testimonials
  
- API: 
  - `app/api/testimonials/route.ts` (GET/POST)
  - `app/api/testimonials/[id]/route.ts` (DELETE)

### Recipes Module
**Purpose**: Manage healthy recipes for children

- Backend: `backend/modules/recipes/`
  - Repository: Recipe queries
  - Service: Recipe business logic
  
- Frontend: `frontend/modules/recipes/`
  - Pages: Recipes page
  - Components: Recipe cards
  - Services: API client
  
- API: `app/api/recipes/route.ts`

### Shared Frontend
**Purpose**: Reusable components and services for all modules

- Components: Header, footer, layout, shared UI
- Services: Centralized API client
- Hooks: Custom React hooks (useEducation, useTestimonials, etc.)

### Shared Backend
**Purpose**: Shared backend utilities and configuration

- Config: Environment variables
- Utils: Error handling, validation
- Types: Shared API types
- Lib: Database clients (Supabase)

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main page router (switches between modules) |
| `frontend/shared/services/api.ts` | Centralized API client |
| `backend/lib/supabase/client.ts` | Supabase instance |
| `backend/shared/utils/errors.ts` | Centralized error handling |
| `tsconfig.json` | Path aliases (@/frontend, @/backend, @/shared) |
| `ARCHITECTURE.md` | Full architecture documentation |
| `DEVELOPMENT.md` | Development workflow guide |

## Import Patterns Quick Reference

```typescript
// Frontend Components
import { Button } from '@/frontend/shared/components/ui/button'
import { Header } from '@/frontend/shared/components'
import { fetchEducation } from '@/frontend/shared/services'

// Backend Services
import { EducationService } from '@/backend/modules/education'
import { supabaseClient } from '@/backend/lib/supabase'
import { env } from '@/backend/shared/config'

// Shared Types & Constants
import type { Education } from '@/shared/types'
import { API_ENDPOINTS } from '@/shared/constants'
```

## Getting Started Checklist

- [x] Directory structure created
- [x] Module organization established
- [x] API routes scaffolded
- [x] Service layer created
- [x] Configuration files setup
- [x] Documentation written
- [ ] Next: Install dependencies (`npm install`)
- [ ] Next: Test dev server (`npm run dev`)
- [ ] Next: Verify no import errors
- [ ] Next: Begin feature development
