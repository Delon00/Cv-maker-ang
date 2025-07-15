import { Component } from '@angular/core';
import { NavbarComponent } from '@app/presentation/components/layout/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  currentYear: number = new Date().getFullYear();

}
