# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Environment configuration with feature flags
- Example test suite (component, service, guard, interceptor)
- Main app layout with header/sidebar/footer
- Empty state component
- Error boundary component
- Base HTTP service with retry logic
- Form error display component
- @defer examples for lazy loading
- Virtual scrolling example
- Meta service for SEO
- Security headers in server.ts
- Comprehensive documentation

### Changed

- Updated environment files to include feature flags
- Enhanced AuthLayout with debug mode toggle

### Deprecated

- None

### Removed

- None

### Fixed

- None

### Security

- Added security headers (CSP, HSTS, X-Frame-Options)

## [1.0.0] - 2025-01-15

### Added

- Initial Angular 20 template
- Authentication system with login/register
- Role-based access control
- Dark mode support
- PrimeNG integration
- Tailwind CSS styling
- SSR support
- Husky pre-commit hooks
- ESLint and Prettier configuration
- TypeScript strict mode

---

## How to Update

### For Maintainers

When releasing a new version:

1. Update the version in `package.json`
2. Move items from `[Unreleased]` to a new version section
3. Add the release date
4. Create a git tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
5. Push changes and tags: `git push && git push --tags`

### Categories

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
