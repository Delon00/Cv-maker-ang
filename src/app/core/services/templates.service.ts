import { Injectable } from '@angular/core';
import { LocalStorageService } from '@services/local-storage.service';
import Template from '@interfaces/template.interface';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
    private baseUrl = `${environment.apiUrl}/templates`;

    constructor(private http: HttpClient) {}

  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.baseUrl}/all`);
  }
}
