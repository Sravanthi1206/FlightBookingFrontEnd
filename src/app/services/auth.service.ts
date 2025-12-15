import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:18080/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
  return this.http.post<any>('http://localhost:18080/auth/login', {
    username,
    password
  });
}

setToken(token: string) {
  localStorage.setItem('token', token);
}

  signup(data: { username: string; password: string }) {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }


  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
