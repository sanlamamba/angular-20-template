import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

/**
 * Build URL query parameters from an object
 *
 * Filters out null/undefined values and properly encodes parameters.
 *
 * @param params - Object with key-value pairs
 * @returns URL-encoded query string (without leading ?)
 *
 * @example
 * ```typescript
 * const query = buildQueryParams({ name: 'John', age: 30, city: null });
 * // Returns: "name=John&age=30"
 *
 * const url = `/api/users?${query}`;
 * // Returns: "/api/users?name=John&age=30"
 * ```
 */
export function buildQueryParams(
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  return Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

/**
 * Handle HTTP errors and return user-friendly error messages
 *
 * @param error - HTTP error response
 * @returns Observable that throws a formatted error
 *
 * @example
 * ```typescript
 * this.http.get('/api/users').pipe(
 *   catchError(handleError)
 * ).subscribe({
 *   error: (err) => console.error(err.message)
 * });
 * ```
 */
export function handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage = 'An unknown error occurred';

  if (error.error instanceof ErrorEvent) {
    // Client-side or network error
    errorMessage = `Client Error: ${error.error.message}`;
  } else {
    // Backend returned an unsuccessful response code
    errorMessage = `Server Error (${error.status}): ${error.message}`;

    // Try to extract message from error body
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
  }

  console.error('HTTP Error:', {
    status: error.status,
    message: errorMessage,
    url: error.url,
    timestamp: new Date().toISOString(),
  });

  return throwError(() => new Error(errorMessage));
}

/**
 * Retry failed HTTP requests with exponential backoff
 *
 * Waits progressively longer between retries:
 * - 1st retry: 1 second
 * - 2nd retry: 2 seconds
 * - 3rd retry: 4 seconds
 *
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param delayMs - Initial delay in milliseconds (default: 1000)
 * @returns RxJS operator for use in pipe()
 *
 * @example
 * ```typescript
 * this.http.get('/api/users').pipe(
 *   retryWithBackoff(3, 1000),
 *   catchError(handleError)
 * ).subscribe();
 * ```
 */
export function retryWithBackoff(maxRetries = 3, delayMs = 1000) {
  return retry({
    count: maxRetries,
    delay: (error, retryCount) => {
      // Exponential backoff: delay * 2^(retryCount - 1)
      const backoffDelay = delayMs * Math.pow(2, retryCount - 1);

      console.warn(`Retry attempt ${retryCount}/${maxRetries} after ${backoffDelay}ms`, error);

      return timer(backoffDelay);
    },
  });
}
