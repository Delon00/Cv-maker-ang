import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@layout/navbar/navbar.component';
import { TemplatesService } from '@services/templates.service';
import Template from '@interfaces/template.interface';

@Component({
  selector: 'app-templates',
  standalone: true, // Si vous utilisez standalone components
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];
  isLoading: boolean = true; // Pour afficher le skeleton loader

  private templateService = inject(TemplatesService);

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.templateService.getAllTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
        // Petit délai artificiel pour voir l'animation si le chargement est instantané (optionnel)
        // setTimeout(() => this.isLoading = false, 500);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des templates:', err);
        this.isLoading = false;
      }
    });
  }
}