import { Injectable, signal, computed, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { User, DEMO_USERS } from '@core/models/user';
import { AuthResponse, JWTPayload } from '@core/models/auth-response';
import { environment } from '@environments/environment';
import { isPlatformBrowser } from '@angular/common';
import * as Storage from '@shared/utils/storage.util';

/**
 * Authentication Service
 * Manages user authentication state using Signals.
 */
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private router = inject(Router);

  /**
   * Current authenticated user (null if not logged in)
   */
  private currentUserSignal = signal<User | null>(null);

  /**
   * Platform ID (to check if running in browser)
   * Auth should only run in browser (not on server)
   * For example, to access localStorage/sessionStorage this is for SSR support
   */
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Authentication token
   */
  private tokenSignal = signal<string | null>(null);

  /**
   * Public read-only access to current user
   */
  readonly currentUser = this.currentUserSignal.asReadonly();

  /**
   * Computed: Is user authenticated?
   */
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  /**
   * Computed: Current user's role
   */
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);

  constructor() {
    // On service initialization, check if user is already logged in
    queueMicrotask(() => {
      if (this.isBrowser) {
        this.checkStoredAuth();
      }
    });
  }

  /**
   * Login with email and password
   *
   * @param email - User's email
   * @param password - User's password
   * @returns Observable that emits on success or error
   *
   * @example
   * ```typescript
   * auth.login('demo@angular.com', 'Angular2025!').subscribe({
   *   next: (response) => console.log('Logged in', response.user),
   *   error: (error) => console.error('Login failed', error)
   * });
   * ```
   */
  login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }

        const token = this.generateFakeJWT(user);
        const expiresAt = Date.now() + environment.auth.tokenExpiry;

        const response: AuthResponse = {
          token,
          user: {
            email: user.email,
            name: user.name,
            role: user.role,
          },
          expiresAt,
        };

        this.storeAuth(response);

        resolve(response);
      }, 500);
    });
  }

  /**
   * Register a new user
   *
   * @param name - User's full name
   * @param email - User's email
   * @param password - User's password
   * @returns Promise that resolves with auth response
   *
   * @example
   * ```typescript
   * auth.register('John Doe', 'john@example.com', 'Password123!').then({
   *   (response) => console.log('Registered', response.user)
   * });
   * ```
   */
  register(name: string, email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = DEMO_USERS.find((u) => u.email === email);
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }

        // Create new user (in demo, we just create a temporary user object)
        const newUser: User & { password: string } = {
          email,
          name,
          password,
          role: 'user', // Default role
        };

        const token = this.generateFakeJWT(newUser);
        const expiresAt = Date.now() + environment.auth.tokenExpiry;

        const response: AuthResponse = {
          token,
          user: {
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
          expiresAt,
        };

        this.storeAuth(response);

        resolve(response);
      }, 500);
    });
  }

  /**
   * Logout current user
   * Clears token, user state, and redirects to login
   */
  logout(): void {
    // Clear storage
    Storage.removeItem('accessToken');
    Storage.removeItem('currentUser');
    Storage.removeItem('tokenExpiry');

    // Clear signals
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);

    // Redirect to login
    this.router.navigate(['/login']);
  }

  /**
   * Get current auth token
   * @returns JWT token or null if not authenticated
   */
  getToken(): string | null {
    // Check if token is expired
    if (this.isTokenExpired()) {
      this.logout();
      return null;
    }

    return this.tokenSignal();
  }

  /**
   * Check if user has a specific role
   * @param role - Role to check ('admin' or 'user')
   * @returns true if user has the role
   *
   * @example
   * ```typescript
   * if (auth.hasRole('admin')) {
   *   // Show admin features
   * }
   * ```
   */
  hasRole(role: 'admin' | 'user'): boolean {
    const currentRole = this.userRole();
    return currentRole === role;
  }

  /**
   * Check if token is expired
   * @private
   */
  private isTokenExpired(): boolean {
    const expiry = Storage.getItem<number>('tokenExpiry');
    if (!expiry) return true;

    return Date.now() >= expiry;
  }

  /**
   * Store authentication data
   * @private
   */
  private storeAuth(response: AuthResponse): void {
    // Store in sessionStorage (DEMO ONLY - see security notes)
    // TODO : Use HttpOnly cookies in production for better security
    Storage.setItem('accessToken', response.token);
    Storage.setItem('currentUser', response.user);
    Storage.setItem('tokenExpiry', response.expiresAt);

    // Update signals
    this.tokenSignal.set(response.token);
    this.currentUserSignal.set(response.user);
  }

  /**
   * Check if user is already authenticated (on page load)
   * @private
   */
  private checkStoredAuth(): void {
    const token = Storage.getItem<string>('accessToken');
    const user = Storage.getItem<User>('currentUser');
    const expiry = Storage.getItem<number>('tokenExpiry');

    if (!token || !user || !expiry) {
      return;
    }

    // Check if token is expired
    if (Date.now() >= expiry) {
      this.logout();
      return;
    }

    // Restore user state
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);
  }

  /**
   * Generate a fake JWT token
   *
   * In production, this would come from your backend API.
   * This demonstrates JWT structure and token expiry.
   *
   * @private
   */
  private generateFakeJWT(user: Omit<User, 'id'> & { password: string }): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = environment.auth.tokenExpiry / 1000; // Convert ms to seconds

    const payload: JWTPayload = {
      sub: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: now + expiresIn,
    };

    // Base64 encode header and payload
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    // Fake signature (in production, this would be generated server-side with a secret key)
    const signature = 'fake_signature_for_demo_purposes_only';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}
