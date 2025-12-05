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
  AlertController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, mail, call, business, logOut, settings, shield, camera, images } from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { ChamaService } from '../../../../core/services/chama.service';
import { CameraService } from '../../../../core/services/camera.service';
import { NativeService } from '../../../../core/services/native.service';

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
  profilePhotoPath = '';
  isLoading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chamaService: ChamaService,
    private cameraService: CameraService,
    private nativeService: NativeService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({ person, mail, call, business, logOut, settings, shield, camera, images });
  }

  async ngOnInit() {
    await this.loadProfile();
    await this.loadProfilePhoto();
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

  async loadProfilePhoto() {
    const userId = await this.authService.getUserId();
    if (userId) {
      const photoPath = await this.cameraService.loadPhoto(`profile_${userId}`);
      this.profilePhotoPath = photoPath || '';
    }
  }

  async changeProfilePhoto() {
    await this.nativeService.hapticsImpactLight();
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Change Profile Photo',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: async () => {
            await this.takePhoto();
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'images',
          handler: async () => {
            await this.pickPhoto();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });

    await actionSheet.present();
  }

  private async takePhoto() {
    try {
      const userId = await this.authService.getUserId();
      if (!userId) return;

      const photoPath = await this.cameraService.takePhoto(`profile_${userId}`);
      if (photoPath) {
        this.profilePhotoPath = photoPath;
        await this.nativeService.hapticsNotificationSuccess();
        await this.nativeService.showToast('Profile photo updated', 'short');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      await this.nativeService.showToast('Failed to capture photo', 'short');
    }
  }

  private async pickPhoto() {
    try {
      const userId = await this.authService.getUserId();
      if (!userId) return;

      const photoPath = await this.cameraService.pickPhoto(`profile_${userId}`);
      if (photoPath) {
        this.profilePhotoPath = photoPath;
        await this.nativeService.hapticsNotificationSuccess();
        await this.nativeService.showToast('Profile photo updated', 'short');
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      await this.nativeService.showToast('Failed to select photo', 'short');
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
