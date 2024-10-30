import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/internal/auth.service';

export const bankGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const auth = inject(AuthService)
  return auth.userDetails?.role === 'ROLE_BANK_EMPLOYEE'? true: router.navigateByUrl("/e403");
};
