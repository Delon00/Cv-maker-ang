import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from '@services/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getToken();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  } else {
    return next(req);
  }
};
