import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { Auth } from '@core/services/auth';
import { AuthLayout } from '@shared/components/auth-layout';
import { DemoCredentials } from '@shared/components/demo-credentials';
import { emailValidator } from '@shared/utils/validator.util';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    AuthLayout,
    DemoCredentials,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  private messageService = inject(MessageService);

  protected isLoading = signal(false);

  protected loginForm = new FormGroup({
    email: new FormControl('admin@angular.com', [Validators.required, emailValidator()]),
    password: new FormControl('Admin2025!', [Validators.required]),
  });

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      const { email, password } = this.loginForm.value;
      const response = await this.auth.login(email!, password!);

      this.messageService.add({
        severity: 'success',
        summary: 'Login Successful',
        detail: `Welcome back, ${response.user.name}!`,
        life: 3000,
      });

      // Redirect based on role
      if (response.user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: err instanceof Error ? err.message : 'Invalid credentials',
        life: 5000,
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}
