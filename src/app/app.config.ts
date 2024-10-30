import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '@interceptors/error.interceptor';
import { authInterceptor } from '@interceptors/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimationsAsync(), provideClientHydration(),
    provideHttpClient(
      withFetch(), withInterceptors([
        withHttpCacheInterceptor(), authInterceptor, errorInterceptor
      ])
    ),
    MessageService,
    importProvidersFrom(JwtModule.forRoot({})), provideHttpCache()
  ]
};
