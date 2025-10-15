# 🏗️ PWA Architecture - Complete Guide

**Estimated Time:** 45 minutes  
**Difficulty:** ⭐⭐ Intermediate  
**Prerequisites:** [01-PWA-OVERVIEW.md](./01-PWA-OVERVIEW.md)

---

## 🎯 What You'll Learn

- PWA architectural patterns
- App Shell architecture
- PRPL pattern for optimal loading
- Offline-first vs Online-first strategies
- How PWA fits with your Angular 20 SSR template
- State management in PWAs
- Caching strategies overview

---

## 🏛️ PWA Architecture Patterns

### 1. **App Shell Architecture** 🐚

The **App Shell** is the minimal HTML, CSS, and JavaScript required to power your user interface.

```
┌─────────────────────────────────────────┐
│         App Shell Architecture          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       APP SHELL (cached)        │   │
│  │  ┌──────────────────────────┐  │   │
│  │  │   Header / Navigation    │  │   │
│  │  └──────────────────────────┘  │   │
│  │  ┌──────────────────────────┐  │   │
│  │  │                          │  │   │
│  │  │    DYNAMIC CONTENT       │  │   │
│  │  │    (loaded from API)     │  │   │
│  │  │                          │  │   │
│  │  └──────────────────────────┘  │   │
│  │  ┌──────────────────────────┐  │   │
│  │  │        Footer            │  │   │
│  │  └──────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

First Load: Download Shell + Content
Subsequent Loads: Shell from cache + Fresh content
```

#### **Your Angular 20 Template's App Shell**

```typescript
// src/app/shared/components/app-layout.ts
// This is already your app shell! ✅

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <!-- APP SHELL: These elements should be cached -->
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      
      <!-- Sidebar (Shell) -->
      <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <nav>
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/profile">Profile</a>
          <!-- Navigation is part of shell -->
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1">
        <!-- Header (Shell) -->
        <header class="bg-white dark:bg-gray-800 shadow">
          <h1>{{ title }}</h1>
          <!-- Theme toggle, user menu (Shell) -->
        </header>

        <!-- DYNAMIC CONTENT: Loaded fresh each time -->
        <div class="p-6">
          <ng-content />  <!-- Dashboard, Profile, etc. -->
        </div>

        <!-- Footer (Shell) -->
        <footer>
          <!-- Static footer content -->
        </footer>
      </main>
    </div>
  `
})
export class AppLayout {
  // Shell logic
}
```

#### **App Shell Best Practices**

```typescript
// What to include in your App Shell:

✅ DO include in Shell (cache aggressively):
  - Navigation components
  - Header/footer
  - Sidebar
  - App framework/layout
  - Critical CSS
  - Critical JavaScript
  - Logo and branding
  - Loading skeletons

❌ DON'T include in Shell:
  - Dynamic content (user data, posts, etc.)
  - API responses
  - User-specific data
  - Frequently changing content
  - Large media files
```

---

### 2. **PRPL Pattern** 🚀

PRPL stands for:
- **P**ush critical resources
- **R**ender initial route
- **P**re-cache remaining routes
- **L**azy-load remaining routes

```
┌─────────────────────────────────────────┐
│           PRPL Pattern Flow             │
├─────────────────────────────────────────┤
│                                         │
│  1. PUSH (< 50KB)                       │
│     ├─ App shell HTML                   │
│     ├─ Critical CSS                     │
│     └─ Main JavaScript bundle           │
│                                         │
│  2. RENDER (< 1 second)                 │
│     └─ Show initial route immediately   │
│                                         │
│  3. PRE-CACHE (background)              │
│     ├─ Other route bundles              │
│     ├─ Common assets                    │
│     └─ API responses (optional)         │
│                                         │
│  4. LAZY-LOAD (on demand)               │
│     └─ Additional features as needed    │
│                                         │
└─────────────────────────────────────────┘
```

#### **PRPL in Your Angular 20 Template**

```typescript
// Your template ALREADY uses PRPL! ✅

// 1. PUSH - Angular builds optimized bundles
// angular.json configuration handles this

// 2. RENDER - SSR renders initial route
// src/main.server.ts and src/server.ts

// 3. PRE-CACHE - Service Worker precaches routes
// ngsw-config.json (we'll configure this)

// 4. LAZY-LOAD - Routes already use lazy loading!
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard')
      .then(m => m.Dashboard), // ✅ Lazy loaded!
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile')
      .then(m => m.Profile), // ✅ Lazy loaded!
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin')
      .then(m => m.Admin), // ✅ Lazy loaded!
  }
];
```

#### **PRPL Performance Goals**

```typescript
// Target metrics for your PWA:

interface PRPLMetrics {
  push: {
    initialBundle: '< 50KB',      // Main bundle size
    criticalCSS: '< 10KB',        // Inline critical CSS
    totalTransfer: '< 100KB',     // First load total
  };
  render: {
    firstPaint: '< 1 second',     // Time to first paint
    firstContentfulPaint: '< 1.5s', // FCP
    timeToInteractive: '< 3s',    // TTI
  };
  preCache: {
    routes: 'All primary routes',  // Dashboard, Profile, etc.
    assets: 'Critical assets only', // Icons, fonts
    apiData: 'Optional',           // User profile, etc.
  };
  lazyLoad: {
    secondaryRoutes: 'On demand',  // Admin panel, etc.
    features: 'On user interaction', // Modals, dialogs
  };
}
```

---

### 3. **Offline-First vs Online-First** 🌐

#### **Offline-First Architecture**

```
┌─────────────────────────────────────────┐
│       Offline-First Flow                │
├─────────────────────────────────────────┤
│                                         │
│  User Request                           │
│       ↓                                 │
│  Check Cache First ────→ Found?         │
│       ↓                     │           │
│    Not Found                ✅ Yes      │
│       ↓                     ↓           │
│  Try Network           Return Cached    │
│       ↓                                 │
│  Success? ───→ Update Cache             │
│       ↓                                 │
│    Failed                               │
│       ↓                                 │
│  Show Offline UI                        │
│                                         │
└─────────────────────────────────────────┘

Best for: News apps, content-heavy apps, dashboards
```

```typescript
// Offline-First implementation in your template

// src/app/core/services/offline-first-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OfflineFirstApi {
  private http = inject(HttpClient);
  private cache = new Map<string, any>();

  get<T>(url: string): Observable<T> {
    // 1. Check cache first (offline-first!)
    const cached = this.cache.get(url);
    if (cached) {
      console.log('📦 Returning cached data for:', url);
      
      // Return cached data immediately
      const result = of(cached);
      
      // Update in background (stale-while-revalidate)
      this.updateInBackground<T>(url);
      
      return result;
    }

    // 2. No cache, try network
    return this.http.get<T>(url).pipe(
      tap(data => {
        console.log('🌐 Caching network response for:', url);
        this.cache.set(url, data);
      }),
      catchError(error => {
        console.error('❌ Network failed, no cache available');
        return throwError(() => new Error('Offline and no cache'));
      })
    );
  }

  private updateInBackground<T>(url: string): void {
    this.http.get<T>(url).pipe(
      tap(data => {
        console.log('🔄 Background update completed for:', url);
        this.cache.set(url, data);
      }),
      catchError(() => of(null)) // Ignore background errors
    ).subscribe();
  }
}

// Usage in your components:
@Component({
  template: `
    <div *ngIf="data()">
      {{ data().name }}
    </div>
  `
})
export class DashboardComponent {
  private api = inject(OfflineFirstApi);
  data = signal<any>(null);

  ngOnInit() {
    // Gets cached data instantly if available
    // Then updates in background
    this.api.get('/api/dashboard')
      .subscribe(data => this.data.set(data));
  }
}
```

#### **Online-First Architecture**

```
┌─────────────────────────────────────────┐
│        Online-First Flow                │
├─────────────────────────────────────────┤
│                                         │
│  User Request                           │
│       ↓                                 │
│  Try Network First                      │
│       ↓                                 │
│  Success? ───→ Update Cache             │
│       │            ↓                    │
│       │       Return Fresh Data         │
│       ↓                                 │
│    Failed                               │
│       ↓                                 │
│  Check Cache ────→ Found?               │
│       ↓               │                 │
│    Not Found          ✅ Yes            │
│       ↓               ↓                 │
│  Show Error      Return Stale           │
│                                         │
└─────────────────────────────────────────┘

Best for: Real-time apps, social media, chat
```

```typescript
// Online-First implementation in your template

// src/app/core/services/online-first-api.ts
@Injectable({ providedIn: 'root' })
export class OnlineFirstApi {
  private http = inject(HttpClient);
  private cache = new Map<string, any>();

  get<T>(url: string): Observable<T> {
    // 1. Try network first (online-first!)
    return this.http.get<T>(url).pipe(
      tap(data => {
        console.log('🌐 Fresh data from network:', url);
        this.cache.set(url, data);
      }),
      catchError(error => {
        console.warn('⚠️ Network failed, checking cache...');
        
        // 2. Fallback to cache if network fails
        const cached = this.cache.get(url);
        if (cached) {
          console.log('📦 Returning stale cached data');
          return of(cached);
        }
        
        // 3. No cache, return error
        console.error('❌ No cache available');
        return throwError(() => error);
      })
    );
  }
}
```

#### **Which Strategy for Your Template?**

```typescript
// Recommended strategy per feature:

const cachingStrategy = {
  // OFFLINE-FIRST (stale data acceptable)
  dashboard: 'offline-first',      // User stats, overview
  profile: 'offline-first',        // User profile
  settings: 'offline-first',       // App settings
  
  // ONLINE-FIRST (fresh data critical)
  auth: 'online-first',            // Login, token refresh
  transactions: 'online-first',    // Financial operations
  chat: 'online-first',            // Real-time messaging
  
  // CACHE-ONLY (static assets)
  assets: 'cache-only',            // Icons, fonts, images
  
  // NETWORK-ONLY (never cache)
  logout: 'network-only',          // Logout endpoint
  sensitive: 'network-only',       // Sensitive operations
};

// We'll implement this in ngsw-config.json later!
```

---

### 4. **State Management in PWAs** 🗄️

#### **State Layers in Your PWA**

```
┌─────────────────────────────────────────┐
│         PWA State Layers                │
├─────────────────────────────────────────┤
│                                         │
│  1. COMPONENT STATE (Angular Signals)   │
│     └─ UI state, form values            │
│                                         │
│  2. SERVICE STATE (Signals in Services) │
│     └─ Auth, theme, user preferences    │
│                                         │
│  3. CACHE STORAGE (Service Worker)      │
│     └─ API responses, static assets     │
│                                         │
│  4. INDEXEDDB (Long-term storage)       │
│     └─ Offline forms, large datasets    │
│                                         │
│  5. SESSION/LOCAL STORAGE (Key-value)   │
│     └─ Tokens, simple preferences       │
│                                         │
└─────────────────────────────────────────┘
```

#### **Your Template's State Architecture**

```typescript
// 1. COMPONENT STATE (already using Signals! ✅)
// src/app/features/dashboard/dashboard.ts
@Component({...})
export class Dashboard {
  // ✅ Already using signals for component state!
  private loading = signal(false);
  private data = signal<any>(null);
  private error = signal<string | null>(null);
}

// 2. SERVICE STATE (already using Signals! ✅)
// src/app/core/services/auth.ts
@Injectable({ providedIn: 'root' })
export class Auth {
  // ✅ Already using signals for service state!
  private currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
}

// 3. CACHE STORAGE (we'll add with Service Worker)
// Managed automatically by @angular/service-worker

// 4. INDEXEDDB (we'll add for offline forms)
// src/app/core/services/offline-storage.ts
@Injectable({ providedIn: 'root' })
export class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    const request = indexedDB.open('angular-pwa-db', 1);
    
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      
      // Create stores for different data types
      if (!db.objectStoreNames.contains('forms')) {
        db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async save(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName: string): Promise<any[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// 5. SESSION/LOCAL STORAGE (already have utilities! ✅)
// src/app/shared/utils/storage.util.ts (already exists!)
```

---

### 5. **Caching Strategies Overview** 💾

```typescript
// Quick reference for caching strategies
// (We'll implement these in detail later)

interface CachingStrategies {
  'cache-first': {
    description: 'Check cache first, fallback to network',
    useCase: 'Static assets, rarely changing data',
    example: 'Icons, fonts, app shell',
  };
  
  'network-first': {
    description: 'Try network first, fallback to cache',
    useCase: 'Frequently changing data',
    example: 'API responses, user data',
  };
  
  'cache-only': {
    description: 'Only serve from cache, never network',
    useCase: 'Precached assets',
    example: 'App version-specific resources',
  };
  
  'network-only': {
    description: 'Always fetch from network, never cache',
    useCase: 'Sensitive or real-time data',
    example: 'Auth endpoints, payments',
  };
  
  'stale-while-revalidate': {
    description: 'Serve cached, update in background',
    useCase: 'Balance speed and freshness',
    example: 'Dashboard data, user profiles',
  };
}
```

---

## 🎯 Your Template's PWA Architecture

### **Current Architecture** (Before PWA)

```
┌─────────────────────────────────────────┐
│   Angular 20 Template (Current)         │
├─────────────────────────────────────────┤
│                                         │
│  Browser Request                        │
│       ↓                                 │
│  Angular SSR Server                     │
│       ↓                                 │
│  Render HTML                            │
│       ↓                                 │
│  Send to Browser                        │
│       ↓                                 │
│  Hydrate Angular                        │
│       ↓                                 │
│  Fetch API Data                         │
│       ↓                                 │
│  Render Component                       │
│                                         │
│  ⚠️ No offline support                  │
│  ⚠️ No caching                          │
│  ⚠️ Network required                    │
│                                         │
└─────────────────────────────────────────┘
```

### **Target Architecture** (With PWA)

```
┌─────────────────────────────────────────┐
│   Angular 20 PWA Template (Target)      │
├─────────────────────────────────────────┤
│                                         │
│  Browser Request                        │
│       ↓                                 │
│  SERVICE WORKER (intercepts) ←────┐     │
│       ↓                           │     │
│  Check Cache? ──Yes──→ Serve      │     │
│       ↓                           │     │
│      No                           │     │
│       ↓                           │     │
│  Angular SSR Server ──────────────┘     │
│       ↓                                 │
│  Cache Response                         │
│       ↓                                 │
│  Hydrate Angular                        │
│       ↓                                 │
│  Check IndexedDB? ──Yes──→ Use Local    │
│       ↓                                 │
│      No                                 │
│       ↓                                 │
│  Fetch API (with offline queue)         │
│       ↓                                 │
│  Render Component                       │
│                                         │
│  ✅ Offline support                     │
│  ✅ Intelligent caching                 │
│  ✅ Background sync                     │
│  ✅ Works on all networks               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📋 Architecture Implementation Checklist

```typescript
// What we'll build in upcoming docs:

□ App Shell
  ├─ Identify shell components (AppLayout, AuthLayout)
  ├─ Configure precaching for shell
  └─ Test shell caching

□ PRPL Pattern
  ├─ Optimize bundle sizes (< 50KB initial)
  ├─ Configure route precaching
  ├─ Test lazy loading
  └─ Measure performance metrics

□ Caching Strategy
  ├─ Configure ngsw-config.json
  ├─ Implement offline-first for dashboard
  ├─ Implement online-first for auth
  └─ Test all strategies

□ State Management
  ├─ Keep using Signals (✅ already have!)
  ├─ Add IndexedDB service
  ├─ Add offline queue service
  └─ Integrate with Service Worker

□ SSR + PWA Integration
  ├─ Configure Service Worker for SSR
  ├─ Handle hydration with caching
  ├─ Test SSR + offline mode
  └─ Optimize performance
```

---

## 🎓 Key Takeaways

1. **App Shell is your foundation** - Your AppLayout is already an app shell!
2. **PRPL pattern is built-in** - Angular + lazy loading already does this
3. **Choose the right caching strategy** - Offline-first for content, online-first for auth
4. **State management with Signals** - Your template already uses best practices
5. **SSR + PWA work together** - Service Worker enhances SSR performance

---

## 🔜 Next Steps

Continue to:

**➡️ [03-BROWSER-APIS.md](./03-BROWSER-APIS.md)** - Learn PWA browser APIs

Or jump ahead:

- [04-INSTALLATION-SETUP.md](./04-INSTALLATION-SETUP.md) - Start implementing
- [08-NGSW-CONFIG-DEEP-DIVE.md](./08-NGSW-CONFIG-DEEP-DIVE.md) - Configure caching strategies

---

**Last Updated:** October 15, 2025  
**Next:** [03-BROWSER-APIS.md](./03-BROWSER-APIS.md)
