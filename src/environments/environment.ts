/**
 * Production Environment Configuration
 *
 * This configuration is used when building for production.
 * Update these values according to your production setup.
 */
export const environment = {
  production: true,
  name: 'production',

  // API Configuration
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Authentication
  auth: {
    tokenExpiry: 60 * 60 * 1000, // 1 hour
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    storageType: 'sessionStorage' as 'localStorage' | 'sessionStorage',
  },

  // Feature Flags
  features: {
    enableRegistration: true,
    enableSocialLogin: false,
    enableDarkMode: true,
    enableDebugTools: false, // Hide debug buttons in production
    enableAnalytics: true,
    enableErrorReporting: true,
  },

  // Logging
  logging: {
    level: 'error' as 'debug' | 'info' | 'warn' | 'error',
    enableConsole: false,
  },

  // SEO
  seo: {
    siteName: 'Angular 20 Template',
    defaultTitle: 'Angular 20 Template - Production Ready',
    defaultDescription: 'A modern Angular 20 template with best practices',
    defaultImage: '/assets/og-image.png',
  },
};
