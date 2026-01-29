import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important pour @for, @if, DatePipe
import { Router, RouterModule } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { NavbarComponent } from '@layout/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);

  // Données utilisateur
  user = this.userService.currentUser;
  
  // Simulation de données (À remplacer par votre appel API CvService.getAllCvs())
  myCvs: any[] = [
    { 
      id: '1', 
      title: 'Développeur FullStack', 
      updatedAt: new Date(), 
      templateName: 'Modern Tech',
      thumbnail: 'assets/cv-placeholder-1.png' // Mettez une image par défaut si null
    },
    { 
      id: '2', 
      title: 'Chef de Projet Junior', 
      updatedAt: new Date('2023-12-20'), 
      templateName: 'Corporate',
      thumbnail: null 
    }
  ];

  ngOnInit(): void {
    // Ici, chargez vos vrais CVs :
    // this.cvService.getMyCvs().subscribe(cvs => this.myCvs = cvs);
  }

  createNew() {
    this.router.navigate(['/templates']);
  }

  editCv(id: string) {
    // Rediriger vers l'éditeur avec l'ID du CV existant
    // this.router.navigate(['/cv-editor', id]); 
    console.log('Edit', id);
  }

  downloadCv(id: string) {
    console.log('Download', id);
  }

  deleteCv(id: string) {
    // Ajoutez une confirmation (Dialog PrimeNG) ici idéalement
    this.myCvs = this.myCvs.filter(c => c.id !== id);
  }
}