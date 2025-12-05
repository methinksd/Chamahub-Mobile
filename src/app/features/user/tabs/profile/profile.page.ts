import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonAvatar,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, mail, call, business, logOut, settings, shield } from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { ChamaService } from '../../../../core/services/chama.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonAvatar
  ]
})
export class ProfilePage implements OnInit {
  userName = '';
  userEmail = '';
  userPhone = '';
  chamaName = '';
  userRole = '';
  isLoading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chamaService: ChamaService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ person, mail, call, business, logOut, settings, shield });
  }

  async ngOnInit() {
    await this.loadProfile();
  }

  async loadProfile() {
    this.isLoading = true;
    try {
      // Get user details
      const username = await this.authService.getUsername();
      this.userName = username || 'User';

      const userId = await this.authService.getUserId();
      if (userId) {
        this.userService.getUserById(userId).subscribe({
          next: (user) => {
            this.userEmail = user.email || '';
            this.userPhone = user.phoneNumber || '';
            this.userRole = user.role || '';
          },
          error: (err) => console.error('Error loading user:', err)
        });
      }

      // Get chama details
      const chamaId = await this.authService.getChamaId();
      if (chamaId) {
        this.chamaService.getChamaById(chamaId).subscribe({
          next: (chama) => {
            this.chamaName = chama.name;
          },
          error: (err) => console.error('Error loading chama:', err)
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
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
    this.router.navigate(['/login']);
  }
}
