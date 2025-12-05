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
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  RefresherCustomEvent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cash, people, wallet, arrowForward } from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { ChamaService } from '../../../../core/services/chama.service';
import { LoanService } from '../../../../core/services/loan.service';
import { NativeService } from '../../../../core/services/native.service';
import { Chama } from '../../../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    IonRefresher,
    IonRefresherContent,
    IonSpinner
  ]
})
export class HomePage implements OnInit {
  userName = '';
  currentChama: Chama | null = null;
  activeLoansCount = 0;
  totalLoanBalance = 0;
  nextPaymentDue = '';
  isLoading = true;

  constructor(
    private authService: AuthService,
    private chamaService: ChamaService,
    private loanService: LoanService,
    private nativeService: NativeService,
    private router: Router
  ) {
    addIcons({ cash, people, wallet, arrowForward });
  }

  async ngOnInit() {
    await this.loadHomeData();
  }

  async loadHomeData() {
    this.isLoading = true;
    try {
      // Get user name
      const username = await this.authService.getUsername();
      this.userName = username || 'User';

      // Get current chama
      const chamaId = await this.authService.getChamaId();
      if (chamaId) {
        this.chamaService.getChamaById(chamaId).subscribe({
          next: (chama) => {
            this.currentChama = chama;
          },
          error: (err) => console.error('Error loading chama:', err)
        });
      }

      // Get loan statistics
      const userId = await this.authService.getUserId();
      if (userId) {
        this.loanService.getUserApplications(userId).subscribe({
          next: (loans) => {
            const activeLoans = loans.filter(l => l.status === 'APPROVED' && l.balance > 0);
            this.activeLoansCount = activeLoans.length;
            this.totalLoanBalance = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
            
            // Find next payment due (simplified - would need actual payment schedule)
            if (activeLoans.length > 0) {
              const nextMonth = new Date();
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              this.nextPaymentDue = nextMonth.toLocaleDateString();
            }
          },
          error: (err) => console.error('Error loading loans:', err)
        });
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async handleRefresh(event: RefresherCustomEvent) {
    await this.nativeService.hapticsImpactLight();
    await this.loadHomeData();
    event.target.complete();
  }

  async navigateToLoans() {
    await this.nativeService.hapticsImpactMedium();
    this.router.navigate(['/dashboard/loans']);
  }

  async navigateToPayments() {
    await this.nativeService.hapticsImpactMedium();
    this.router.navigate(['/dashboard/payments']);
  }
}
