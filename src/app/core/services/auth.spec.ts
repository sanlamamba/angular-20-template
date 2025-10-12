import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth } from './auth';
import { DEMO_USERS } from '@core/models/user';

/**
 * Example Service Tests with Signals
 *
 * This demonstrates how to test services that use Angular signals.
 * Key patterns:
 * - Use TestBed for dependency injection
 * - Mock dependencies like Router
 * - Test signal values with ()
 * - Use async/await for Promise-based methods
 */
describe('Auth Service', () => {
  let service: Auth;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spy object for Router
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [Auth, { provide: Router, useValue: spy }],
    });

    service = TestBed.inject(Auth);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no authenticated user', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should login successfully with valid credentials', async () => {
    const testUser = DEMO_USERS[0];
    const response = await service.login(testUser.email, testUser.password);

    expect(response.user.email).toBe(testUser.email);
    expect(response.token).toBeTruthy();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUser()?.email).toBe(testUser.email);
  });

  it('should reject login with invalid credentials', async () => {
    try {
      await service.login('invalid@example.com', 'wrongpassword');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid email or password'));
      expect(service.isAuthenticated()).toBeFalse();
    }
  });

  it('should register a new user successfully', async () => {
    const response = await service.register('New User', 'new@example.com', 'Password123!');

    expect(response.user.email).toBe('new@example.com');
    expect(response.user.name).toBe('New User');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should logout and clear user data', async () => {
    // First login
    const testUser = DEMO_USERS[0];
    await service.login(testUser.email, testUser.password);
    expect(service.isAuthenticated()).toBeTrue();

    // Then logout
    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check user role correctly', async () => {
    const adminUser = DEMO_USERS.find((u) => u.role === 'admin')!;
    await service.login(adminUser.email, adminUser.password);

    expect(service.hasRole('admin')).toBeTrue();
    expect(service.hasRole('user')).toBeFalse();
  });
});
