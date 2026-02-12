import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  checkmarkCircle, 
  people, 
  statsChart, 
  home 
} from 'ionicons/icons';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonBadge
  ]
})
export class AdminDashboardPage implements OnInit {
  pendingLoansCount = 0;

  constructor(private router: Router) {
    addIcons({ checkmarkCircle, people, statsChart, home });
  }

  ngOnInit() {
    // Load pending loans count
    this.loadPendingCount();
  }

  loadPendingCount() {
    // TODO: Implement actual pending loans count
    this.pendingLoansCount = 0;
  }
}
