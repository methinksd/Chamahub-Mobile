import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Convert the async token retrieval to Observable
    return from(this.authService.getAuthToken()).pipe(
      switchMap(token => {
        // Clone the request and add the authorization header if token exists
        const clonedRequest = token
          ? req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            })
          : req;

        // Pass the request to the next handler and handle errors
        return next.handle(clonedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Unauthorized - token might be invalid or expired
              console.error('🚫 Unauthorized request. Redirecting to login...');
              this.authService.logout();
              this.router.navigate(['/login']);
            } else if (error.status === 403) {
              // Forbidden - user doesn't have permission
              console.error('🚫 Forbidden. Insufficient permissions.');
            } else if (error.status === 0) {
              // Network error - backend might be down
              console.error('❌ Network error. Cannot reach server.');
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}
