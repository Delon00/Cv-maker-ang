import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@services/user.service';

export const guestGuard: CanActivateFn = () => {
    const userService = inject(UserService);
    const router = inject(Router);

    if (userService.isAuthenticated()) {
        
        const target = userService.userPlan() === 'admin' ? '/admin' : '/profil';
        
        router.navigate([target]);
        return false;
    }
    
    return true;
};