# Core Module

**Purpose**: Singleton services, guards, interceptors, and models used throughout the app.

## Structure

- `guards/` - Route guards (auth-guard.ts, role-guard.ts)
- `interceptors/` - HTTP interceptors (auth-interceptor.ts, error-interceptor.ts, loading-interceptor.ts)
- `services/` - Singleton services (auth.ts, loading.ts, error-handler.ts, api.service.ts, user-api.service.ts)
- `models/` - TypeScript interfaces and types (user.ts, auth-response.ts)

## Rules

- All services are `providedIn: 'root'`
- Only ONE instance of each service exists
- Guards use functional guard syntax (CanActivateFn)
- Interceptors use functional interceptor syntax (HttpInterceptorFn)

## Naming Convention

- Services: `auth.ts` (NO .service suffix)
- Exception: Base services use `.service.ts` suffix (api.service.ts, user-api.service.ts)
- Guards: `auth-guard.ts` (WITH dash-suffix)
- Interceptors: `auth-interceptor.ts` (WITH dash-suffix)
- Models: `user.ts` (NO .model suffix)

## API Services

### Base ApiService (`api.service.ts`)

The `ApiService` is a base class that provides centralized HTTP handling with:

- ✅ Automatic retry logic for failed requests
- ✅ Exponential backoff strategy
- ✅ Timeout handling
- ✅ Error transformation
- ✅ Base URL configuration from environment

**Do not inject ApiService directly.** Instead, extend it for domain-specific services.

### Creating Domain-Specific API Services

Extend `ApiService` to create specialized services for different domains (users, products, orders, etc.):

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProductApiService extends ApiService {
  getProducts(): Observable<Product[]> {
    return this.get<Product[]>('/products');
  }

  getProductById(id: string): Observable<Product> {
    return this.get<Product>(`/products/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.post<Product>('/products', product);
  }
}
```

### Usage in Components

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { UserApiService } from '@core/services/user-api.service';

@Component({...})
export class UserListComponent implements OnInit {
  private userApi = inject(UserApiService);
  users$ = signal<User[]>([]);

  ngOnInit() {
    this.userApi.getUsers().subscribe({
      next: (users) => this.users$.set(users),
      error: (err) => console.error('Failed to fetch users', err)
    });
  }
}
```

### Request Options

Customize API requests with options:

```typescript
// Custom retry behavior
this.get<Data>('/endpoint', {
  retryAttempts: 5,
  retryDelay: 2000,
});

// Custom headers
this.get<Data>('/endpoint', {
  headers: {
    'X-Custom-Header': 'value',
  },
});

// Query parameters
this.get<Data>('/endpoint', {
  params: {
    page: 1,
    limit: 10,
    filter: 'active',
  },
});
```

### Example Services

- **`auth.ts`** - Authentication service (extends ApiService)
  - Handles login/register with fallback to mock data
  - Makes POST requests to `/auth/login` and `/auth/register`
- **`user-api.service.ts`** - Example user API service
  - CRUD operations for users
  - Demonstrates best practices for extending ApiService
  - Shows various request patterns (GET, POST, PUT, PATCH, DELETE)

## Authentication Flow

1. User submits credentials → `Auth.login()`
2. `Auth` extends `ApiService` → POST to `/auth/login`
3. If API unavailable → Falls back to mock authentication
4. Response stored → JWT token + user data
5. `authInterceptor` adds token to subsequent requests
6. `errorInterceptor` handles 401/403 errors
