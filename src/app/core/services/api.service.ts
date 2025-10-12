import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, mergeMap } from 'rxjs/operators';
import { environment } from '@environments/environment';

/**
 * Base API Service
 *
 * Provides a centralized HTTP service with:
 * - Retry logic for failed requests
 * - Timeout handling
 * - Error transformation
 * - Base URL configuration
 *
 * Use this service as a base for your domain-specific API services.
 *
 * @example
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class UserApiService extends ApiService {
 *   getUsers() {
 *     return this.get<User[]>('/users');
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  protected baseUrl = environment.api.baseUrl;

  /**
   * HTTP GET request with retry logic
   */
  protected get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, {
        headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
        params: options?.params,
        context: options?.context,
      })
      .pipe(
        retryWhen((errors) => this.retryStrategy(errors, options)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * HTTP POST request with retry logic
   */
  protected post<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
        params: options?.params,
        context: options?.context,
      })
      .pipe(
        retryWhen((errors) => this.retryStrategy(errors, options)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * HTTP PUT request with retry logic
   */
  protected put<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
        params: options?.params,
        context: options?.context,
      })
      .pipe(
        retryWhen((errors) => this.retryStrategy(errors, options)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * HTTP PATCH request with retry logic
   */
  protected patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
        params: options?.params,
        context: options?.context,
      })
      .pipe(
        retryWhen((errors) => this.retryStrategy(errors, options)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * HTTP DELETE request with retry logic
   */
  protected delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${endpoint}`, {
        headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
        params: options?.params,
        context: options?.context,
      })
      .pipe(
        retryWhen((errors) => this.retryStrategy(errors, options)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Retry strategy for failed requests
   * Retries only on network errors or 5xx server errors
   */
  private retryStrategy(errors: Observable<HttpErrorResponse>, options?: RequestOptions) {
    const maxRetries = options?.retryAttempts ?? environment.api.retryAttempts;
    const retryDelay = options?.retryDelay ?? environment.api.retryDelay;

    return errors.pipe(
      mergeMap((error, index) => {
        if (error.status >= 400 && error.status < 500) {
          return throwError(() => error);
        }

        if (index >= maxRetries) {
          return throwError(() => error);
        }

        if (environment.logging.enableConsole) {
          console.warn(`Retry attempt ${index + 1}/${maxRetries} after ${retryDelay}ms`);
        }

        const backoffDelay = retryDelay * Math.pow(2, index);
        return timer(backoffDelay);
      }),
    );
  }

  /**
   * Transform HTTP errors into friendly error objects
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }

    if (environment.logging.enableConsole) {
      console.error('API Error:', errorMessage, error);
    }

    return throwError(() => new ApiError(errorMessage, error.status, error));
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError: HttpErrorResponse,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request options interface
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  retryAttempts?: number;
  retryDelay?: number;
  context?: HttpContext;
}
