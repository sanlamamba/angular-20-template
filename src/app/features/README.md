# Features Module

**Purpose**: Feature-specific components, services, and logic.

## Structure

- `auth/` - Authentication (login, register)
- `dashboard/` - Main dashboard with counter
- `profile/` - User profile management
- `admin/` - Admin panel (role-protected)

## Rules

- Each feature is self-contained
- Can have its own services, components, models
- Should lazy-load when possible
- Each feature has its own route configuration

## Naming Convention

- Components: `login.ts` (NO .component suffix)
- Each component has: .ts, .html, .css, .spec.ts files
