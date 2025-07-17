import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService && userService.isAuthenticated()) {
    const plan = userService.getUserPlan();

    if (plan === 'admin') {
      router.navigate(['/admin']);
      return false;
    }

    return true;
  }

  router.navigate(['/login']);
  return false;
};
