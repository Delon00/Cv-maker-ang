import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public userService = inject(UserService);
  private router = inject(Router);

  isSidebarCollapsed = false;

  ngOnInit(): void {

    this.userService.loadAllUsers();
  }

  /**
   * Vérifie si on est sur la racine /admin pour afficher les KPI
   * Si on est sur /admin/users, cette fonction retourne false
   */
  isRootPath(): boolean {
    const urlTree = this.router.parseUrl(this.router.url);
    const urlWithoutParams = '/' + urlTree.root.children['primary']?.segments.map(it => it.path).join('/');
    
    return urlWithoutParams === '/admin';
  }

  addTemplate() {
    console.log('Ouverture modal ajout template...');
  }

  goToSettings() {
    this.router.navigate(['/admin/settings']);
  }

  logout() {
    this.userService.logout();
  }
}