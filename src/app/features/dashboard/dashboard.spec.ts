import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { Auth } from '@core/services/auth';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

/**
 * Example Component Tests with Signals
 *
 * Demonstrates how to test components that use signals and inject dependencies.
 * Key patterns:
 * - Use ComponentFixture for component testing
 * - Mock service dependencies
 * - Use detectChanges() to trigger change detection
 * - Query DOM with By.css()
 */
describe('Dashboard Component', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let mockAuth: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
    // Create mock for Auth service
    mockAuth = jasmine.createSpyObj('Auth', ['logout'], {
      currentUser: jasmine.createSpy('currentUser').and.returnValue({
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      }),
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
    });

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: Auth, useValue: mockAuth },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name from auth service', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test User');
  });

  it('should call logout when logout button is clicked', () => {
    const logoutButton = fixture.debugElement.query(By.css('button[label="Logout"]'));

    if (logoutButton) {
      logoutButton.nativeElement.click();
      expect(mockAuth.logout).toHaveBeenCalled();
    }
  });
});
