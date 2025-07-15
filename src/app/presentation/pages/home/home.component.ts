import { Component } from '@angular/core';
import { NavbarComponent } from '@app/presentation/components/layout/navbar/navbar.component';


@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  currentYear: number = new Date().getFullYear();

}
