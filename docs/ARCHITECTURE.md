# Architecture Documentation

## Overview

This Angular 20 template follows a modular architecture with clear separation of concerns.

## Project Structure

```
src/
├── app/
│   ├── core/                 # Singleton services, guards, interceptors
│   │   ├── guards/          # Route guards (auth, role)
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # Core data models
│   │   └── services/        # Core services (auth, theme, etc.)
│   ├── features/            # Feature modules (dashboard, admin, etc.)
│   ├── shared/              # Shared components, pipes, utilities
│   │   ├── components/      # Reusable UI components
│   │   ├── pipes/           # Custom pipes
│   │   └── utils/           # Utility functions
│   ├── app.ts               # Root component
│   ├── app.config.ts        # Application configuration
│   └── app.routes.ts        # Route definitions
├── environments/            # Environment configurations
└── assets/                  # Static assets

```

## Key Design Decisions

### 1. Standalone Components

All components use the standalone API (Angular 14+). No NgModules.

**Why?**

- Simpler mental model
- Better tree-shaking
- Easier lazy loading
- Future-proof (Angular's direction)

### 2. Signals for State Management

Using Angular Signals instead of RxJS for component state.

**Why?**

- Simpler API
- Better performance (fine-grained reactivity)
- Less boilerplate
- Native to Angular

**When to use RxJS?**

- HTTP requests
- Complex async operations
- Event streams

### 3. OnPush Change Detection

All components use `ChangeDetectionStrategy.OnPush`.

**Why?**

- Better performance
- Predictable updates
- Works perfectly with Signals
- Encourages immutable patterns

### 4. Functional Guards & Interceptors

Using functional approach instead of class-based.

**Why?**

- Less boilerplate
- Easier to test
- Better tree-shaking
- Angular's recommended approach

### 5. Path Aliases

Using path aliases (@core, @shared, @features) for cleaner imports.

**Benefits:**

- Avoids relative path hell (../../../../)
- Easier refactoring
- More readable code

## Core Concepts

### Authentication Flow

```
┌─────────┐      ┌──────────┐      ┌────────────┐
│  Login  │─────▶│   Auth   │─────▶│  Storage   │
│  Page   │      │ Service  │      │ (Session)  │
└─────────┘      └──────────┘      └────────────┘
                      │
                      ├──────▶ Token Generation
                      ├──────▶ User State (Signal)
                      └──────▶ Route Guards
```

### HTTP Request Flow

```
┌──────────┐      ┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│Component │─────▶│ API Service │─────▶│  ApiService  │─────▶│Interceptors │
│          │      │  (Domain)   │      │    (Base)    │      │             │
└──────────┘      └─────────────┘      └──────────────┘      └─────────────┘
                         │                     │                      │
                         │                     │                      ├─ Auth Token
                         │                     ├─ Retry Logic         ├─ Error Handling
                         │                     ├─ Error Transform     └─ Loading State
                         │                     └─ Base URL
                         │
                    (UserApiService,
                     ProductApiService,
                     OrderApiService, etc.)
```

**Flow:**

1. Component injects domain-specific API service (e.g., `UserApiService`)
2. Domain service extends `ApiService` base class
3. `ApiService` handles retry logic, error transformation, base URL
4. HTTP interceptors add authentication, handle errors, show loading states
5. Response flows back through the chain to component

### Component Communication

1. **Parent → Child**: Use `input()` function
2. **Child → Parent**: Use `output()` function
3. **Global State**: Use services with signals
4. **Cross-component**: Use shared services

## Best Practices

### Component Structure

```typescript
@Component({
  selector: 'app-example',
  imports: [
    /* dependencies */
  ],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example {
  // 1. Inputs
  data = input<Data>();

  // 2. Outputs
  action = output<void>();

  // 3. Signals
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  // 4. Services
  private service = inject(MyService);

  // 5. Methods
  handleClick() {
    this.count.update((n) => n + 1);
  }
}
```

### Service Structure

```typescript
// Base API Service (extend for domain-specific services)
@Injectable({ providedIn: 'root' })
export class ProductApiService extends ApiService {
  getProducts(): Observable<Product[]> {
    return this.get<Product[]>('/products');
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.post<Product>('/products', product);
  }
}

// Regular Service (for app state/logic)
@Injectable({ providedIn: 'root' })
export class MyService {
  // Private signals
  private dataSignal = signal<Data[]>([]);

  // Public readonly signals
  readonly data = this.dataSignal.asReadonly();

  // Computed values
  readonly count = computed(() => this.dataSignal().length);

  // Methods
  updateData(newData: Data[]) {
    this.dataSignal.set(newData);
  }
}
```

### API Service Pattern

**BaseApiService** (`api.service.ts`)

- Provides HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Automatic retry logic with exponential backoff
- Error transformation and handling
- Base URL configuration from environment
- **Never inject directly** - always extend for domain-specific services

**Domain-Specific Services** (extend `ApiService`)

- `UserApiService` - User CRUD operations
- `ProductApiService` - Product management
- `OrderApiService` - Order handling
- `Auth` - Authentication (extends ApiService)

**Example Usage:**

```typescript
// 1. Create domain service
@Injectable({ providedIn: 'root' })
export class UserApiService extends ApiService {
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  getUserById(id: string): Observable<User> {
    return this.get<User>(`/users/${id}`);
  }
}

// 2. Use in component
@Component({...})
export class UserList {
  private userApi = inject(UserApiService);
  users = signal<User[]>([]);

  ngOnInit() {
    this.userApi.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (err) => console.error(err)
    });
  }
}
```

**Request Options:**

```typescript
// Custom retry behavior
this.get<Data>('/endpoint', {
  retryAttempts: 5,
  retryDelay: 2000,
});

// Custom headers
this.get<Data>('/endpoint', {
  headers: { 'X-Custom': 'value' },
});

// Query parameters
this.get<Data>('/search', {
  params: { q: 'angular', limit: 10 },
});
```

## Performance Optimizations

### 1. Lazy Loading

All routes are lazy-loaded using dynamic imports:

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./dashboard').then(m => m.Dashboard)
}
```

### 2. @defer Blocks

Use `@defer` for non-critical content:

```typescript
@defer (on viewport) {
  <heavy-component />
} @placeholder {
  <loading-skeleton />
}
```

### 3. OnPush Strategy

Reduces change detection cycles by 90%+.

### 4. Signals

Fine-grained reactivity updates only what changed.

## Testing Strategy

### Unit Tests

- Services: Test business logic
- Components: Test user interactions
- Guards: Test navigation logic
- Interceptors: Test HTTP modifications

### Example:

```typescript
it('should login successfully', async () => {
  const response = await auth.login('user@example.com', 'password');
  expect(auth.isAuthenticated()).toBeTrue();
});
```

## Security

### Authentication

- JWT tokens (demo uses fake JWT)
- Token stored in sessionStorage (use HttpOnly cookies in production)
- Automatic token expiry handling

### Authorization

- Route guards for protected pages
- Role-based access control
- Server-side validation required in production

### HTTP Security

- CORS configuration
- CSP headers
- HTTPS only in production
- Input sanitization

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Configuration

- development: Local development
- staging: Pre-production testing
- production: Live environment

Each environment has:

- Different API URLs
- Feature flags
- Logging levels
- SEO settings

## Future Enhancements

Consider adding:

- E2E tests with Playwright
- Storybook for component documentation
- Progressive Web App (PWA) features
- Performance monitoring
- Error tracking (Sentry)
- Analytics integration

## Contributing

When adding new features:

1. Follow the existing structure
2. Add tests
3. Update this documentation
4. Follow Angular style guide
5. Use conventional commits
