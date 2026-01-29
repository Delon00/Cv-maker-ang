import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of, catchError, map } from 'rxjs';
import { environment } from '@environments/environment';

import User from '@interfaces/user.interface';
import Login from '@interfaces/login.interface';
import Register from '@interfaces/register.interface';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);


  private readonly authUrl = environment.authUrl;
  private readonly userUrl = environment.userUrl;


  private _currentUser = signal<User | null>(null);

  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._currentUser());
  public readonly isAdmin = computed(() => this._currentUser()?.plan === 'admin');
  public readonly userPlan = computed(() => this._currentUser()?.plan ?? null); // Retourne 'admin', 'user', ou null
  


  // --- LOGIQUE D'AUTHENTIFICATION ---

  /**
   * RÉHYDRATATION DE SESSION (CRUCIAL)
   * Appelé au démarrage de l'app (APP_INITIALIZER).
   * Vérifie si le cookie HttpOnly est valide et récupère l'utilisateur.
   */

  fetchMe(): Observable<User | null> {
    return this.http.get<User>(`${this.authUrl}/me`, { withCredentials: true }).pipe(
      tap((user) => {
        console.log('✅ Session restaurée :', user);
        this._currentUser.set(user);
      }),
      catchError((err) => {
        // AJOUTE CE LOG POUR VOIR L'ERREUR DANS LA CONSOLE DU NAVIGATEUR
        console.error('❌ Erreur FetchMe (Cookie rejeté ou absent) :', err); 
        this._currentUser.set(null);
        return of(null);
      })
    );
  }

  /**
   * CONNEXION
   */
  login(credentials: Login): Observable<User> {
    return this.http.post<{ user: User }>(`${this.authUrl}/login`, credentials).pipe(
      map(response => response.user),
      tap((user) => {
        this._currentUser.set(user);
        const target = user.plan === 'admin' ? '/admin' : '/profil';
        this.router.navigate([target]);
      })
    );
  }

  /**
   * DÉCONNEXION
   */
  logout(): void {
    this.http.post(`${this.authUrl}/logout`, {}).subscribe({
      next: () => this.finalizeLogout(),
      error: (err) => {
        console.warn('Erreur logout API (nettoyage local forcé)', err);
        this.finalizeLogout();
      }
    });
  }

  /**
   * Nettoyage de l'état local et redirection
   */
  private finalizeLogout(): void {
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * INSCRIPTION
   */
  register(data: Register): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, data).pipe(
        tap((user) => {
            // Optionnel : connecter l'utilisateur directement après l'inscription
            this._currentUser.set(user);
            this.router.navigate(['/profil']);
        })
    );
  }

  // --- GESTION DES UTILISATEURS (ADMIN ou PROFIL) ---

  updateProfile(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/${id}`, data).pipe(
      tap(updatedUser => {
        if (this._currentUser()?.id === updatedUser.id) {
          this._currentUser.set(updatedUser);
        }
      })
    );
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }
}