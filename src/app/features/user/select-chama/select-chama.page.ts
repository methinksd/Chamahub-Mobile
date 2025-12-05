import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel,
  IonButton, IonIcon, IonInput, IonSpinner, IonText, IonRefresher,
  IonRefresherContent, IonButtons, IonMenuButton, IonBadge, ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { enter, addCircle, logOut, refresh, people } from 'ionicons/icons';
import { ChamaService } from '../../../core/services/chama.service';
import { AuthService } from '../../../core/services/auth.service';
import { Chama } from '../../../core/models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-select-chama',
  templateUrl: './select-chama.page.html',
  styleUrls: ['./select-chama.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel,
    IonButton, IonIcon, IonInput, IonSpinner, IonRefresher,
    IonRefresherContent, IonButtons, IonBadge
  ]
})
export class SelectChamaPage implements OnInit {
  chamas: Chama[] = [];
  joinCode: string = '';
  isLoading = false;
  isJoining = false;

  constructor(
    private chamaService: ChamaService,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ enter, addCircle, logOut, refresh, people });
  }

  ngOnInit() {
    this.loadChamas();
  }

  async loadChamas(event?: any) {
    this.isLoading = !event; // Show spinner only if not pull-to-refresh

    this.chamaService.getMyChamas().subscribe({
      next: async (data) => {
        this.chamas = data;
        this.isLoading = false;
        
        if (event) {
          event.target.complete();
        }

        console.log('✅ Loaded chamas:', data);
      },
      error: async (err: HttpErrorResponse) => {
        this.isLoading = false;
        
        if (event) {
          event.target.complete();
        }

        console.error('❌ Failed to load chamas:', err);
        await this.showToast('Failed to load your chamas', 'danger');
      }
    });
  }

  async enterChama(chama: Chama) {
    console.log('👉 Entering chama:', chama);
    
    await this.authService.setActiveChamaId(chama.id);
    await this.showToast(`Entered ${chama.name}`, 'success');
    
    this.router.navigate(['/dashboard'], { replaceUrl: true });
  }

  async joinChama() {
    if (!this.joinCode.trim()) {
      await this.showToast('Please enter a join code', 'warning');
      return;
    }

    this.isJoining = true;

    this.chamaService.joinChama(this.joinCode).subscribe({
      next: async (newChama: Chama) => {
        this.isJoining = false;
        this.joinCode = '';
        
        console.log('✅ Joined chama:', newChama);
        
        await this.authService.setActiveChamaId(newChama.id);
        await this.showToast(`Successfully joined ${newChama.name}!`, 'success');
        
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: async (err: HttpErrorResponse) => {
        this.isJoining = false;
        console.error('❌ Failed to join chama:', err);
        
        const message = err.error?.message || 'Invalid join code or failed to join chama';
        await this.showToast(message, 'danger');
      }
    });
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          role: 'confirm',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    await this.authService.logout();
    await this.showToast('Logged out successfully', 'success');
    this.router.navigate(['/login'], { replaceUrl: true });
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

  handleRefresh(event: any) {
    this.loadChamas(event);
  }
}

