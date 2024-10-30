import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/internal/auth.service';
import { MessageService } from 'primeng/api';
import { catchError, throwError, timer } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const auth = inject(AuthService)
  const messageS = inject(MessageService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse)=>{
      
      switch(error.status){
        case 0: {
          messageS.add({
            severity: 'error',
            summary: `Error al conectar con el servidor: ${error.status}`,
            detail: `${error.message}`
          })
          break
        }
        case HttpStatusCode.Unauthorized: {
          messageS.add({
            severity: 'error',
            summary: `Error de autenticación, inténta loguearte otra vezz`
          })
          auth.unathorizedResponse()
          timer(1500).subscribe(()=> router.navigateByUrl("/login"))
          break
        }
        case HttpStatusCode.InternalServerError: {
          router.navigateByUrl("/e500")
          break
        }
        case HttpStatusCode.Forbidden: {
          router.navigateByUrl("/e403")
          break
        }
        case HttpStatusCode.BadGateway:{
          messageS.add({
            severity: 'warn',
            summary: `Espere a que suba el servidor :D`,
          })
        }
      }
      return throwError(()=>error)
    })
  );
};
