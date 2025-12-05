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
import { home, cash, card, person } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { ChamaService } from '../../../core/services/chama.service';
import { LoanService } from '../../../core/services/loan.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
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
export class UserDashboardPage implements OnInit {
  pendingPaymentsCount = 0;

  constructor(
    private authService: AuthService,
    private chamaService: ChamaService,
    private loanService: LoanService,
    private router: Router
  ) {
    addIcons({ home, cash, card, person });
  }

  async ngOnInit() {
    await this.loadDashboardData();
  }

  private async loadDashboardData() {
    try {
      // Load pending payments count for badge
      const userId = await this.authService.getUserId();
      if (userId) {
        const loans = await this.loanService.getUserApplications(userId).toPromise();
        this.pendingPaymentsCount = loans?.filter(l => l.status === 'APPROVED' && l.balance > 0).length || 0;
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }
}
