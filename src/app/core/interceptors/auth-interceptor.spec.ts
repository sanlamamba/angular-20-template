import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import { Auth } from '@core/services/auth';
import { Router } from '@angular/router';

/**
 * Example Interceptor Tests
 *
 * Demonstrates how to test functional HTTP interceptors.
 * Uses HttpTestingController to mock HTTP requests.
 */
describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let auth: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        Auth,
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(Auth);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when user is authenticated', async () => {
    await auth.login('admin@angular.com', 'Angular2025!');
    const token = auth.getToken();

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush({});
  });

  it('should not add Authorization header when user is not authenticated', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });
});
