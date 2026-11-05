import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LoginRequest, LoginResponse, RegisterRequest } from "../models/auth.model";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'access_token';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => localStorage.setItem(this.TOKEN_KEY, response.access_token))
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getPayload(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(character =>
        '%' + ('00' + character.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const payload = this.getPayload();
    return !!payload && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  }

  isAdmin(): boolean {
    return this.getPayload()?.realm_access?.roles?.includes('SUPER-ADMIN-ROLE') ?? false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  register(request: RegisterRequest): Observable<void> {
  return this.http.post<void>(`${environment.apiUrl}/auth/register`, request);
}
}