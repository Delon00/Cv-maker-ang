import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@services/user.service';

export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  // 1. On récupère les valeurs des signaux
  const isAuth = userService.isAuthenticated();
  const plan = userService.userPlan();

  // 2. Vérification stricte
  if (isAuth && plan === 'admin') {
    return true;
  }

  // 3. Redirection si refusé
  // Si l'utilisateur n'est même pas connecté, on le renvoie au login
  if (!isAuth) {
    return router.createUrlTree(['/login']);
  }

  // Si connecté mais pas admin, on le renvoie à l'accueil (ou dashboard)
  return router.createUrlTree(['/']);
};