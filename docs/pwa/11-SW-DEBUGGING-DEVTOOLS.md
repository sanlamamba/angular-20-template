# 11 - Service Worker Debugging and DevTools in Angular PWA

---

## Table of Contents
1. Introduction
2. Chrome DevTools: Service Worker Panel
3. Inspecting Cache Storage
4. Simulating Offline and Network Conditions
5. Debugging ngsw-config.json
6. Common Issues and Solutions
7. Useful CLI Commands
8. Logging and Diagnostics
9. Best Practices
10. Further Reading

---

## 1. Introduction
Debugging service workers and caching can be tricky. Angular and modern browsers provide powerful tools to inspect, debug, and troubleshoot your PWA's service worker and cache behavior.

## 2. Chrome DevTools: Service Worker Panel
- Open DevTools > Application > Service Workers
- See registration status, scope, script URL, and lifecycle events
- Force update, unregister, or stop the service worker
- Check for errors in the console

## 3. Inspecting Cache Storage
- DevTools > Application > Cache Storage
- Inspect `ngsw:xxx` caches (e.g., `ngsw:assets`, `ngsw:data:api`)
- View cached files, delete entries, or clear entire caches

## 4. Simulating Offline and Network Conditions
- DevTools > Network > Throttling > Offline/Slow 3G
- Test app behavior when offline or on slow networks
- Verify offline fallback and cache strategies

## 5. Debugging ngsw-config.json
- Use `ngsw-config.json` debug options for verbose logging
- Check for typos, invalid patterns, or missing resources
- Rebuild the app after changing `ngsw-config.json`
- Use `ngsw.json` (in `dist/`) to verify generated config

## 6. Common Issues and Solutions
| Issue                        | Solution                                      |
|------------------------------|-----------------------------------------------|
| SW not registering           | Check HTTPS, correct file paths, prod build   |
| Updates not detected         | Clear cache, unregister SW, hard reload       |
| Assets not cached            | Check `ngsw-config.json` patterns             |
| API not cached/offline       | Check `dataGroups` config, CORS issues        |
| Stale content                | Use update notifications, prompt user         |

## 7. Useful CLI Commands
- `ng build --configuration production` : Builds with SW enabled
- `ng serve` : No SW (dev mode)
- `npx http-server dist/your-app` : Test SW locally
- `ngsw:unregister` : Unregisters SW (Angular CLI)

## 8. Logging and Diagnostics
- Add `console.log` in your app's SW event handlers (not in `ngsw-worker.js`)
- Use `SwUpdate` and `SwPush` services for runtime diagnostics
- Monitor network requests in DevTools > Network

## 9. Best Practices
- Always test updates and offline mode before deploying
- Use incognito mode to avoid cache pollution
- Document your caching and update strategies
- Regularly clear caches during development

## 10. Further Reading
- [Angular Service Worker Debugging](https://angular.io/guide/service-worker-debugging)
- [MDN: Service Worker Debugging](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#debugging_service_workers)
- [Google: PWA DevTools Guide](https://web.dev/devtools-pwa/)

---

**Next:**
- 12: Service Worker Communication (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
