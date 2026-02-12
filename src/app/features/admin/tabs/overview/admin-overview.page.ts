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
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  RefresherCustomEvent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cash, 
  people, 
  checkmarkCircle, 
  statsChart,
  timeOutline,
  arrowForward
} from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { LoanService } from '../../../../core/services/loan.service';
import { ChamaService } from '../../../../core/services/chama.service';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.page.html',
  styleUrls: ['./admin-overview.page.scss'],
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
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class AdminOverviewPage implements OnInit {
  stats = {
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    totalMembers: 0,
    totalLoanAmount: 0,
    outstandingBalance: 0
  };
  isLoading = true;
  chamaId = 0;

  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private chamaService: ChamaService,
    private router: Router
  ) {
    addIcons({ cash, people, checkmarkCircle, statsChart, timeOutline, arrowForward });
  }

  async ngOnInit() {
    await this.loadStats();
  }

  async loadStats() {
    this.isLoading = true;
    try {
      this.chamaId = await this.authService.getUserId() || 0;
      
      // Load all loans to calculate stats
      this.loanService.getAllApplications(this.chamaId).subscribe({
        next: (loans) => {
          this.stats.totalLoans = loans.length;
          this.stats.pendingLoans = loans.filter(l => l.status === 'PENDING').length;
          this.stats.approvedLoans = loans.filter(l => l.status === 'APPROVED').length;
          this.stats.totalLoanAmount = loans.reduce((sum, l) => sum + (l.amount || 0), 0);
          this.stats.outstandingBalance = loans
            .filter(l => l.status === 'APPROVED')
            .reduce((sum, l) => sum + (l.remainingBalance || 0), 0);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading stats:', err);
          this.isLoading = false;
        }
      });

      // Load member count (placeholder)
      this.stats.totalMembers = 0; // TODO: Implement member count API
    } catch (error) {
      console.error('Error:', error);
      this.isLoading = false;
    }
  }

  async handleRefresh(event: RefresherCustomEvent) {
    await this.loadStats();
    event.target.complete();
  }

  navigateToApprovals() {
    this.router.navigate(['/admin/tabs/loan-approvals']);
  }

  navigateToMembers() {
    this.router.navigate(['/admin/tabs/members']);
  }

  navigateToReports() {
    this.router.navigate(['/admin/tabs/reports']);
  }
}
