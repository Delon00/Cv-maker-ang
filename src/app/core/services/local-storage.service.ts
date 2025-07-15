import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private authToken: string = 'authToken';

  constructor() { }

  createToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(this.authToken, token);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.authToken);
  }

  destroyToken(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(this.authToken);
  }
}
