import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@services/internal/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  const userDetails = auth.userDetails
  if(userDetails !== null){
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${userDetails.token}`
      }
    })
  }
  return next(req);
};
