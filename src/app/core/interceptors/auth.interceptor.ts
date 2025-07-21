import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from '@services/local-storage.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);
  const token = localStorageService.getToken();

  let cloned = req;

  if (token) {
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(cloned).pipe(
    catchError(err => {
      if (err.status === 401) {
        localStorageService.destroyToken();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
