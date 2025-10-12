import { Injectable, signal, computed, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { User, DEMO_USERS } from '@core/models/user';
import { AuthResponse, JWTPayload } from '@core/models/auth-response';
import { environment } from '@environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth extends ApiService {
  private router = inject(Router);
  private currentUserSignal = signal<User | null>(null);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);

  constructor() {
    super();
    queueMicrotask(() => {
      if (this.isBrowser) {
        this.checkSession();
      }
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.post<AuthResponse>('/auth/login', { email, password }),
      );

      this.currentUserSignal.set(response.user);
      return response;
    } catch {
      return this.mockLogin(email, password);
    }
  }

  private mockLogin(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }

        const response: AuthResponse = {
          token: this.generateFakeJWT(user),
          user: {
            email: user.email,
            name: user.name,
            role: user.role,
          },
          expiresAt: Date.now() + environment.auth.tokenExpiry,
        };

        this.currentUserSignal.set(response.user);
        resolve(response);
      }, 500);
    });
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.post<AuthResponse>('/auth/register', { name, email, password }),
      );

      this.currentUserSignal.set(response.user);
      return response;
    } catch {
      return this.mockRegister(name, email, password);
    }
  }

  private mockRegister(name: string, email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = DEMO_USERS.find((u) => u.email === email);
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }

        const newUser: User & { password: string } = {
          email,
          name,
          password,
          role: 'user',
        };

        const response: AuthResponse = {
          token: this.generateFakeJWT(newUser),
          user: {
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
          expiresAt: Date.now() + environment.auth.tokenExpiry,
        };

        this.currentUserSignal.set(response.user);
        resolve(response);
      }, 500);
    });
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.post('/auth/logout', {}));
    } catch {
      // Ignore error
    }

    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return null;
  }

  hasRole(role: 'admin' | 'user'): boolean {
    return this.userRole() === role;
  }

  private async checkSession(): Promise<void> {
    try {
      const response = await firstValueFrom(this.get<AuthResponse>('/auth/session'));
      this.currentUserSignal.set(response.user);
    } catch {
      // No active session
    }
  }

  private generateFakeJWT(user: Omit<User, 'id'> & { password: string }): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = environment.auth.tokenExpiry / 1000;

    const payload: JWTPayload = {
      sub: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: now + expiresIn,
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = 'fake_signature';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}
