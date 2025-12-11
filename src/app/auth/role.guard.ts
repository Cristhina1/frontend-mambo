import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // roles permitidos por cada ruta
  const requiredRoles = route.data['roles'] as string[];

  // el usuario tiene el rol necesario?
  if (auth.hasRole(requiredRoles)) {
    return true;
  }

  // si no, redirigir
  router.navigate(['/productos']);
  return false;
};
