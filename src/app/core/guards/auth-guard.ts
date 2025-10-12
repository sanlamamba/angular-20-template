import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@core/services/auth';

/**
 * Auth Guard - Protects routes from unauthenticated access
 *
 * @example
 * ```typescript
 * {
 *   path: 'dashboard',
 *   component: Dashboard,
 *   canActivate: [authGuard]
 * }
 * ```
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};

/**
 * Role Guard - Protects routes from unauthorized access based on user role
 *
 * @example
 * ```typescript
 * {
 *   path: 'admin',
 *   component: Admin,
 *   canActivate: [roleGuard],
 *   data: { role: 'admin' }
 * }
 * ```
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const requiredRole = route.data['role'] as 'admin' | 'user';

  if (!auth.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  if (auth.hasRole(requiredRole)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
