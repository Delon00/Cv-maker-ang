import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import  User  from '@interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports:[CommonModule],
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.message || 'Erreur lors du chargement des utilisateurs.';
        this.isLoading = false;
      }
    });
  }

  onView(user: User) {
    console.log('Voir utilisateur:', user);
  }

  onDelete(userId: string) {
    console.log('Supprimer utilisateur ID:', userId);
    this.users = this.users.filter(u => u.id !== userId);
  }

  logout() {this.userService.logout();}

}
