import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../service/auth/auth-service';


// URLs that should NOT have Authorization header
const SKIP_AUTH_URLS: string[] = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh'
];


// Helper function to check if request should skip token
function shouldSkip(req: HttpRequest<unknown>): boolean {
  return SKIP_AUTH_URLS.some(url => req.url.includes(url));
}


// Functional interceptor
export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const authService = inject(AuthService);
  const router = inject(Router);

  let authReq = req;

  const token = authService.getToken();

  // Attach token if available and not a skip URL
  if (token && !shouldSkip(req)) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((err) => {

      if (err.status === 401 || err.status === 403) {
        authService.removeToken();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};