// src/app/services/cv.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/cvs`;

  generatePdf(data: any) {
    return this.http.post(`${this.baseUrl}/generate-pdf`, data, {
      responseType: 'blob' // pour recevoir un PDF binaire
    });
  }

  createCv(data: any ) {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // Télécharger un CV existant (réservé aux utilisateurs connectés)
  downloadCv(cvId: string) {
    return this.http.get(`${this.baseUrl}/${cvId}/download`, {
      responseType: 'blob'
    });
  }

  // (optionnel) Récupérer un CV par ID (pour édition)
  getCvById(cvId: string) {
    return this.http.get(`${this.baseUrl}/${cvId}`);
  }
}
