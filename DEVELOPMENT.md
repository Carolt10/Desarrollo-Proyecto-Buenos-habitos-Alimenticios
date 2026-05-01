# Development Guide

## Getting Started

### Installation
```bash
npm install
# or
pnpm install
```

### Development Server
```bash
npm run dev
```

This starts the Next.js dev server on `http://localhost:3000` with:
- Frontend on `/` and `/app/*` routes
- Backend API on `/api/*` routes
- Hot Module Replacement (HMR) enabled

### Building for Production
```bash
npm run build
npm run start
```

## Project Structure Overview

The project uses a **monolithic modular architecture**:

- **`/frontend`** - All user-facing code (React components, pages, client services)
- **`/backend`** - Server-side logic (API handlers, database repositories, services)
- **`/shared`** - Shared types and constants used by both frontend and backend
- **`/app`** - Next.js App Router (pages and API routes)

See `ARCHITECTURE.md` for detailed structure and design patterns.

## Working with Modules

### Module Structure

Each feature module follows this pattern:

**Backend** (`backend/modules/feature/`):
```
feature/
├── repository.ts  # Database queries (Supabase)
├── service.ts     # Business logic
├── types.ts       # Module-specific types
└── index.ts       # Exports
```

**Frontend** (`frontend/modules/feature/`):
```
feature/
├── components/    # UI components specific to this module
├── pages/         # Full page views
├── services/      # API client service (calls backend)
├── hooks/         # Custom React hooks
└── index.ts       # Exports
```

### Adding a New Module

1. **Create Backend Module** (`backend/modules/myfeature/`):

   ```typescript
   // backend/modules/myfeature/repository.ts
   import { supabaseClient } from '@/backend/lib/supabase'
   
   export class MyfeatureRepository {
     async getAll() {
       const { data, error } = await supabaseClient
         .from('myfeature')
         .select('*')
       return { data, error }
     }
   }
   ```

   ```typescript
   // backend/modules/myfeature/service.ts
   import { MyfeatureRepository } from './repository'
   
   export class MyfeatureService {
     private repo = new MyfeatureRepository()
     
     async getAllItems() {
       return this.repo.getAll()
     }
   }
   ```

2. **Create API Route** (`app/api/myfeature/route.ts`):

   ```typescript
   import { MyfeatureService } from '@/backend/modules/myfeature'
   
   export async function GET() {
     const service = new MyfeatureService()
     const items = await service.getAllItems()
     return Response.json(items)
   }
   ```

3. **Create Frontend Module** (`frontend/modules/myfeature/`):

   ```typescript
   // frontend/modules/myfeature/services/myfeature.ts
   import { apiClient } from '@/frontend/shared/services'
   
   export async function fetchMyfeature() {
     return apiClient.get('/api/myfeature')
   }
   ```

   ```typescript
   // frontend/modules/myfeature/pages/myfeature.tsx
   'use client'
   
   import { useEffect, useState } from 'react'
   import { fetchMyfeature } from '../services/myfeature'
   
   export default function MyfeaturePage() {
     const [items, setItems] = useState([])
     
     useEffect(() => {
       fetchMyfeature().then(setItems)
     }, [])
     
     return <div>{/* Render items */}</div>
   }
   ```

## Common Tasks

### Accessing the Database

**Always use the backend repository layer**:

```typescript
// Good: In backend/modules/feature/repository.ts
import { supabaseClient } from '@/backend/lib/supabase'

export class FeatureRepository {
  async getData() {
    const { data } = await supabaseClient.from('table').select('*')
    return data
  }
}
```

**Don't do this** in frontend code:
```typescript
// Bad: Don't import supabaseClient in frontend
import { supabaseClient } from '@/backend/lib/supabase'  // ❌
```

### Creating API Endpoints

API routes live in `/app/api/` and serve as the communication layer:

```typescript
// app/api/feature/route.ts
import { FeatureService } from '@/backend/modules/feature'
import { handleError } from '@/backend/shared/utils'

export async function GET(request: Request) {
  try {
    const service = new FeatureService()
    const data = await service.getData()
    return Response.json(data)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const service = new FeatureService()
    const result = await service.create(body)
    return Response.json(result, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}
```

### Calling APIs from Frontend

Use the centralized service layer:

```typescript
// frontend/modules/feature/services/feature.ts
export async function fetchFeatures() {
  const response = await fetch('/api/feature')
  return response.json()
}

export async function createFeature(data: FeatureData) {
  const response = await fetch('/api/feature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}
```

Then in components:
```typescript
// frontend/modules/feature/pages/feature.tsx
'use client'

import { fetchFeatures, createFeature } from '../services/feature'

export default function FeaturePage() {
  const [features, setFeatures] = useState([])
  
  useEffect(() => {
    fetchFeatures().then(setFeatures)
  }, [])
  
  return (
    <div>
      {/* Use features */}
    </div>
  )
}
```

### Working with Types

Shared types go in `shared/types/`:

```typescript
// shared/types/index.ts
export interface Feature {
  id: string
  name: string
  description: string
}
```

Use in both frontend and backend:
```typescript
// backend/modules/feature/repository.ts
import { Feature } from '@/shared/types'

// frontend/modules/feature/pages/feature.tsx
import { Feature } from '@/shared/types'
```

## File Organization Best Practices

1. **Keep modules focused** - One responsibility per module
2. **Use barrel exports** (`index.ts`) - Makes imports cleaner
3. **Organize by feature** - Group related code together
4. **Separate concerns** - UI in components, logic in services/repositories
5. **Type safety** - Use TypeScript throughout

## Debugging

### Check API Routes
```bash
# View request/response in browser Network tab
# API routes at http://localhost:3000/api/*
```

### Common Issues

**"Cannot find module" errors**:
- Check `tsconfig.json` path aliases
- Ensure file exists at the path
- Restart dev server

**API calls failing**:
- Check backend service for errors
- Verify database connection (Supabase)
- Check request body format

**Type errors**:
- Ensure types are shared in `shared/types/`
- Check import paths in `tsconfig.json`

## Next Steps

- Read `ARCHITECTURE.md` for the full design
- Create your first module following the patterns above
- Check existing modules for reference implementations
