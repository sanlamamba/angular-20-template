# 21 - Performance Optimization in Angular PWA

---

## Table of Contents
1. Introduction
2. Why Performance Matters in PWAs
3. Measuring Performance (Lighthouse, Web Vitals)
4. Optimizing Bundle Size (Lazy Loading, Tree Shaking)
5. Efficient Caching Strategies
6. Image and Asset Optimization
7. Preloading and Prefetching
8. Service Worker Performance Tips
9. Runtime Performance (Change Detection, Signals, OnPush)
10. Monitoring and Profiling in Production
11. Best Practices Checklist
12. Further Reading

---

## 1. Introduction
Performance is a key pillar of a great PWA. Fast load times, smooth interactions, and efficient caching are essential for user satisfaction and engagement.

## 2. Why Performance Matters in PWAs
- Directly impacts user retention and engagement
- Affects SEO and discoverability
- Required for "App-like" experience

## 3. Measuring Performance (Lighthouse, Web Vitals)
- Use [Lighthouse](https://web.dev/measure/) for audits (PWA, performance, accessibility)
- Track [Core Web Vitals](https://web.dev/vitals/): LCP, FID, CLS
- Use Chrome DevTools > Performance panel for profiling

## 4. Optimizing Bundle Size (Lazy Loading, Tree Shaking)
- Use Angular's built-in lazy loading for routes and modules
- Remove unused dependencies and code (tree shaking)
- Use `ng build --configuration production` for minification
- Analyze bundle with `source-map-explorer` or `webpack-bundle-analyzer`

## 5. Efficient Caching Strategies
- Use `ngsw-config.json` to cache only what is needed
- Prefer `lazy` installMode for large assets
- Set appropriate cache limits (maxAge, maxSize)

## 6. Image and Asset Optimization
- Use modern formats (WebP, AVIF)
- Serve responsive images (`srcset`)
- Compress and resize images before deployment
- Use Angular's asset hashing for cache busting

## 7. Preloading and Prefetching
- Use Angular's `PreloadAllModules` for route preloading
- Use `<link rel="preload">` and `<link rel="prefetch">` for critical assets
- Preload fonts and important resources in `index.html`

## 8. Service Worker Performance Tips
- Avoid caching large or unnecessary files
- Clean up old caches regularly
- Use background sync for non-critical updates
- Monitor SW memory and CPU usage in DevTools

## 9. Runtime Performance (Change Detection, Signals, OnPush)
- Use `ChangeDetectionStrategy.OnPush` for components
- Leverage Angular Signals for fine-grained reactivity
- Avoid unnecessary DOM updates and heavy computations in templates

## 10. Monitoring and Profiling in Production
- Use [Web Vitals JS](https://github.com/GoogleChrome/web-vitals) to monitor real-user metrics
- Integrate with analytics (Google Analytics, Sentry, etc.)
- Monitor service worker events and errors

## 11. Best Practices Checklist
- [ ] Audit with Lighthouse regularly
- [ ] Lazy load routes and modules
- [ ] Optimize and compress images
- [ ] Use efficient caching strategies
- [ ] Monitor real-user performance
- [ ] Clean up old caches and data

## 12. Further Reading
- [Angular Performance Guide](https://angular.io/guide/performance)
- [Google: PWA Performance](https://web.dev/pwa-performance/)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://web.dev/lighthouse/)

---

**Next:**
- 22: Accessibility in PWAs (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
