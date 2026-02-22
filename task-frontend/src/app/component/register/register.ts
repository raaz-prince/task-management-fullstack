import { Component } from '@angular/core';
import { RegisterRequest, AuthService } from '../../service/auth-service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
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

  constructor(private authService: AuthService){}

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }

    if(this.formData.password !== this.formData.confirmPassword){
      alert('Passwords do not match!');
      return;
    }

    const request: RegisterRequest = {
      name: this.formData.name,
      email: this.formData.email,
      password: this.formData.password
    }

    console.log(request);
  }
}
