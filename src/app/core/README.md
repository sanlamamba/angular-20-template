# Core Module

**Purpose**: Singleton services, guards, interceptors, and models used throughout the app.

## Structure

- `guards/` - Route guards (auth-guard.ts, role-guard.ts)
- `interceptors/` - HTTP interceptors (auth-interceptor.ts, error-interceptor.ts, loading-interceptor.ts)
- `services/` - Singleton services (auth.ts, loading.ts, error-handler.ts)
- `models/` - TypeScript interfaces and types (user.ts, auth-response.ts)

## Rules

- All services are `providedIn: 'root'`
- Only ONE instance of each service exists
- Guards use functional guard syntax (CanActivateFn)
- Interceptors use functional interceptor syntax (HttpInterceptorFn)

## Naming Convention

- Services: `auth.ts` (NO .service suffix)
- Guards: `auth-guard.ts` (WITH dash-suffix)
- Interceptors: `auth-interceptor.ts` (WITH dash-suffix)
- Models: `user.ts` (NO .model suffix)
