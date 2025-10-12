import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Loading } from '@core/services/loading';
import { finalize } from 'rxjs';

/**
 * Loading Interceptor
 *
 * Automatically shows/hides loading indicator for HTTP requests.
 * Increments loading counter on request start, decrements on complete.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(Loading);

  loading.show();

  // Hide loading when request completes (success or error)
  return next(req).pipe(finalize(() => loading.hide()));
};
