import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UserInfo {
  username: string;
  roles: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';
  private currentUser$ = new BehaviorSubject<UserInfo | null>(null);

  constructor(private http: HttpClient) {
    // Restore user from token if exists
    this.restoreUserFromToken();
  }

  login(username: string, password: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, {
      username,
      password,
      email
    }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.restoreUserFromToken();
        }
      })
    );
  }

  signup(data: { username: string; password: string; email: string; adminSecret?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data, { responseType: 'text' });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser$.next(null);
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUser$.value;
  }

  getCurrentUser$(): Observable<UserInfo | null> {
    return this.currentUser$.asObservable();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes('ADMIN') : false;
  }

  private restoreUserFromToken() {
    const token = this.getToken();
    if (!token) {
      this.currentUser$.next(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: UserInfo = {
        username: payload.sub,
        roles: payload.roles || 'USER',
        email: payload.email
      };
      this.currentUser$.next(user);
    } catch (e) {
      this.currentUser$.next(null);
    }
  }

  getUserFromToken(): UserInfo | null {
    return this.getCurrentUser();
  }

  changePassword(currentPassword: string, newPassword: string): Observable<string> {
    const user = this.getCurrentUser();
    const headers: any = user?.username ? { 'X-User-Name': user.username } : {};
    return this.http.put(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword
    }, { responseType: 'text', headers });
  }
}
