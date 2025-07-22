import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { AsyncPipe, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgClass],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isMenuOpen = false;
  isAnimatingOut = false;

  readonly user = signal<any | null>(null);
  private userService = inject(UserService);

  constructor() {
    effect(() => {
      this.userService.isAuthenticated$.subscribe(user => this.user.set(user));
    });
  }

  toggleMenu(): void {
    if (this.isMenuOpen) {
      this.isAnimatingOut = true;
      setTimeout(() => {
        this.isMenuOpen = false;
        this.isAnimatingOut = false;
      }, 600);
    } else {
      this.isMenuOpen = true;
    }
  }

  logout(): void {
    this.userService.logout();
  }
}

