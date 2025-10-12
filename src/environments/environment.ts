/**
 * Production Environment Configuration
 */
export const environment = {
  production: true,
  name: 'production',

  api: {
    baseUrl: 'https://api.example.com',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  auth: {
    tokenExpiry: 60 * 60 * 1000,
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000,
    storageType: 'sessionStorage' as 'localStorage' | 'sessionStorage',
  },

  features: {
    enableRegistration: true,
    enableSocialLogin: false,
    enableDarkMode: true,
    enableDebugTools: false,
    enableAnalytics: true,
    enableErrorReporting: true,
  },

  logging: {
    level: 'error' as 'debug' | 'info' | 'warn' | 'error',
    enableConsole: false,
  },

  seo: {
    siteName: 'Angular 20 Template',
    defaultTitle: 'Angular 20 Template - Production Ready',
    defaultDescription: 'A modern Angular 20 template with best practices',
    defaultImage: '/assets/og-image.png',
  },
};
