
import { inject, Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { UserService } from '@services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  private userService = inject(UserService);
  private router = inject (Router);


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const isAdmin = this.userService.getUserPlan() === 'admin';
    const isLoggedIn = this.userService.isAuthenticated();

    if (isAdmin && isLoggedIn) {
      return true;
    } else {
      return this.router.parseUrl('/');
    }
  }
}
