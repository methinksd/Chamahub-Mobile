import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const isAuthenticated = await this.authService.isAuthenticated();
    
    if (!isAuthenticated) {
      console.warn('🚫 Not authenticated. Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }

    // Extra check for user routes that require a chama
    const url = state.url;
    const role = await this.authService.getRole();

    if (role === 'user') {
      const activeChamaId = await this.authService.getActiveChamaId();
      if (!activeChamaId && url !== '/select-chama') {
        console.warn('⚠️ No active chama. Redirecting to select-chama.');
        this.router.navigate(['/select-chama']);
        return false;
      }
    }

    return true;
  }
}
