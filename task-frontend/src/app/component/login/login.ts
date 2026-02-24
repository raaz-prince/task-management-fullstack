import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { LoginRequest } from '../../models/auth/login-request.model';
import { AuthResponse } from '../../models/auth/auth-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  formData = {
    email: '',
    password: ''
  };

  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onLogin(form: NgForm): void {

    if (form.invalid) {
      return;
    }

    const request: LoginRequest = {
      email: this.formData.email.trim(),
      password: this.formData.password
    };

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.login(request).subscribe({
      next: (res: AuthResponse) => {
        console.log('Login successful:', res.message);
        form.resetForm();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.errorMessage ||
          err?.error?.message ||
          'Login failed. Please try again.';
        console.error('Login error:', this.errorMessage);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}