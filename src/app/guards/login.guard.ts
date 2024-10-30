import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NavigationRoutes } from '@constants/navigation-routes';
import { AuthService } from '@services/internal/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (auth.isLogged) {
    switch(auth.userDetails?.role){
      case 'ROLE_BANK_EMPLOYEE':{
        return router.navigateByUrl(NavigationRoutes.BANK_EMPLOYEE_HOME)
      }
      case 'ROLE_WARDROBE_EMPLOYEE':{
        return router.navigateByUrl(NavigationRoutes.WARDROBE_EMPLOYEE_HOME)
      }
      case 'ROLE_CLIENT':{
        return router.navigateByUrl(NavigationRoutes.CLIENT_HOME)
      }
    }
  }
  return true;
};
