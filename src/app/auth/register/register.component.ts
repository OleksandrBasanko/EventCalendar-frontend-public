import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  userName = '';
  firstName = '';
  secondName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  isLoading = false;
  passwordsMismatch = false;
  registrationErrors: string[] = [];

  constructor(private auth: AuthService, private router: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Реєстрація');
  }

  register() {
    this.passwordsMismatch = false;
    this.registrationErrors = [];

    if (this.password !== this.confirmPassword) {
      this.passwordsMismatch = true;
      return;
    }

    this.isLoading = true;

    this.auth
      .register({
        userName: this.userName,
        firstName: this.firstName,
        secondName: this.secondName,
        email: this.email,
        phone: this.phone,
        password: this.password,
      })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.token) {
            this.auth.setToken(res.token);
            this.router.navigate(['/events']);
          } else {
            this.router.navigate(['/login'], { queryParams: { registered: true } });
          }
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 400 && error.error?.errors) {
            this.registrationErrors = Object.values(error.error.errors).flat() as string[];
          } else {
            console.error('Register error:', error);
            this.registrationErrors = ['Виникла помилка під час реєстрації. Спробуйте ще раз'];
          }
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
