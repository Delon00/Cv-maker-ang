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

  // =================================================================
  // 1. STATE & SIGNALS (État de l'application)
  // =================================================================

  // Signal pour l'utilisateur connecté (État global)
  private _currentUser = signal<User | null>(null);

  // Signal spécifique pour la liste des utilisateurs (Zone Admin)
  private _adminUsersList = signal<User[]>([]); 

  // =================================================================
  // 2. COMPUTED & READONLY (Exposition des données)
  // =================================================================

  // Accesseurs en lecture seule pour l'utilisateur courant
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._currentUser());
  public readonly isAdmin = computed(() => this._currentUser()?.plan === 'admin');
  public readonly userPlan = computed(() => this._currentUser()?.plan ?? null);

  // Accesseurs pour la zone Admin
  public readonly adminUsersList = this._adminUsersList.asReadonly();
  
  // Compteur dynamique basé sur la longueur de la liste Admin
  public readonly adminUsersCount = computed(() => this._adminUsersList().length);


  // =================================================================
  // 3. LOGIQUE ADMIN (Gestion des utilisateurs)
  // =================================================================

  /**
   * Charge tous les utilisateurs depuis le backend (ADMIN ONLY)
   * Endpoint: GET /users/all
   */
  loadAllUsers(): void {
    this.http.get<User[]>(`${this.userUrl}/all`, { withCredentials: true }).subscribe({
      next: (users) => {
        this._adminUsersList.set(users);
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  /**
   * Supprime un utilisateur et met à jour les signaux instantanément (ADMIN ONLY)
   * Utilise une mise à jour optimiste pour éviter de recharger toute la liste
   */
  deleteUser(userId: string): Observable<User> {
    return this.http.delete<User>(`${this.userUrl}/${userId}`, { withCredentials: true }).pipe(
      tap(() => {
        // Mise à jour locale du signal : on filtre l'ID supprimé
        this._adminUsersList.update(users => users.filter(u => u.id !== userId));
      })
    );
  }


  // =================================================================
  // 4. LOGIQUE D'AUTHENTIFICATION (Auth Flow)
  // =================================================================

  /**
   * RÉHYDRATATION DE SESSION
   * Appelé au démarrage (APP_INITIALIZER). Vérifie le cookie HttpOnly.
   */
  fetchMe(): Observable<User | null> {
    return this.http.get<User>(`${this.authUrl}/me`, { withCredentials: true }).pipe(
      tap((user) => {
        console.log('✅ Session restaurée :', user);
        this._currentUser.set(user);
      }),
      catchError((err) => {
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
        // Redirection conditionnelle basée sur le rôle
        const target = user.plan === 'admin' ? '/admin' : '/profil';
        this.router.navigate([target]);
      })
    );
  }

  /**
   * INSCRIPTION
   */
  register(data: Register): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, data).pipe(
        tap((user) => {
            // Connexion automatique après inscription
            this._currentUser.set(user);
            this.router.navigate(['/profil']);
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
   * Helper pour nettoyer l'état local et rediriger
   */
  private finalizeLogout(): void {
    this._currentUser.set(null);
    this._adminUsersList.set([]); // On vide aussi la liste admin par sécurité
    this.router.navigate(['/login']);
  }


  // =================================================================
  // 5. GESTION PROFIL UTILISATEUR
  // =================================================================

  updateProfile(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/${id}`, data).pipe(
      tap(updatedUser => {
        // Si l'utilisateur modifié est celui connecté, on met à jour son état local
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