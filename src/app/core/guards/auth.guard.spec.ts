import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: rSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is authenticated', async () => {
    authServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));

    const result = await guard.canActivate(null as any, null as any);

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', async () => {
    authServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));

    const result = await guard.canActivate(null as any, null as any);

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle authentication check error', async () => {
    authServiceSpy.isAuthenticated.and.returnValue(Promise.reject('Error'));

    const result = await guard.canActivate(null as any, null as any);

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
