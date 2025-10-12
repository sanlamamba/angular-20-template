/**
 * Development Environment Configuration
 *
 * This configuration is used for local development.
 * Values here should match your local development setup.
 */
export const environment = {
  production: false,
  name: 'development',

  // API Configuration
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 60000, // 60 seconds (longer for debugging)
    retryAttempts: 1,
    retryDelay: 500,
  },

  // Authentication
  auth: {
    tokenExpiry: 8 * 60 * 60 * 1000, // 8 hours (longer for dev)
    refreshTokenExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
    storageType: 'localStorage' as 'localStorage' | 'sessionStorage',
  },

  // Feature Flags
  features: {
    enableRegistration: true,
    enableSocialLogin: true,
    enableDarkMode: true,
    enableDebugTools: true, // Show debug buttons in development
    enableAnalytics: false,
    enableErrorReporting: false,
  },

  // Logging
  logging: {
    level: 'debug' as 'debug' | 'info' | 'warn' | 'error',
    enableConsole: true,
  },

  // SEO
  seo: {
    siteName: 'Angular 20 Template [DEV]',
    defaultTitle: 'Angular 20 Template - Development',
    defaultDescription: 'A modern Angular 20 template with best practices',
    defaultImage: '/assets/og-image.png',
  },
};
