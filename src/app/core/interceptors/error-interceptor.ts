import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs';
import { handleError } from '@shared/utils/http.util';

/**
 * Error Interceptor
 *
 * Catches HTTP errors and displays user-friendly messages.
 * Handles 401 (unauthorized), 403 (forbidden), 500+ (server errors)
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle specific status codes that require navigation
      if (error.status === 401) {
        router.navigate(['/login']);
      }

      // Use the shared handleError utility which logs and formats the error
      // Then show toast notification
      return handleError(error).pipe(
        catchError((formattedError: Error) => {
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: formattedError.message,
            life: 5000,
          });

          // Re-throw the original HTTP error
          throw error;
        }),
      );
    }),
  );
};
