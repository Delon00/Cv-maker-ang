import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import { Router, RouterModule, RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
      
  }

  logout() {this.userService.logout();}



}
