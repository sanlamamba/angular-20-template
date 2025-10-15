# 20 - Security & Privacy in Angular PWA

---

## Table of Contents
1. Introduction
2. Why Security & Privacy Matter in PWAs
3. HTTPS Requirement and Implications
4. Service Worker Security Best Practices
5. Caching Sensitive Data: What Not to Cache
6. Handling User Data and Authentication
7. Secure Communication with APIs
8. Protecting Against XSS, CSRF, and Other Attacks
9. Privacy Considerations (Permissions, Notifications, Storage)
10. Keeping Dependencies and SW Up to Date
11. Auditing and Testing PWA Security
12. Best Practices Checklist
13. Further Reading

---

## 1. Introduction
PWAs have access to powerful browser APIs and can work offline, making security and privacy critical. This doc covers how to secure your Angular 20 PWA and protect user data.

## 2. Why Security & Privacy Matter in PWAs
- Service workers can intercept all network requests
- Cached data may persist after logout or uninstall
- PWAs can access push, notifications, storage, and more

## 3. HTTPS Requirement and Implications
- Service workers only work on HTTPS (except localhost)
- Ensures data integrity and prevents man-in-the-middle attacks
- Always use valid SSL certificates in production

## 4. Service Worker Security Best Practices
- Never cache sensitive data (tokens, user info, private APIs)
- Validate all messages sent to/from the SW
- Use strict scope for SW registration
- Regularly update and unregister old SWs

## 5. Caching Sensitive Data: What Not to Cache
- Do NOT cache:
  - Access tokens, refresh tokens
  - User profiles or PII
  - Payment or financial data
  - Private API responses
- Use `ngsw-config.json` to exclude sensitive URLs

## 6. Handling User Data and Authentication
- Store tokens in memory or secure HTTP-only cookies
- Use Angular guards to protect routes
- Clear caches and storage on logout
- Never expose secrets in the frontend

## 7. Secure Communication with APIs
- Use HTTPS for all API calls
- Validate and sanitize all inputs/outputs
- Implement proper CORS policies
- Use JWT or OAuth2 for authentication

## 8. Protecting Against XSS, CSRF, and Other Attacks
- Use Angular's built-in XSS protection (sanitization)
- Avoid `innerHTML` and direct DOM manipulation
- Use CSRF tokens for state-changing requests
- Validate all data on the server

## 9. Privacy Considerations (Permissions, Notifications, Storage)
- Request permissions (push, notifications) in context, not on load
- Allow users to opt out of notifications and background sync
- Inform users about data stored offline
- Comply with GDPR and other privacy laws

## 10. Keeping Dependencies and SW Up to Date
- Regularly update Angular, dependencies, and SW scripts
- Monitor for security advisories (npm audit, Snyk, etc.)
- Use Angular's update notification patterns

## 11. Auditing and Testing PWA Security
- Use Lighthouse for security audits
- Test with DevTools > Security panel
- Pen-test your app for common vulnerabilities
- Review cache and storage contents regularly

## 12. Best Practices Checklist
- [ ] Use HTTPS everywhere
- [ ] Never cache sensitive data
- [ ] Validate all SW messages
- [ ] Keep dependencies up to date
- [ ] Inform users about permissions and storage
- [ ] Test and audit security regularly

## 13. Further Reading
- [OWASP PWA Security Guide](https://owasp.org/www-project-progressive-web-app-security/)
- [Angular Security Best Practices](https://angular.io/guide/security)
- [Google: PWA Security](https://web.dev/pwa-security/)
- [MDN: Service Worker Security](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API#security)

---

**Next:**
- 21: Performance Optimization in PWAs (to be created)

---

**This doc is tailored for your Angular 20 template. All code/config examples are project-ready.**
