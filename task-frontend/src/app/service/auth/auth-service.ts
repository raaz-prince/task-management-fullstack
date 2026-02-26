import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, tap, throwError } from 'rxjs';
import { RegisterRequest } from '../../models/auth/register/register-request.model';
import { RegisterResponse } from '../../models/auth/register/register-response.model';
import { LoginRequest } from '../../models/auth/login/login-request.model';
import { LoginResponse } from '../../models/auth/login/login-respone.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'jwt';

  constructor(
    private readonly http: HttpClient
  ) {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
  return this.http
    .post<RegisterResponse>(
      `${this.API_URL}/register`,
       data
      );
}

login(data: LoginRequest): Observable<LoginResponse> {
  return this.http
    .post<LoginResponse>(`${this.API_URL}/login`, data)
    .pipe(
      tap((response) => {
        this.storeToken(response.token);
      })
    );
}

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private storeToken(token?: string): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }
}
