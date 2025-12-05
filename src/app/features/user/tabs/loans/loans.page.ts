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
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  RefresherCustomEvent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, checkmarkCircle, timeOutline, closeCircle, cash } from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { LoanService } from '../../../../core/services/loan.service';
import { LoanApplication } from '../../../../core/models';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.page.html',
  styleUrls: ['./loans.page.scss'],
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
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonSpinner
  ]
})
export class LoansPage implements OnInit {
  loans: LoanApplication[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private router: Router
  ) {
    addIcons({ add, checkmarkCircle, timeOutline, closeCircle, cash });
  }

  async ngOnInit() {
    await this.loadLoans();
  }

  async loadLoans() {
    this.isLoading = true;
    try {
      const userId = await this.authService.getUserId();
      if (userId) {
        this.loanService.getUserApplications(userId).subscribe({
          next: (loans) => {
            this.loans = loans.sort((a, b) => 
              new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
            );
          },
          error: (err) => console.error('Error loading loans:', err)
        });
      }
    } catch (error) {
      console.error('Error loading loans:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async handleRefresh(event: RefresherCustomEvent) {
    await this.loadLoans();
    event.target.complete();
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'medium';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'checkmark-circle';
      case 'pending': return 'time-outline';
      case 'rejected': return 'close-circle';
      default: return 'cash';
    }
  }

  applyForLoan() {
    // TODO: Navigate to loan application form
    console.log('Apply for loan');
  }

  viewLoanDetails(loan: LoanApplication) {
    // TODO: Navigate to loan details page
    console.log('View loan details:', loan);
  }
}
