import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChart, cash, people, checkmarkCircle } from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { LoanService } from '../../../../core/services/loan.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
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
    IonGrid,
    IonRow,
    IonCol,
    IonIcon
  ]
})
export class ReportsPage implements OnInit {
  stats = {
    totalLoans: 0,
    totalDisbursed: 0,
    totalRepaid: 0,
    activeLoans: 0,
    defaultRate: 0
  };
  chamaId = 0;

  constructor(
    private authService: AuthService,
    private loanService: LoanService
  ) {
    addIcons({ statsChart, cash, people, checkmarkCircle });
  }

  async ngOnInit() {
    await this.loadReports();
  }

  async loadReports() {
    try {
      this.chamaId = await this.authService.getUserId() || 0;
      
      this.loanService.getAllApplications(this.chamaId).subscribe({
        next: (loans) => {
          this.stats.totalLoans = loans.length;
          this.stats.activeLoans = loans.filter(l => l.status === 'APPROVED').length;
          this.stats.totalDisbursed = loans
            .filter(l => l.status === 'APPROVED')
            .reduce((sum, l) => sum + (l.amount || 0), 0);
          
          const approvedLoans = loans.filter(l => l.status === 'APPROVED');
          this.stats.totalRepaid = approvedLoans.reduce((sum, l) => {
            const paid = (l.amount || 0) - (l.remainingBalance || 0);
            return sum + paid;
          }, 0);
        },
        error: (err) => console.error('Error loading reports:', err)
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
