/**
 * User model
 */
export interface User {
  email: string;
  name: string;
  role: 'user' | 'admin';
  id?: string;
}

// TODO Remove if connecting to real backend
export const DEMO_USERS: readonly (User & { password: string })[] = [
  {
    email: 'demo@angular.com',
    password: 'Angular2025!',
    name: 'Demo User',
    role: 'user',
  },
  {
    email: 'admin@angular.com',
    password: 'Admin2025!',
    name: 'Admin User',
    role: 'admin',
  },
] as const;
