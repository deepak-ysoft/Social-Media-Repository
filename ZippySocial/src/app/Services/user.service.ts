import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `https://localhost:7071/api/Home/`;

  http = inject(HttpClient);
  constructor() {}
  loginService(data: any) {
    debugger;
    return this.http.post(`${this.baseUrl}Login`, data);
  }

  registerUser(user: FormData) {debugger;
    return this.http.post(`${this.baseUrl}Register`, user);
  }

  getUser() {debugger;
    return this.http.get(`${this.baseUrl}GetUsers`);
  }

  storeToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
