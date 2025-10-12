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

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    AuthLayout,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);
  private messageService = inject(MessageService);

  protected isLoading = signal(false);

  protected registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Passwords do not match',
        life: 5000,
      });
      return;
    }

    this.isLoading.set(true);

    try {
      const { name, email, password: pwd } = this.registerForm.value;
      const response = await this.auth.register(name!, email!, pwd!);

      this.messageService.add({
        severity: 'success',
        summary: 'Registration Successful',
        detail: `Welcome, ${response.user.name}! You can now log in.`,
        life: 3000,
      });

      // Redirect to dashboard
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Registration Failed',
        detail: err instanceof Error ? err.message : 'Registration failed',
        life: 5000,
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}
