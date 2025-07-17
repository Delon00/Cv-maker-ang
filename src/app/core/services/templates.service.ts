import { inject, Injectable, Type } from '@angular/core';
import Template from '@interfaces/template.interface';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  private baseUrl = `${environment.apiUrl}/templates`;


  private http = inject (HttpClient);
  private registry = new Map<string, Type<any>>();

  registerTemplate(key: string, component: Type<any>) {
    this.registry.set(key, component);
  }

  getTemplateComponent(key: string): Type<any> | undefined {
    return this.registry.get(key);
  }



  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.baseUrl}/all`);
  }

  getTemplateById(id: string): Observable<Template> {
    return this.http.get<Template>(`${this.baseUrl}/${id}`);
  }

}
