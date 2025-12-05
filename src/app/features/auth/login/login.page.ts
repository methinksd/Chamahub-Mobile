import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton,
  IonText, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';
import { NativeService } from '../../../core/services/native.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton,
    IonText, IonSpinner
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private nativeService: NativeService,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Check if already logged in
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const isAuth = await this.authService.isAuthenticated();
    if (isAuth) {
      const role = await this.authService.getRole();
      if (role === 'admin') {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      } else {
        this.router.navigate(['/select-chama'], { replaceUrl: true });
      }
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      await this.nativeService.hapticsImpactMedium();
      this.isLoading = true;

      const loginData = {
        identifier: this.loginForm.value.identifier,
        password: this.loginForm.value.password
      };

      console.log('🚀 Sending login data:', loginData);

      this.authService.login(loginData).subscribe({
        next: async (res) => {
          console.log('🔁 Full login response:', res);
          this.isLoading = false;

          const token = res.token || null;
          const role = (res.role || 'user').toLowerCase();

          if (token) {
            await this.nativeService.hapticsNotificationSuccess();
            await this.showToast('Login successful!', 'success');

            // Small delay to ensure token is saved
            setTimeout(() => {
              if (role === 'admin') {
                console.log('✅ Admin login success! Redirecting to Dashboard...');
                this.router.navigate(['/dashboard'], { replaceUrl: true });
              } else if (role === 'user') {
                console.log('✅ User login success! Redirecting to Select Chama...');
                this.router.navigate(['/select-chama'], { replaceUrl: true });
              } else {
                console.warn('⚠️ Unknown role:', role);
                this.router.navigate(['/login'], { replaceUrl: true });
              }
            }, 100);
          } else {
            console.error('❌ No token received in response!');
            await this.nativeService.hapticsNotificationError();
            await this.showToast('Login failed: no token received', 'danger');
          }
        },
        error: async (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('❌ Login error:', err);
          await this.nativeService.hapticsNotificationError();
          const message = err.error?.message || 'Invalid credentials. Please try again.';
          await this.showToast(message, 'danger');
        }
      });
    }
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  get identifier() {
    return this.loginForm.get('identifier');
  }

  get password() {
    return this.loginForm.get('password');
  }
}

