import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginPage } from './login.page';
import { AuthService } from '../../../core/services/auth.service';
import { NativeService } from '../../../core/services/native.service';
import { ToastController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let nativeServiceSpy: jasmine.SpyObj<NativeService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'getChamaId']);
    const nativeSpy = jasmine.createSpyObj('NativeService', [
      'hapticsImpactMedium',
      'hapticsNotificationSuccess',
      'hapticsNotificationError'
    ]);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);

    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: NativeService, useValue: nativeSpy },
        { provide: Router, useValue: rSpy },
        { provide: ToastController, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    nativeServiceSpy = TestBed.inject(NativeService) as jasmine.SpyObj<NativeService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize with invalid form', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should require identifier', () => {
      const identifier = component.loginForm.get('identifier');
      expect(identifier?.valid).toBeFalsy();
      expect(identifier?.hasError('required')).toBeTruthy();
    });

    it('should be valid when fields are filled correctly', () => {
      component.loginForm.patchValue({
        identifier: 'testuser',
        password: 'password123'
      });
      expect(component.loginForm.valid).toBeTruthy();
    });
  });

  describe('Login Functionality', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        identifier: 'testuser',
        password: 'password123'
      });
    });

    it('should not submit when form is invalid', () => {
      component.loginForm.patchValue({ identifier: '', password: '' });
      
      component.onSubmit();
      
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should handle login error', fakeAsync(() => {
      const mockError = { error: { message: 'Invalid credentials' } };

      authServiceSpy.login.and.returnValue(throwError(() => mockError));
      nativeServiceSpy.hapticsImpactMedium.and.returnValue(Promise.resolve());
      nativeServiceSpy.hapticsNotificationError.and.returnValue(Promise.resolve());

      const toastMock = {
        present: jasmine.createSpy('present')
      };
      toastControllerSpy.create.and.returnValue(Promise.resolve(toastMock as any));

      component.onSubmit();
      tick();

      expect(component.isLoading).toBe(false);
      expect(nativeServiceSpy.hapticsNotificationError).toHaveBeenCalled();
    }));
  });
});
