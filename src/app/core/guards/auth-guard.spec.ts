/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard, roleGuard } from './auth-guard';
import { Auth } from '@core/services/auth';

/**
 * Example Guard Tests
 *
 * Demonstrates how to test functional guards in Angular.
 * Guards return boolean | UrlTree to allow/deny navigation.
 */
describe('Auth Guards', () => {
  let auth: Auth;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Auth,
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['createUrlTree']),
        },
      ],
    });

    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('should allow navigation when user is authenticated', async () => {
      // Mock authenticated user
      await auth.login('admin@angular.com', 'Angular2025!');

      const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

      expect(result).toBeTrue();
    });

    it('should redirect to login when user is not authenticated', () => {
      const mockUrlTree = {} as any;
      (router.createUrlTree as jasmine.Spy).and.returnValue(mockUrlTree);

      const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('roleGuard', () => {
    it('should allow navigation when user has required role', async () => {
      await auth.login('admin@angular.com', 'Angular2025!');

      const mockRoute = {
        data: { role: 'admin' },
      } as any;

      const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, null as any));

      expect(result).toBeTrue();
    });

    it('should redirect when user lacks required role', async () => {
      await auth.login('user@angular.com', 'Angular2025!');

      const mockRoute = {
        data: { role: 'admin' },
      } as any;

      const mockUrlTree = {} as any;
      (router.createUrlTree as jasmine.Spy).and.returnValue(mockUrlTree);

      const result = TestBed.runInInjectionContext(() => roleGuard(mockRoute, null as any));

      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    });
  });
});
