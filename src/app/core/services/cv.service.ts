
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/cvs`;



  createCv(data: any ) {
    return this.http.post(`${this.baseUrl}`, data);
  }

  updateCv(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/cv/${id}`, data);
  }


  getCvById(cvId: string):Observable<any> {
    return this.http.get(`${this.baseUrl}/${cvId}`);
  }

  getCvByName(cvName: string):Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${encodeURIComponent(cvName)}`);
  }
}
