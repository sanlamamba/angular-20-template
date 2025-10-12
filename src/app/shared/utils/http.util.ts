import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

/**
 * Build URL query parameters from an object
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
 */
export function handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage = 'An unknown error occurred';

  if (error.error instanceof ErrorEvent) {
    errorMessage = `Client Error: ${error.error.message}`;
  } else {
    errorMessage = `Server Error (${error.status}): ${error.message}`;

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
 */
export function retryWithBackoff(maxRetries = 3, delayMs = 1000) {
  return retry({
    count: maxRetries,
    delay: (error, retryCount) => {
      const backoffDelay = delayMs * Math.pow(2, retryCount - 1);

      console.warn(`Retry attempt ${retryCount}/${maxRetries} after ${backoffDelay}ms`, error);

      return timer(backoffDelay);
    },
  });
}
