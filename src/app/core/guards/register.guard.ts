import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@services/user.service';

export const registerGuard: CanActivateFn = () => {
  let userService = inject(UserService);
  let router = inject(Router);

  if (userService.isAuthenticated()) {
    router.navigate(['/templates']);
    return false;
  } else {
    return true;
  }
  
};

