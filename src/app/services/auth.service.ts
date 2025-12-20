import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:18080/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string, email: string) {
  return this.http.post<any>('http://localhost:18080/auth/login', {
    username,
    password,
    email
  });
}

getUserFromToken(): { username: string; role: string; email: string } | null {
  const token = this.getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return {
    username: payload.sub,
    role: payload.role,
    email: payload.email
  };
}


setToken(token: string) {
  localStorage.setItem('token', token);
}

  signup(data: { username: string; password: string ; email: string }) {
    return this.http.post(`${this.baseUrl}/signup`,  data,
    { responseType: 'text' });
  }


  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
