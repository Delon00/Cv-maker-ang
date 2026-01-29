import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const isApiUrl = req.url.startsWith(environment.apiUrl) || req.url.startsWith(environment.authUrl);
  let clonedReq = req;

  if (isApiUrl) {
    if (!req.withCredentials) {
      clonedReq = req.clone({withCredentials: true});
    }
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const isAuthCheck = req.url.includes('/me') || req.url.includes('/profile');

        if (!isAuthCheck && !router.url.includes('/login')) {
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};