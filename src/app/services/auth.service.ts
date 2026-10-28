import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, LoginRequest, RegisterRequest } from '../auth/auth.models';

const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseURL = '/api/Auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(this.getUser()?.role || null);
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  private postData(url: string, payload: any): Observable<any> {
    // HttpParams() - прихована інформація для серверу (інстуркція)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.baseURL}${url}`, payload, { headers });
  }

  login(payload: LoginRequest): Observable<any> {
    return this.postData('/login', payload);
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.postData('/register', payload);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    const decoded = this.decodeToken(token);

    this.isLoggedInSubject.next(true);
    this.roleSubject.next(decoded?.role || null);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedInSubject.next(false);
    this.roleSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserId(): string | null {
    return this.getUser()?.sub || null;
  }

  getUser(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  hasRole(role: string): boolean {
    return this.getUser()?.role === role;
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }
}
