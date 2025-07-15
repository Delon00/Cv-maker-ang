import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user.service';

export const homeGuard: CanActivateFn = () => {
  let userService = inject(UserService);
  let router = inject (Router);

  if (userService.isAuthenticated()){
    router.navigate(['/dashboard']);
    return false;
  }
  return true
};