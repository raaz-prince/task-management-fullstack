import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { RegisterRequest } from '../../models/auth/register-request.model';
import { AuthResponse } from '../../models/auth/auth-response.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isSubmitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(form: NgForm): void {

    if (form.invalid) {
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      console.warn('Passwords do not match');
      return;
    }

    const request: RegisterRequest = {
      name: this.formData.name.trim(),
      email: this.formData.email.trim(),
      password: this.formData.password
    };

    this.isSubmitting = true;

    this.authService.register(request).subscribe({
      next: (res: AuthResponse) => {
        console.log('Registration successful:', res.message);
        form.resetForm();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Registration failed:', err?.error?.message || err.message);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}