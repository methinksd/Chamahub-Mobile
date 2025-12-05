import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const isAuthenticated = await this.authService.isAuthenticated();
    const role = await this.authService.getRole();

    console.log('🔐 AdminGuard - Role:', role, '| Authenticated:', isAuthenticated);

    if (isAuthenticated && role === 'admin') {
      return true;
    } else {
      console.warn('🚫 Access denied. Redirecting...');
      if (isAuthenticated) {
        // Normal user trying to access admin routes
        this.router.navigate(['/select-chama']);
      } else {
        // Not logged in
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
}
