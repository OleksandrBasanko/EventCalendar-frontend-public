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

  // Перевіряє наявність токена у локальному сховищі браузера.
  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  // Універсальний приватний метод для відправки POST-запитів на бекенд у форматі JSON
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
    localStorage.setItem(TOKEN_KEY, token); // Зберігає токен у localStorage
    const decoded = this.decodeToken(token); // розшифровує його (decodeToken)

    // Сповіщає весь застосунок через .next() про те, що користувач увійшов (isLoggedInSubject = true) та передає його нову роль у roleSubject
    this.isLoggedInSubject.next(true);
    this.roleSubject.next(decoded?.role || null);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedInSubject.next(false);
    this.roleSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Повертає чистий рядок токена з localStorage (потрібно для HttpInterceptor, який додає заголовок Authorization: Bearer <token>)
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Синхронно перевіряє, чи залогінений користувач у даний момент
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Витягує унікальний ID користувача з поля sub (Subject) JWT-токена
  getUserId(): string | null {
    return this.getUser()?.sub || null;
  }

  // Отримує токен зі сховища та розшифровує його у об'єкт DecodedToken
  getUser(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  // Перевіряє, чи має користувач конкретну роль (наприклад, hasRole('admin'))
  hasRole(role: string): boolean {
    return this.getUser()?.role === role;
  }

  // Використовує зовнішню бібліотеку jwt-decode для розпаршування Base64-рядка токена і перетворення його на JS-об'єкт. Якщо токен битий або пошкоджений, обробляє помилку та повертає null
  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }
}
