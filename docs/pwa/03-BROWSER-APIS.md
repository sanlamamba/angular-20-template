# 🌐 Browser APIs for PWA - Complete Reference

**Estimated Time:** 60 minutes  
**Difficulty:** ⭐⭐ Intermediate  
**Prerequisites:** [01-PWA-OVERVIEW.md](./01-PWA-OVERVIEW.md), [02-PWA-ARCHITECTURE.md](./02-PWA-ARCHITECTURE.md)

---

## 🎯 What You'll Learn

- All major PWA browser APIs
- Service Worker API in depth
- Cache Storage API
- IndexedDB for offline data
- Notification & Push APIs
- Background Sync API
- Feature detection strategies
- Browser compatibility handling

---

## 📚 PWA Browser APIs Overview

```
┌─────────────────────────────────────────┐
│        PWA Browser APIs Stack           │
├─────────────────────────────────────────┤
│                                         │
│  🔷 Core APIs (Required)                │
│     ├─ Service Worker API               │
│     ├─ Cache Storage API                │
│     ├─ Fetch API                        │
│     └─ Promise API                      │
│                                         │
│  🔶 Storage APIs                        │
│     ├─ IndexedDB                        │
│     ├─ LocalStorage                     │
│     ├─ SessionStorage                   │
│     └─ StorageManager API               │
│                                         │
│  🔵 Engagement APIs                     │
│     ├─ Push API                         │
│     ├─ Notifications API                │
│     ├─ Background Sync API              │
│     └─ Periodic Background Sync         │
│                                         │
│  🟢 Installation APIs                   │
│     ├─ Web App Manifest                 │
│     ├─ beforeinstallprompt Event        │
│     └─ appinstalled Event               │
│                                         │
│  🟡 Device APIs                         │
│     ├─ Geolocation API                  │
│     ├─ MediaDevices API (Camera)        │
│     ├─ Web Share API                    │
│     ├─ Payment Request API              │
│     ├─ Credential Management API        │
│     └─ File System Access API           │
│                                         │
│  🟣 Network APIs                        │
│     ├─ Network Information API          │
│     ├─ Online/Offline Events            │
│     └─ Connection API                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔷 CORE APIS

### 1. **Service Worker API** ⚙️

The heart of every PWA. Runs in the background, independent of your web page.

#### **Service Worker Lifecycle**

```typescript
// Registering a Service Worker in your Angular template
// src/main.ts (or app.config.ts)

import { ApplicationConfig } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '@environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // Other providers...
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
```

#### **Service Worker Interface**

```typescript
// Type definitions for Service Worker
// (These are TypeScript types for learning)

interface ServiceWorkerRegistration {
  installing: ServiceWorker | null;
  waiting: ServiceWorker | null;
  active: ServiceWorker | null;
  
  // Update methods
  update(): Promise<void>;
  unregister(): Promise<boolean>;
  
  // Push notification methods
  pushManager: PushManager;
  
  // Background sync
  sync: SyncManager;
  
  // Events
  onupdatefound: ((this: ServiceWorkerRegistration, ev: Event) => any) | null;
}

interface ServiceWorker {
  scriptURL: string;
  state: 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';
  
  // Communication
  postMessage(message: any, transfer?: Transferable[]): void;
  
  // Events
  onstatechange: ((this: ServiceWorker, ev: Event) => any) | null;
}
```

#### **Checking Service Worker Support**

```typescript
// src/app/core/services/pwa-detector.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaDetector {
  // Feature detection signals
  readonly supportsServiceWorker = signal('serviceWorker' in navigator);
  readonly supportsCacheStorage = signal('caches' in window);
  readonly supportsNotifications = signal('Notification' in window);
  readonly supportsPushManager = signal('PushManager' in window);
  readonly supportsBackgroundSync = signal('sync' in ServiceWorkerRegistration.prototype);
  
  readonly isPWACapable = signal(
    this.supportsServiceWorker() && 
    this.supportsCacheStorage()
  );

  // Check if running as installed PWA
  readonly isInstalled = signal(
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (window.navigator as any).standalone === true // iOS
  );

  getCapabilities() {
    return {
      serviceWorker: this.supportsServiceWorker(),
      cacheStorage: this.supportsCacheStorage(),
      notifications: this.supportsNotifications(),
      pushManager: this.supportsPushManager(),
      backgroundSync: this.supportsBackgroundSync(),
      installed: this.isInstalled(),
      pwaCapable: this.isPWACapable(),
    };
  }

  logCapabilities() {
    const caps = this.getCapabilities();
    console.log('📱 PWA Capabilities:', caps);
    
    if (!caps.pwaCapable) {
      console.warn('⚠️ This browser does not fully support PWAs');
    }
  }
}

// Usage in your components:
@Component({...})
export class AppComponent {
  private pwaDetector = inject(PwaDetector);

  ngOnInit() {
    this.pwaDetector.logCapabilities();
    
    if (!this.pwaDetector.isPWACapable()) {
      console.warn('PWA features disabled - browser not supported');
    }
  }
}
```

---

### 2. **Cache Storage API** 💾

Programmatic control over caching HTTP requests and responses.

```typescript
// Cache Storage API reference

interface CacheStorage {
  // Open or create a cache
  open(cacheName: string): Promise<Cache>;
  
  // Check if cache exists
  has(cacheName: string): Promise<boolean>;
  
  // Delete a cache
  delete(cacheName: string): Promise<boolean>;
  
  // List all cache names
  keys(): Promise<string[]>;
  
  // Match a request across all caches
  match(request: Request | string, options?: CacheQueryOptions): Promise<Response | undefined>;
}

interface Cache {
  // Add requests to cache
  add(request: Request | string): Promise<void>;
  addAll(requests: Array<Request | string>): Promise<void>;
  
  // Put request/response pair
  put(request: Request | string, response: Response): Promise<void>;
  
  // Retrieve from cache
  match(request: Request | string, options?: CacheQueryOptions): Promise<Response | undefined>;
  matchAll(request?: Request | string, options?: CacheQueryOptions): Promise<Response[]>;
  
  // Delete from cache
  delete(request: Request | string, options?: CacheQueryOptions): Promise<boolean>;
  
  // List all cached requests
  keys(request?: Request | string, options?: CacheQueryOptions): Promise<Request[]>;
}
```

#### **Cache API Example**

```typescript
// src/app/core/services/cache-manager.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheManager {
  private readonly CACHE_NAME = 'angular-pwa-v1';

  async cacheAssets(urls: string[]): Promise<void> {
    if (!('caches' in window)) {
      console.warn('Cache Storage not supported');
      return;
    }

    try {
      const cache = await caches.open(this.CACHE_NAME);
      await cache.addAll(urls);
      console.log('✅ Assets cached:', urls.length);
    } catch (error) {
      console.error('❌ Failed to cache assets:', error);
    }
  }

  async getCached(url: string): Promise<Response | undefined> {
    if (!('caches' in window)) return undefined;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      return await cache.match(url);
    } catch (error) {
      console.error('❌ Failed to get from cache:', error);
      return undefined;
    }
  }

  async cacheResponse(url: string, response: Response): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      await cache.put(url, response.clone());
      console.log('✅ Cached response for:', url);
    } catch (error) {
      console.error('❌ Failed to cache response:', error);
    }
  }

  async clearCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      await caches.delete(this.CACHE_NAME);
      console.log('✅ Cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  }

  async listCaches(): Promise<string[]> {
    if (!('caches' in window)) return [];

    try {
      return await caches.keys();
    } catch (error) {
      console.error('❌ Failed to list caches:', error);
      return [];
    }
  }

  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const requests = await cache.keys();
      let totalSize = 0;

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('❌ Failed to calculate cache size:', error);
      return 0;
    }
  }
}
```

---

### 3. **Fetch API** 🌐

Modern replacement for XMLHttpRequest. Your Angular HttpClient already uses it!

```typescript
// Fetch API is already used by Angular HttpClient
// But here's how it works under the hood:

// Basic fetch
const response = await fetch('https://api.example.com/data');
const data = await response.json();

// With options
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({ name: 'value' }),
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin'
});

// Angular HttpClient wraps this beautifully:
// src/app/core/services/api.service.ts (you already have this!)
this.http.get('https://api.example.com/data'); // Uses Fetch internally!
```

---

## 🔶 STORAGE APIS

### 4. **IndexedDB** 🗄️

Low-level API for client-side storage of significant amounts of structured data.

```typescript
// IndexedDB wrapper for your Angular template
// src/app/core/services/indexed-db.service.ts

import { Injectable, signal } from '@angular/core';

export interface DBConfig {
  name: string;
  version: number;
  stores: { name: string; keyPath: string; autoIncrement?: boolean }[];
}

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private db = signal<IDBDatabase | null>(null);
  private readonly dbConfig: DBConfig = {
    name: 'angular-pwa-db',
    version: 1,
    stores: [
      { name: 'forms', keyPath: 'id', autoIncrement: true },
      { name: 'queue', keyPath: 'id', autoIncrement: true },
      { name: 'cache', keyPath: 'key' },
      { name: 'offline-data', keyPath: 'timestamp', autoIncrement: true }
    ]
  };

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        this.dbConfig.name,
        this.dbConfig.version
      );

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db.set(request.result);
        console.log('✅ IndexedDB initialized');
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        this.dbConfig.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, {
              keyPath: store.keyPath,
              autoIncrement: store.autoIncrement
            });
            console.log(`✅ Created store: ${store.name}`);
          }
        });
      };
    });
  }

  async add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    const db = this.db();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const db = this.db();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = this.db();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(storeName: string, data: T): Promise<IDBValidKey> {
    const db = this.db();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const db = this.db();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    const db = this.db();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async count(storeName: string): Promise<number> {
    const db = this.db();
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Usage example:
@Component({...})
export class OfflineFormComponent {
  private db = inject(IndexedDbService);

  async ngOnInit() {
    await this.db.init();
  }

  async saveOffline(formData: any) {
    try {
      const id = await this.db.add('forms', {
        ...formData,
        timestamp: Date.now(),
        synced: false
      });
      console.log('✅ Saved offline:', id);
    } catch (error) {
      console.error('❌ Failed to save offline:', error);
    }
  }

  async loadOfflineForms() {
    try {
      const forms = await this.db.getAll('forms');
      console.log('📦 Loaded offline forms:', forms.length);
      return forms;
    } catch (error) {
      console.error('❌ Failed to load offline forms:', error);
      return [];
    }
  }
}
```

---

### 5. **StorageManager API** 📦

Query and manage storage quota and persistence.

```typescript
// src/app/core/services/storage-quota.service.ts

@Injectable({ providedIn: 'root' })
export class StorageQuotaService {
  async getStorageEstimate(): Promise<StorageEstimate | null> {
    if (!('storage' in navigator && 'estimate' in navigator.storage)) {
      console.warn('StorageManager API not supported');
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();
      console.log('📊 Storage Estimate:', {
        usage: this.formatBytes(estimate.usage || 0),
        quota: this.formatBytes(estimate.quota || 0),
        percentage: ((estimate.usage || 0) / (estimate.quota || 1) * 100).toFixed(2) + '%'
      });
      return estimate;
    } catch (error) {
      console.error('❌ Failed to get storage estimate:', error);
      return null;
    }
  }

  async requestPersistentStorage(): Promise<boolean> {
    if (!('storage' in navigator && 'persist' in navigator.storage)) {
      console.warn('Persistent storage not supported');
      return false;
    }

    try {
      const isPersisted = await navigator.storage.persist();
      console.log(isPersisted ? '✅ Storage is persistent' : '⚠️ Storage may be cleared');
      return isPersisted;
    } catch (error) {
      console.error('❌ Failed to request persistent storage:', error);
      return false;
    }
  }

  async isPersisted(): Promise<boolean> {
    if (!('storage' in navigator && 'persisted' in navigator.storage)) {
      return false;
    }

    try {
      return await navigator.storage.persisted();
    } catch (error) {
      console.error('❌ Failed to check persistence:', error);
      return false;
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
```

---

## 🔵 ENGAGEMENT APIS

### 6. **Notifications API** 🔔

```typescript
// src/app/core/services/notification.service.ts

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private permission = signal<NotificationPermission>('default');

  constructor() {
    if ('Notification' in window) {
      this.permission.set(Notification.permission);
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission.set(permission);
      console.log('📢 Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('❌ Failed to request permission:', error);
      return 'denied';
    }
  }

  async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return;
    }

    if (this.permission() !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      new Notification(title, {
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        ...options
      });
      console.log('✅ Notification shown:', title);
    } catch (error) {
      console.error('❌ Failed to show notification:', error);
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    return this.permission();
  }
}
```

---

### 7. **Push API** 📬

```typescript
// Push API type reference (we'll implement fully later)

interface PushManager {
  subscribe(options?: PushSubscriptionOptionsInit): Promise<PushSubscription>;
  getSubscription(): Promise<PushSubscription | null>;
  permissionState(options?: PushSubscriptionOptionsInit): Promise<PushPermissionState>;
}

interface PushSubscription {
  endpoint: string;
  options: PushSubscriptionOptions;
  
  getKey(name: PushEncryptionKeyName): ArrayBuffer | null;
  toJSON(): PushSubscriptionJSON;
  unsubscribe(): Promise<boolean>;
}

// We'll implement this fully in section 5 (Push Notifications)
```

---

### 8. **Background Sync API** 🔄

```typescript
// Background Sync type reference (we'll implement fully later)

interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

// Usage will be in Service Worker:
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// We'll implement this fully in section 3 (Offline Experience)
```

---

## 🟢 INSTALLATION APIS

### 9. **beforeinstallprompt Event** 📥

```typescript
// src/app/core/services/install-prompt.service.ts

@Injectable({ providedIn: 'root' })
export class InstallPromptService {
  private deferredPrompt = signal<any>(null);
  readonly canInstall = computed(() => this.deferredPrompt() !== null);

  constructor() {
    this.listenForInstallPrompt();
  }

  private listenForInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      
      // Store the event for later use
      this.deferredPrompt.set(e);
      console.log('📥 Install prompt available');
    });

    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed');
      this.deferredPrompt.set(null);
    });
  }

  async promptInstall(): Promise<boolean> {
    const prompt = this.deferredPrompt();
    if (!prompt) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      // Show the install prompt
      prompt.prompt();
      
      // Wait for the user's response
      const result = await prompt.userChoice;
      console.log('Install prompt result:', result.outcome);
      
      // Clear the prompt
      this.deferredPrompt.set(null);
      
      return result.outcome === 'accepted';
    } catch (error) {
      console.error('❌ Failed to show install prompt:', error);
      return false;
    }
  }
}

// Usage in component:
@Component({
  selector: 'app-install-button',
  template: `
    @if (installPrompt.canInstall()) {
      <button 
        (click)="install()" 
        class="btn btn-primary">
        📥 Install App
      </button>
    }
  `
})
export class InstallButtonComponent {
  protected installPrompt = inject(InstallPromptService);

  async install() {
    const accepted = await this.installPrompt.promptInstall();
    if (accepted) {
      console.log('User accepted installation');
    }
  }
}
```

---

## 🟡 DEVICE APIS

### 10. **Network Information API** 📶

```typescript
// src/app/core/services/network-info.service.ts

@Injectable({ providedIn: 'root' })
export class NetworkInfoService {
  readonly isOnline = signal(navigator.onLine);
  readonly connectionType = signal<string>('unknown');
  readonly effectiveType = signal<string>('unknown');
  readonly downlink = signal<number>(0);
  readonly rtt = signal<number>(0);
  readonly saveData = signal<boolean>(false);

  constructor() {
    this.initializeNetworkDetection();
    this.initializeConnectionInfo();
  }

  private initializeNetworkDetection(): void {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      console.log('🌐 Back online');
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      console.log('📵 Gone offline');
    });
  }

  private initializeConnectionInfo(): void {
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    if (!connection) {
      console.warn('Network Information API not supported');
      return;
    }

    // Update connection info
    const updateConnectionInfo = () => {
      this.connectionType.set(connection.type || 'unknown');
      this.effectiveType.set(connection.effectiveType || 'unknown');
      this.downlink.set(connection.downlink || 0);
      this.rtt.set(connection.rtt || 0);
      this.saveData.set(connection.saveData || false);

      console.log('📶 Connection info:', {
        type: this.connectionType(),
        effectiveType: this.effectiveType(),
        downlink: this.downlink() + ' Mbps',
        rtt: this.rtt() + ' ms',
        saveData: this.saveData()
      });
    };

    updateConnectionInfo();
    connection.addEventListener('change', updateConnectionInfo);
  }

  isFastConnection(): boolean {
    const effectiveType = this.effectiveType();
    return effectiveType === '4g' || effectiveType === '5g';
  }

  isSlowConnection(): boolean {
    const effectiveType = this.effectiveType();
    return effectiveType === '2g' || effectiveType === 'slow-2g';
  }
}
```

---

## 📋 Complete API Reference Table

| API | Support | Your Template | Purpose |
|-----|---------|---------------|---------|
| **Service Worker** | 96% | ✅ Will add | Core PWA functionality |
| **Cache Storage** | 96% | ✅ Will add | Offline asset caching |
| **IndexedDB** | 98% | ✅ Will add | Offline data storage |
| **Fetch** | 98% | ✅ Already have | HTTP requests |
| **Notifications** | 94% | ✅ Will add | User engagement |
| **Push API** | 90% | ✅ Will add | Push notifications |
| **Background Sync** | 75% | ✅ Will add | Offline queue |
| **Periodic Sync** | 60% | ⚠️ Optional | Background updates |
| **beforeinstallprompt** | 80% | ✅ Will add | Install prompt |
| **Network Info** | 85% | ✅ Will add | Connection quality |
| **Web Share** | 85% | ⚠️ Optional | Sharing content |
| **Payment Request** | 80% | ⚠️ Optional | Payments |
| **Credential Mgmt** | 85% | ⚠️ Optional | Auth credentials |
| **Geolocation** | 98% | ⚠️ Optional | Location services |
| **MediaDevices** | 95% | ⚠️ Optional | Camera/microphone |

---

## 🎓 Key Takeaways

1. **Service Worker is the foundation** - Everything else builds on it
2. **Feature detection is critical** - Always check before using APIs
3. **Progressive enhancement** - App works even if APIs aren't available
4. **Your template is ready** - Angular provides excellent PWA support
5. **Browser support is good** - 90%+ support for core APIs

---

## 🔜 Next Steps

Continue to:

**➡️ [04-INSTALLATION-SETUP.md](./04-INSTALLATION-SETUP.md)** - Install Angular PWA and configure APIs

---

**Last Updated:** October 15, 2025  
**Next:** [04-INSTALLATION-SETUP.md](./04-INSTALLATION-SETUP.md)
