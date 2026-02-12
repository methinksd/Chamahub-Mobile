import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { environment } from '../../../../environments/environment';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  notifications, 
  moon, 
  shield, 
  information,
  chevronForward,
  globe
} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class SettingsPage {
  notificationsEnabled = true;
  darkMode = false;

  constructor(private router: Router) {
    addIcons({ notifications, moon, shield, information, chevronForward, globe });
  }

  toggleNotifications(event: any) {
    this.notificationsEnabled = event.detail.checked;
    // TODO: Save to preferences and update push notification status
  }

  toggleDarkMode(event: any) {
    this.darkMode = event.detail.checked;
    // TODO: Implement theme switching
    document.body.classList.toggle('dark', this.darkMode);
  }

  navigateToAbout() {
    // TODO: Navigate to about page
  }

  navigateToPrivacy() {
    // TODO: Navigate to privacy policy
  }

  async openWebVersion() {
    await Browser.open({ url: environment.webAppUrl });
  }
}
