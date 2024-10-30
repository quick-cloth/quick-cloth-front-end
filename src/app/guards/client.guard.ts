import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/internal/auth.service';

export const clientGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const auth = inject(AuthService)
  return auth.userDetails?.role === 'ROLE_CLIENT'? true: router.navigateByUrl("/e403");
};
