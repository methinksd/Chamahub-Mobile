import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonProgressBar,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cash, 
  calendar, 
  checkmarkCircle, 
  documentText,
  arrowForward,
  download
} from 'ionicons/icons';
import { LoanService } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { NativeService } from '../../../core/services/native.service';
import { LoanApplication, LoanPayment } from '../../../core/models';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.page.html',
  styleUrls: ['./loan-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonProgressBar
  ]
})
export class LoanDetailsPage implements OnInit {
  loan: LoanApplication | null = null;
  payments: LoanPayment[] = [];
  isLoading = true;
  loanId!: number;
  chamaId!: number;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private loanService: LoanService,
    private authService: AuthService,
    private nativeService: NativeService,
    private toastController: ToastController
  ) {
    addIcons({ cash, calendar, checkmarkCircle, documentText, arrowForward, download });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loanId = parseInt(id, 10);
      await this.loadLoanDetails();
    }
  }

  async loadLoanDetails() {
    this.isLoading = true;
    try {
      this.chamaId = await this.authService.getUserId() || 0;
      
      this.loanService.getLoanById(this.loanId, this.chamaId).subscribe({
        next: (loan) => {
          this.loan = loan;
          this.loadPaymentHistory();
          this.isLoading = false;
        },
        error: async (err) => {
          console.error('Error loading loan details:', err);
          this.isLoading = false;
          await this.showToast('Failed to load loan details', 'danger');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.isLoading = false;
    }
  }

  loadPaymentHistory() {
    if (!this.loan) return;

    this.loanService.getPaymentsByLoan(this.loanId, this.chamaId).subscribe({
      next: (payments) => {
        this.payments = payments.sort((a, b) => 
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
        );
      },
      error: (err) => console.error('Error loading payments:', err)
    });
  }

  get statusColor(): string {
    if (!this.loan) return 'medium';
    switch (this.loan.status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'danger';
      default: return 'medium';
    }
  }

  get progressPercentage(): number {
    if (!this.loan || !this.loan.amount) return 0;
    const paid = (this.loan.amount || 0) - (this.loan.remainingBalance || 0);
    return (paid / this.loan.amount) * 100;
  }

  get totalPaid(): number {
    if (!this.loan) return 0;
    return (this.loan.amount || 0) - (this.loan.remainingBalance || 0);
  }

  get monthlyPayment(): number {
    if (!this.loan || !this.loan.amount || !this.loan.duration) return 0;
    const principal = this.loan.amount;
    const months = this.loan.duration;
    const interestRate = (this.loan.interestRate || 0) / 100;
    
    if (interestRate === 0) {
      return principal / months;
    }
    
    const monthlyRate = interestRate / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  }

  async makePayment() {
    if (!this.loan) return;
    
    await this.nativeService.hapticsImpactMedium();
    this.router.navigate(['/dashboard/tabs/payments'], {
      queryParams: { loanId: this.loan.id }
    });
  }

  async downloadStatement() {
    await this.nativeService.hapticsImpactLight();
    await this.showToast('Statement download feature coming soon', 'primary');
  }

  getPaymentStatusColor(status?: string): string {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'danger';
      default: return 'medium';
    }
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
