import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { LocalStorageService } from '@services/local-storage.service';
import decodeJwt from '@utils/decodeJwt';
import User from '@interfaces/user.interface';
import Register from '@interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private localService = inject(LocalStorageService);
  private router = inject(Router);

  private authUrl = environment.authUrl;
  private userUrl = environment.userUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();




  private hasToken(): boolean {
    return !!this.localService.getToken();
  }

  refreshAuthStatus(): void {
    this.isAuthenticatedSubject.next(this.hasToken());
  }

  getUserId(): string | null {
    const token = this.localService.getToken();
    if (!token) return null;

    try {
      const decoded: any = decodeJwt(token);
      return decoded.userId;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  getUserPlan(): string | null {
    const token = this.localService.getToken();
    if (!token) return null;

    try {
      const decoded: any = decodeJwt(token);
      return decoded.plan;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  getUser(): Observable<User | null> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => ({ status: 401, message: 'Utilisateur non authentifié' }));
    }

    return this.http.get<User>(`${this.userUrl}/${userId}`).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(this.handleError)
    );
  }


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userUrl}/all`, {
    }).pipe(
      catchError(this.handleError)
    );
  }

  register(user: Register): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(catchError(this.handleError));
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(res => {
        if (res?.accessToken) {
          this.localService.createToken(res.accessToken);
          this.refreshAuthStatus();
          this.currentUserSubject.next(res.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.localService.destroyToken();
    this.currentUserSubject.next(null);
    this.refreshAuthStatus();
    this.router.navigate(['/']);
  }



  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Une erreur inconnue est survenue';
    if (error.error?.message) {
      message = error.error.message;
    } else if (typeof error.error === 'string') {
      message = error.error;
    } else if (error.statusText) {
      message = error.statusText;
    }

    console.error(`[UserService] Erreur HTTP: ${message}`, error);
    return throwError(() => ({
      status: error.status,
      message: message
    }));
  }
}
