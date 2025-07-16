import { Component, OnInit,inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@layout/navbar/navbar.component';
import { TemplatesService } from '@services/templates.service';
import Template from '@interfaces/template.interface';
@Component({
  selector: 'app-templates',
  imports: [CommonModule,NavbarComponent,RouterModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];

  templateService = inject(TemplatesService);

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templateService.getAllTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des templates:', err);
      }
    });
  }
}

