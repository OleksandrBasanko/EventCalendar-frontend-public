import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  showPassword = false;
  invalidCredentials = false;
  isLoading = false;
  registrationErrors: string[] = [];

  constructor(private auth: AuthService, private router: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Авторизація');
  }

  login() {
    this.isLoading = true;
    this.invalidCredentials = false;
    this.registrationErrors = [];

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      // якщо сервер повернув 200 OK
      next: (res: any) => {
        this.isLoading = false;
        this.auth.setToken(res.token); // Зберігаємо токен у localStorage та оновлюємо стан
        this.router.navigate(['/events']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.invalidCredentials = true;
        } else {
          console.error('Login error:', error);
          this.registrationErrors = ['Виникла помилка під час логіну. Спробуйте ще раз'];
        }
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
