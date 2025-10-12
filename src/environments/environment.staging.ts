/**
 * Staging Environment Configuration
 *
 * This configuration is used for staging/pre-production environment.
 * Should closely match production but with debugging enabled.
 */
export const environment = {
  production: false,
  name: 'staging',

  // API Configuration
  api: {
    baseUrl: 'https://api-staging.example.com',
    timeout: 30000,
    retryAttempts: 2,
    retryDelay: 1000,
  },

  // Authentication
  auth: {
    tokenExpiry: 2 * 60 * 60 * 1000, // 2 hours
    refreshTokenExpiry: 14 * 24 * 60 * 60 * 1000, // 14 days
    storageType: 'sessionStorage' as 'localStorage' | 'sessionStorage',
  },

  // Feature Flags
  features: {
    enableRegistration: true,
    enableSocialLogin: true,
    enableDarkMode: true,
    enableDebugTools: true, // Keep debug tools for testing
    enableAnalytics: false, // Don't pollute analytics
    enableErrorReporting: true,
  },

  // Logging
  logging: {
    level: 'info' as 'debug' | 'info' | 'warn' | 'error',
    enableConsole: true,
  },

  // SEO
  seo: {
    siteName: 'Angular 20 Template [STAGING]',
    defaultTitle: 'Angular 20 Template - Staging',
    defaultDescription: 'A modern Angular 20 template with best practices',
    defaultImage: '/assets/og-image.png',
  },
};
