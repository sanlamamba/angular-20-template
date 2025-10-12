import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs';
import { handleError } from '@shared/utils/http.util';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/login']);
      }

      return handleError(error).pipe(
        catchError((formattedError: Error) => {
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: formattedError.message,
            life: 5000,
          });

          throw error;
        }),
      );
    }),
  );
};
