import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../service/auth/auth-service';
import { LoginRequest } from '../../models/auth/login/login-request.model';
import { ToastrService } from 'ngx-toastr';

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
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  onLogin(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const request: LoginRequest = {
      email: this.formData.email,
      password: this.formData.password,
    };

    console.log(request);

    this.authService.login(request).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Success', { timeOut: 2000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.errorMessage || 'Login failed', 'Error');
      },
    });
  }
}
