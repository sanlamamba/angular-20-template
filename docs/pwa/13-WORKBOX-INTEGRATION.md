# 13 - Workbox Integration in Angular PWA

---

## Table of Contents
1. What is Workbox?
2. Why Use Workbox with Angular?
3. Workbox vs Angular Service Worker
4. When to Use Workbox
5. Setting Up Workbox in Angular
6. Example: Custom Workbox Service Worker
7. Advanced Workbox Features
8. Debugging Workbox
9. Migration and Coexistence
10. Further Reading

---

## 1. What is Workbox?
[Workbox](https://developer.chrome.com/docs/workbox/) is a set of libraries and tools from Google for building powerful, production-ready service workers. It provides high-level APIs for caching, routing, background sync, and more.

## 2. Why Use Workbox with Angular?
- More control over caching and runtime logic
- Advanced features (background sync, custom strategies)
- Easier to write custom service workers
- Useful for apps with complex offline needs

## 3. Workbox vs Angular Service Worker
| Feature                | Angular SW         | Workbox           |
|------------------------|--------------------|-------------------|
| Config-driven          | Yes (ngsw-config)  | No (code-based)   |
| Custom logic           | Limited            | Full JS           |
| Background sync        | No                 | Yes               |
| Push notifications     | Yes                | Yes               |
| Easy integration       | Yes                | Manual            |

## 4. When to Use Workbox
- You need features not supported by Angular's SW (e.g., background sync)
- You want to write custom caching logic
- You need to integrate with other JS libraries in the SW

## 5. Setting Up Workbox in Angular
1. **Install Workbox:**
   ```sh
   npm install workbox-cli --save-dev
   ```
2. **Generate a Workbox SW:**
   ```sh
   npx workbox wizard
   ```
3. **Configure output to `dist/` folder.**
4. **Update `angular.json` to copy Workbox files on build.**
5. **Register the Workbox SW in your app:**
   ```typescript
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/workbox-sw.js');
   }
   ```

## 6. Example: Custom Workbox Service Worker
```js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({ cacheName: 'api-cache' })
);
```

## 7. Advanced Workbox Features
- Background sync
- Broadcast update
- Expiration and cacheable response plugins
- Custom routing and fallback

## 8. Debugging Workbox
- Use `workbox` logs in DevTools console
- Inspect caches in Application > Cache Storage
- Use `workbox-window` for app-to-SW communication

## 9. Migration and Coexistence
- You can use Workbox and Angular SW together, but only one can control a given scope at a time
- Migrate gradually by disabling Angular SW and enabling Workbox

## 10. Further Reading
- [Workbox Docs](https://developer.chrome.com/docs/workbox/)
- [Angular PWA Guide](https://angular.io/guide/service-worker-intro)
- [Workbox Recipes](https://developer.chrome.com/docs/workbox/recipes/)

---

**Next:**
- 14: Offline Experience Patterns (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
