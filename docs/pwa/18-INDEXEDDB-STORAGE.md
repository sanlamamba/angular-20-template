# 18 - IndexedDB & Client-Side Storage in Angular PWA

---

## Table of Contents
1. Introduction to Client-Side Storage
2. Why Use IndexedDB in PWAs?
3. IndexedDB vs LocalStorage vs SessionStorage
4. IndexedDB Concepts and API
5. Using IndexedDB in Angular
6. Popular Libraries: idb, ngx-indexed-db
7. Example: Storing and Syncing Data Offline
8. Integrating IndexedDB with Service Worker
9. Debugging IndexedDB
10. Best Practices
11. Further Reading

---

## 1. Introduction to Client-Side Storage
Client-side storage allows your PWA to persist data locally, enabling offline access, caching, and background sync. The most robust option for complex data is IndexedDB.

## 2. Why Use IndexedDB in PWAs?
- Store large amounts of structured data
- Enable offline CRUD operations
- Queue actions for background sync
- Cache API responses for performance

## 3. IndexedDB vs LocalStorage vs SessionStorage
| Feature         | IndexedDB   | LocalStorage | SessionStorage |
|-----------------|-------------|--------------|---------------|
| Capacity        | ~50MB+      | 5MB          | 5MB           |
| Data structure  | Objects     | Strings      | Strings       |
| Async API       | Yes         | No           | No            |
| Binary support  | Yes         | No           | No            |
| Use case        | Complex/offline | Simple key-value | Per-session |

## 4. IndexedDB Concepts and API
- **Database**: Named DB with versioning
- **Object store**: Like a table in SQL
- **Transaction**: All reads/writes are transactional
- **Index**: For fast lookups
- **API**: Asynchronous, event/callback-based (or promise-based with wrappers)

## 5. Using IndexedDB in Angular
You can use the native API or a library for easier usage.

### 5.1. Native IndexedDB API

**Basic setup:**
```typescript
// src/app/core/services/indexed-db.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private dbName = 'my-app-db';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async openDatabase(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('name', 'name', { unique: false });
        }

        if (!db.objectStoreNames.contains('posts')) {
          const postStore = db.createObjectStore('posts', { 
            keyPath: 'id' 
          });
          postStore.createIndex('userId', 'userId', { unique: false });
          postStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('offline-queue')) {
          db.createObjectStore('offline-queue', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
        }
      };
    });
  }

  async add(storeName: string, data: any): Promise<any> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName: string, key: IDBValidKey): Promise<any> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName: string): Promise<any[]> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName: string, data: any): Promise<any> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async queryByIndex(
    storeName: string, 
    indexName: string, 
    value: IDBValidKey
  ): Promise<any[]> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async count(storeName: string): Promise<number> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
```

### 5.2. Real-world Usage Examples

**Example 1: User Data Management**
```typescript
// src/app/features/profile/profile.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { IndexedDBService } from '@core/services/indexed-db.service';

interface User {
  id?: number;
  name: string;
  email: string;
  avatar?: string;
  lastSync?: Date;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private db = inject(IndexedDBService);
  currentUser = signal<User | null>(null);

  async saveUser(user: User): Promise<void> {
    user.lastSync = new Date();
    
    if (user.id) {
      await this.db.update('users', user);
    } else {
      const id = await this.db.add('users', user);
      user.id = id as number;
    }
    
    this.currentUser.set(user);
  }

  async loadUser(id: number): Promise<User | null> {
    const user = await this.db.get('users', id);
    this.currentUser.set(user || null);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.getAll('users');
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.db.queryByIndex('users', 'email', email);
    return users[0] || null;
  }

  async deleteUser(id: number): Promise<void> {
    await this.db.delete('users', id);
    if (this.currentUser()?.id === id) {
      this.currentUser.set(null);
    }
  }
}
```

**Example 2: Offline Queue for API Requests**
```typescript
// src/app/core/services/offline-queue.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IndexedDBService } from './indexed-db.service';

interface QueuedRequest {
  id?: number;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retries: number;
}

@Injectable({ providedIn: 'root' })
export class OfflineQueueService {
  private db = inject(IndexedDBService);
  private http = inject(HttpClient);
  private processing = false;

  constructor() {
    // Listen for online event to process queue
    window.addEventListener('online', () => this.processQueue());
  }

  async queueRequest(
    url: string, 
    method: QueuedRequest['method'], 
    body?: any
  ): Promise<void> {
    const request: QueuedRequest = {
      url,
      method,
      body,
      timestamp: Date.now(),
      retries: 0
    };

    await this.db.add('offline-queue', request);
    console.log('📥 Request queued for offline sync');

    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    try {
      const queue = await this.db.getAll('offline-queue') as QueuedRequest[];
      console.log(`📤 Processing ${queue.length} queued requests...`);

      for (const request of queue) {
        try {
          await this.executeRequest(request);
          await this.db.delete('offline-queue', request.id!);
          console.log(`✅ Request completed: ${request.method} ${request.url}`);
        } catch (error) {
          request.retries++;
          
          if (request.retries >= 3) {
            console.error(`❌ Request failed after 3 retries, removing from queue`);
            await this.db.delete('offline-queue', request.id!);
          } else {
            console.warn(`⚠️ Request failed, will retry (${request.retries}/3)`);
            await this.db.update('offline-queue', request);
          }
        }
      }
    } finally {
      this.processing = false;
    }
  }

  private async executeRequest(request: QueuedRequest): Promise<any> {
    const options = {
      headers: request.headers || {}
    };

    switch (request.method) {
      case 'GET':
        return this.http.get(request.url, options).toPromise();
      case 'POST':
        return this.http.post(request.url, request.body, options).toPromise();
      case 'PUT':
        return this.http.put(request.url, request.body, options).toPromise();
      case 'DELETE':
        return this.http.delete(request.url, options).toPromise();
    }
  }

  async getQueueLength(): Promise<number> {
    return await this.db.count('offline-queue');
  }

  async clearQueue(): Promise<void> {
    await this.db.clear('offline-queue');
  }
}
```

## 6. Popular Libraries: idb, ngx-indexed-db

### 6.1. idb Library (Recommended)
[idb](https://github.com/jakearchibald/idb) is a tiny Promise-based wrapper for IndexedDB.

**Installation:**
```bash
npm install idb
```

**Basic Setup:**
```typescript
// src/app/core/services/idb.service.ts
import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MyDB extends DBSchema {
  'users': {
    key: number;
    value: {
      id?: number;
      name: string;
      email: string;
      createdAt: Date;
    };
    indexes: { 'by-email': string };
  };
  'posts': {
    key: number;
    value: {
      id?: number;
      title: string;
      content: string;
      userId: number;
      createdAt: Date;
    };
    indexes: { 'by-user': number; 'by-date': Date };
  };
  'settings': {
    key: string;
    value: any;
  };
}

@Injectable({ providedIn: 'root' })
export class IDBService {
  private db: IDBPDatabase<MyDB> | null = null;

  async getDB(): Promise<IDBPDatabase<MyDB>> {
    if (this.db) return this.db;

    this.db = await openDB<MyDB>('my-app-db', 1, {
      upgrade(db) {
        // Create users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', {
            keyPath: 'id',
            autoIncrement: true
          });
          userStore.createIndex('by-email', 'email', { unique: true });
        }

        // Create posts store
        if (!db.objectStoreNames.contains('posts')) {
          const postStore = db.createObjectStore('posts', {
            keyPath: 'id',
            autoIncrement: true
          });
          postStore.createIndex('by-user', 'userId');
          postStore.createIndex('by-date', 'createdAt');
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      }
    });

    return this.db;
  }

  // User operations
  async addUser(user: Omit<MyDB['users']['value'], 'id'>) {
    const db = await this.getDB();
    return await db.add('users', { ...user, createdAt: new Date() });
  }

  async getUser(id: number) {
    const db = await this.getDB();
    return await db.get('users', id);
  }

  async getAllUsers() {
    const db = await this.getDB();
    return await db.getAll('users');
  }

  async getUserByEmail(email: string) {
    const db = await this.getDB();
    return await db.getFromIndex('users', 'by-email', email);
  }

  async updateUser(user: MyDB['users']['value']) {
    const db = await this.getDB();
    return await db.put('users', user);
  }

  async deleteUser(id: number) {
    const db = await this.getDB();
    return await db.delete('users', id);
  }

  // Post operations
  async addPost(post: Omit<MyDB['posts']['value'], 'id'>) {
    const db = await this.getDB();
    return await db.add('posts', { ...post, createdAt: new Date() });
  }

  async getPostsByUser(userId: number) {
    const db = await this.getDB();
    return await db.getAllFromIndex('posts', 'by-user', userId);
  }

  async getRecentPosts(limit = 10) {
    const db = await this.getDB();
    const tx = db.transaction('posts', 'readonly');
    const index = tx.store.index('by-date');
    
    let cursor = await index.openCursor(null, 'prev');
    const posts = [];
    
    while (cursor && posts.length < limit) {
      posts.push(cursor.value);
      cursor = await cursor.continue();
    }
    
    await tx.done;
    return posts;
  }

  // Settings operations
  async getSetting(key: string) {
    const db = await this.getDB();
    return await db.get('settings', key);
  }

  async setSetting(key: string, value: any) {
    const db = await this.getDB();
    return await db.put('settings', value, key);
  }

  async deleteSetting(key: string) {
    const db = await this.getDB();
    return await db.delete('settings', key);
  }

  // Bulk operations
  async bulkAddUsers(users: Array<Omit<MyDB['users']['value'], 'id'>>) {
    const db = await this.getDB();
    const tx = db.transaction('users', 'readwrite');
    
    await Promise.all(
      users.map(user => tx.store.add({ ...user, createdAt: new Date() }))
    );
    
    await tx.done;
  }

  async clearAllData() {
    const db = await this.getDB();
    await db.clear('users');
    await db.clear('posts');
    await db.clear('settings');
  }

  // Advanced: Cursor-based pagination
  async getUsersPaginated(page = 1, pageSize = 10) {
    const db = await this.getDB();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    
    const skipCount = (page - 1) * pageSize;
    let cursor = await store.openCursor();
    const users = [];

    // Skip to the right position
    if (skipCount > 0 && cursor) {
      cursor = await cursor.advance(skipCount);
    }

    // Collect page data
    while (cursor && users.length < pageSize) {
      users.push(cursor.value);
      cursor = await cursor.continue();
    }

    await tx.done;
    
    const total = await store.count();
    
    return {
      data: users,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    };
  }
}
```

**Usage in Components:**
```typescript
// src/app/features/users/users.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { IDBService } from '@core/services/idb.service';

@Component({
  selector: 'app-users',
  standalone: true,
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Users</h1>
      
      <button 
        (click)="loadUsers()" 
        class="px-4 py-2 bg-blue-500 text-white rounded">
        Load Users
      </button>

      <div class="mt-4">
        @for (user of users(); track user.id) {
          <div class="p-3 border rounded mb-2">
            <p class="font-bold">{{ user.name }}</p>
            <p class="text-gray-600">{{ user.email }}</p>
            <button 
              (click)="deleteUser(user.id!)"
              class="text-red-500 text-sm mt-2">
              Delete
            </button>
          </div>
        }
      </div>

      <div class="mt-4">
        <input 
          #nameInput 
          placeholder="Name" 
          class="border p-2 mr-2">
        <input 
          #emailInput 
          placeholder="Email" 
          class="border p-2 mr-2">
        <button 
          (click)="addUser(nameInput.value, emailInput.value)"
          class="px-4 py-2 bg-green-500 text-white rounded">
          Add User
        </button>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  private idb = inject(IDBService);
  users = signal<any[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    const users = await this.idb.getAllUsers();
    this.users.set(users);
  }

  async addUser(name: string, email: string) {
    if (!name || !email) return;
    
    await this.idb.addUser({ name, email });
    await this.loadUsers();
  }

  async deleteUser(id: number) {
    await this.idb.deleteUser(id);
    await this.loadUsers();
  }
}
```

### 6.2. ngx-indexed-db Library

**Installation:**
```bash
npm install ngx-indexed-db
```

**Setup:**
```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideNgxIndexedDB, DBConfig } from 'ngx-indexed-db';

const dbConfig: DBConfig = {
  name: 'MyAppDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'users',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: true } }
      ]
    },
    {
      store: 'posts',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'userId', keypath: 'userId', options: { unique: false } }
      ]
    }
  ]
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxIndexedDB(dbConfig),
    // ... other providers
  ]
};
```

**Service:**
```typescript
// src/app/core/services/ngx-db.service.ts
import { Injectable, inject } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NgxDBService {
  private dbService = inject(NgxIndexedDBService);

  addUser(user: any): Observable<any> {
    return this.dbService.add('users', user);
  }

  getUser(id: number): Observable<any> {
    return this.dbService.getByKey('users', id);
  }

  getAllUsers(): Observable<any[]> {
    return this.dbService.getAll('users');
  }

  updateUser(user: any): Observable<any> {
    return this.dbService.update('users', user);
  }

  deleteUser(id: number): Observable<any> {
    return this.dbService.delete('users', id);
  }

  clearUsers(): Observable<boolean> {
    return this.dbService.clear('users');
  }
}
```

## 7. Example: Storing and Syncing Data Offline
- Store user actions (e.g., form submissions) in IndexedDB when offline
- On reconnect, read from IndexedDB and sync to server
- Clear synced items after successful upload

## 8. Integrating IndexedDB with Service Worker
- Service worker can access IndexedDB for caching, queuing, and background sync
- Use Workbox or custom SW for advanced patterns

## 9. Debugging IndexedDB
- DevTools > Application > IndexedDB
- Inspect databases, object stores, and records
- Clear or edit data for testing

## 10. Best Practices
- Use IndexedDB for all offline/queued data
- Handle version upgrades gracefully
- Clean up old/unused data
- Encrypt sensitive data if needed

## 11. Further Reading
- [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [idb Library](https://github.com/jakearchibald/idb)
- [Angular PWA Data Storage](https://angular.io/guide/service-worker-communications#storing-data)

---

**Next:**
- 19: Cache Storage API (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
