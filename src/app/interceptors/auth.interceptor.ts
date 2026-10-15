import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

// implements HttpInterceptor: Інтерфейс із бібліотеки @angular/common/http. Він зобов'язує клас реалізувати єдиний метод — intercept()
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  // HttpHandler - містить посилання куди відправити запит далі ( при виклику return next.handle )
  // HttpRequest<any> - може мати люді параметри ріквесту:
  // у this.http.post<string>(`${this.baseUrl}/Events`, request) це буде (url, body)
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Отримуємо токен з AuthService
    const token = this.authService.getToken();

    // 2. Якщо токен є, клонуємо запит і додаємо заголовок Authorization
    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    // 3. Якщо токена немає (наприклад, при логіні/реєстрації) — відправляємо запит "як є"
    return next.handle(request);
  }
}
