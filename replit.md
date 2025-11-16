# SubTrack - AI Subscription Management Dashboard

## Overview

SubTrack is an AI-focused subscription management dashboard that helps users track AI tool subscriptions, monitor renewal dates, manage credentials, and receive automated reminders. The application provides both grid and table views for subscription management, with color-coded status indicators based on renewal proximity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System**
- shadcn/ui component library (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Linear/Notion-inspired design system emphasizing clean information hierarchy
- Dark mode support via theme provider with localStorage persistence

**State Management**
- React Query handles all server state (subscriptions data, mutations)
- Local component state via React hooks for UI interactions
- Query invalidation strategy ensures data consistency after mutations

**Key Design Decisions**
- Chose shadcn/ui over traditional component libraries for better customization and bundle size control
- TanStack Query eliminates need for Redux/context for server state, reducing complexity
- Wouter chosen over React Router for smaller bundle size in simple routing scenarios

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe API development
- ESM modules throughout the codebase for modern JavaScript standards
- Structured route handlers in `/server/routes.ts` exposing RESTful endpoints

**Database Layer**
- Drizzle ORM for type-safe database queries and schema management
- Neon PostgreSQL (serverless) as the production database
- WebSocket connection pooling via `@neondatabase/serverless` for edge compatibility
- Schema-first approach with Zod validation integration

**Data Storage Strategy**
- `DatabaseStorage` class implements `IStorage` interface for data access abstraction
- Status calculation logic centralized in storage layer (computed from renewal dates)
- Database migrations managed via Drizzle Kit with schema versioning

**API Design**
- RESTful endpoints following resource-based conventions:
  - `GET /api/subscriptions` - List all subscriptions
  - `GET /api/subscriptions/:id` - Get single subscription
  - `POST /api/subscriptions` - Create subscription
  - `PATCH /api/subscriptions/:id/reminder-days` - Update reminder settings
  - `PUT /api/subscriptions/:id` - Update subscription
  - `DELETE /api/subscriptions/:id` - Delete subscription
- Request validation using Zod schemas from shared layer
- Consistent error handling with appropriate HTTP status codes

**Key Architecture Decisions**
- Storage abstraction (`IStorage` interface) enables future data source swapping without API changes
- Status field calculated dynamically rather than stored, ensuring consistency
- Shared schema definitions between client and server prevent type drift

### Data Schema

**Subscription Model**
```typescript
{
  id: serial (auto-increment)
  name: string (required) - Subscription service name
  cost: float (default: 0) - Subscription cost
  billingPeriod: enum("monthly" | "yearly")
  renewalDate: timestamp (required)
  username: string (optional) - Login credentials
  password: string (optional) - Stored in plain text (security consideration)
  reminderDays: integer (default: 30) - Days before renewal to remind
  status: enum("active" | "warning" | "urgent" | "critical") - Computed field
  category: string (optional)
  notes: text (optional)
  lastLogin: timestamp (optional)
  paymentMethod: string (optional)
  createdAt: timestamp (auto)
}
```

**Status Calculation Logic**
- `critical`: < 0 days or ≤ 5 days until renewal
- `urgent`: 6-14 days until renewal
- `warning`: 15-30 days until renewal  
- `active`: > 30 days until renewal

### External Dependencies

**Third-Party Services**
- **Airtable API** (deprecated): Originally planned for external data source integration
  - Migrated away from Airtable due to persistent authorization issues with personal access tokens
  - All data successfully migrated to PostgreSQL database (23 AI tool subscriptions)
  - Migration script located at `server/migrate-airtable.ts` (one-time use)
  - Airtable integration code in `server/airtable.ts` no longer used

**Database**
- **Neon PostgreSQL**: Serverless Postgres database
  - Connected via `DATABASE_URL` environment variable
  - WebSocket-based connection for edge runtime compatibility
  - Connection pooling via `@neondatabase/serverless` package

**Authentication & Security**
- **bcryptjs**: Password hashing library (imported but not actively used in current implementation)
  - Note: Current implementation stores passwords in plain text - security gap
  - Recommended: Implement encryption before production deployment

**Development Tools**
- **Replit-specific plugins**: Runtime error overlay, cartographer, dev banner
  - Only loaded in development mode (`NODE_ENV !== "production"`)
  - Provides enhanced debugging experience in Replit environment

**Build & Deployment**
- **esbuild**: Server-side code bundling for production
- **Vite**: Frontend bundling and development server
- Production builds output to `dist/` directory with separate client/server bundles

**Key Integration Considerations**
- Airtable integration exists but appears optional (database is primary storage)
- No authentication system currently implemented despite bcryptjs dependency
- Plain text password storage is a security concern for production use
- Environment variables required: `DATABASE_URL`, optional Airtable credentials