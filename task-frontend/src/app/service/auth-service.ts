import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface RegisterRequest {
  name: string,
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient){}

  register(request: RegisterRequest){}
}
