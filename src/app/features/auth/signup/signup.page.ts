import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton,
  IonText, IonSpinner, IonBackButton, IonButtons, ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';
import { SignupRequest } from '../../../core/models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton,
    IonText, IonSpinner, IonBackButton, IonButtons
  ]
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() {}

  passwordsMatch(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSignUp() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      await this.showToast('Please fill all fields correctly', 'warning');
      return;
    }

    this.isLoading = true;

    const { fullName, username, email, password } = this.signupForm.value;
    const payload: SignupRequest = {
      fullName,
      username,
      email,
      password
    };

    console.log('🚀 Sending signup data:', payload);

    this.authService.signup(payload).subscribe({
      next: async (res) => {
        this.isLoading = false;
        console.log('✅ Signup successful:', res);
        
        await this.showToast('Account created successfully! Please login.', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
        }, 500);
      },
      error: async (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('❌ Signup error:', err);
        const message = err.error?.message || 'Signup failed. Please try again.';
        await this.showToast(message, 'danger');
      }
    });
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

  // Getters for form controls
  get fullName() { return this.signupForm.get('fullName'); }
  get username() { return this.signupForm.get('username'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get passwordMismatch() { return this.signupForm.hasError('passwordMismatch'); }
}

