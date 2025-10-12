# Angular 20 Template

A production-ready Angular 20 template with modern best practices, comprehensive tooling, and enterprise-grade features.

## Features

### Core Features

- ✅ **Angular 20.3** with standalone components
- ✅ **Server-Side Rendering (SSR)** with hydration
- ✅ **TypeScript Strict Mode** for maximum type safety
- ✅ **Signals** for reactive state management
- ✅ **OnPush Change Detection** for optimal performance

### UI & Styling

- 🎨 **PrimeNG 20.2** with Aura theme
- 🎨 **Tailwind CSS** for utility-first styling
- 🌓 **Dark Mode** support with theme service
- 📱 **Responsive Design** with mobile-first approach

### Authentication & Security

- 🔐 **JWT Authentication** (demo implementation)
- 🛡️ **Role-Based Access Control** (RBAC)
- 🔒 **Route Guards** (auth & role guards)
- 🔐 **HTTP Interceptors** (auth, error, loading)
- 🛡️ **Security Headers** (CSP, HSTS, X-Frame-Options)

### Developer Experience

- 🧪 **Testing Suite** with Jasmine/Karma (example tests included)
- 📝 **ESLint & Prettier** with pre-commit hooks via Husky
- 🔄 **Conventional Commits** with commitlint
- 📦 **Path Aliases** (@core, @shared, @features, @environments)
- 🎯 **Feature Flags** for environment-specific behavior
- 📚 **Comprehensive Documentation**

### Performance

- ⚡ **Lazy Loading** for all routes
- ⚡ **@defer** examples for component lazy loading
- ⚡ **PreloadAllModules** strategy
- ⚡ **OnPush** change detection everywhere
- ⚡ **Bundle optimization** with strict budgets

### Architecture & Patterns

- 🏗️ **Main App Layout** with header/sidebar/footer
- 🏗️ **Reusable Components** (empty states, error boundaries, form errors)
- 🏗️ **Base API Service** with retry logic
- 🏗️ **Meta Service** for SEO optimization
- 🏗️ **Utility Functions** for common tasks

## Quick Start

### Prerequisites

- Node.js 20.18.1 or higher (check `.nvmrc`)
- npm 10+ or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser
# Navigate to http://localhost:4200
```

### Demo Credentials

**Admin Account:**

- Email: `admin@angular.com`
- Password: `Angular2025!`

**User Account:**

- Email: `user@angular.com`
- Password: `Angular2025!`

## Available Scripts

```bash
npm start           # Start development server
npm run build       # Build for production
npm run test        # Run unit tests
npm run lint        # Lint code
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
```

## Project Structure

```
src/
├── app/
│   ├── core/                     # Singleton services, guards, interceptors
│   │   ├── guards/              # Auth & role guards
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── models/              # Core data models
│   │   └── services/            # Core services
│   │       ├── api.service.ts   # Base HTTP service with retry
│   │       ├── auth.ts          # Authentication service
│   │       ├── error-handler.ts # Global error handler
│   │       ├── loading.ts       # Loading state service
│   │       ├── meta.service.ts  # SEO meta tags
│   │       └── theme.ts         # Theme/dark mode service
│   ├── features/                # Feature modules
│   │   ├── admin/               # Admin panel
│   │   ├── auth/                # Login/Register
│   │   ├── dashboard/           # Dashboard
│   │   ├── examples/            # Example components (@defer, virtual scroll)
│   │   └── profile/             # User profile
│   ├── shared/                  # Shared components, pipes, utilities
│   │   ├── components/
│   │   │   ├── app-layout.ts    # Main app layout
│   │   │   ├── auth-layout.ts   # Auth pages layout
│   │   │   ├── empty-state.ts   # Empty state component
│   │   │   ├── error-boundary.ts # Error display component
│   │   │   └── form-error.ts    # Form validation errors
│   │   ├── pipes/               # Custom pipes
│   │   └── utils/               # Utility functions
│   ├── app.config.ts            # App configuration
│   └── app.routes.ts            # Route definitions
├── environments/                # Environment configurations
│   ├── environment.ts           # Production
│   ├── environment.development.ts # Development
│   └── environment.staging.ts   # Staging
└── assets/                      # Static assets
```

## Environment Configuration

The template includes three environments with feature flags:

### Development

- Debug tools enabled
- Longer token expiry
- Verbose console logging
- API: `http://localhost:3000`

### Staging

- Debug tools enabled for testing
- Error reporting enabled
- API: `https://api-staging.example.com`

### Production

- Debug tools disabled
- Analytics enabled
- Minimal logging
- API: `https://api.example.com`

### Feature Flags

Control features per environment in `src/environments/environment.ts`:

```typescript
features: {
  enableDebugTools: false,      // Debug buttons in auth layout
  enableRegistration: true,     // Allow new user registration
  enableSocialLogin: false,     // Social auth providers
  enableDarkMode: true,         // Theme switching
  enableAnalytics: true,        // Analytics tracking
  enableErrorReporting: true,   // Error reporting service
}
```

## Key Components

### AppLayout

Main application layout with:

- Responsive header with user menu
- Collapsible sidebar navigation
- Theme toggle
- Footer

### EmptyState

Display friendly empty states:

```html
<app-empty-state
  icon="pi pi-inbox"
  title="No items found"
  message="Create your first item to get started"
  actionLabel="Create Item"
  (action)="createItem()"
/>
```

### ErrorBoundary

Handle errors gracefully:

```html
<app-error-boundary
  title="Something went wrong"
  [message]="errorMessage"
  [showRetry]="true"
  (retry)="retryOperation()"
/>
```

### FormError

Display form validation errors:

```html
<input formControlName="email" /> <app-form-error [control]="form.controls.email" />
```

## API Service

Base HTTP service with built-in:

- Retry logic with exponential backoff
- Error transformation
- Request timeout handling
- Environment-based configuration

```typescript
@Injectable({ providedIn: 'root' })
export class UserService extends ApiService {
  getUsers() {
    return this.get<User[]>('/users');
  }

  createUser(user: User) {
    return this.post<User>('/users', user);
  }
}
```

## Testing

Example tests are included for:

- **Services** - `src/app/core/services/auth.spec.ts`
- **Guards** - `src/app/core/guards/auth-guard.spec.ts`
- **Interceptors** - `src/app/core/interceptors/auth-interceptor.spec.ts`
- **Components** - `src/app/features/dashboard/dashboard.spec.ts`

Run tests:

```bash
npm test
```

## Documentation

- **Architecture** - `docs/ARCHITECTURE.md`
- **Changelog** - `CHANGELOG.md`
- **Code Guide** - `.claude/CLAUDE.md`

## Security

### Production Checklist

- [ ] Replace demo auth with real backend
- [ ] Use HttpOnly cookies for tokens (not sessionStorage)
- [ ] Implement server-side token validation
- [ ] Update CSP headers in `src/server.ts`
- [ ] Enable HTTPS only
- [ ] Set up proper CORS configuration
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Enable audit logging

### Security Headers

The template includes production-ready security headers:

- Content Security Policy (CSP)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Strict-Transport-Security (HTTPS enforcement)
- Referrer-Policy
- Permissions-Policy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Run linting before committing
4. Use conventional commits
5. Update documentation

## License

MIT

## Resources

- [Angular Documentation](https://angular.dev)
- [PrimeNG Documentation](https://primeng.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

Built with ❤️ using Angular 20
