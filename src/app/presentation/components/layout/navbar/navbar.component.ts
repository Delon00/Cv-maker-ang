import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink], // NgClass est inclus dans CommonModule
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  // États du menu mobile
  isMenuOpen = false;
  isAnimatingOut = false;

  // Injection du service
  private userService = inject(UserService);
  user = this.userService.currentUser; 

  toggleMenu(): void {
    if (this.isMenuOpen) {
      this.isAnimatingOut = true;
      setTimeout(() => {
        this.isMenuOpen = false;
        this.isAnimatingOut = false;
      }, 600); // Doit correspondre à la durée de ton animation CSS
    } else {
      this.isMenuOpen = true;
    }
  }

  logout(): void {
    this.userService.logout();
    this.isMenuOpen = false; // On ferme le menu après déconnexion
  }
}