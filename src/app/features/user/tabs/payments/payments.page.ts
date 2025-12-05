import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  ToastController,
  RefresherCustomEvent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { card, calculator } from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { LoanService } from '../../../../core/services/loan.service';
import { LoanApplication, LoanPayment } from '../../../../core/models';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonSpinner
  ]
})
export class PaymentsPage implements OnInit {
  activeLoans: LoanApplication[] = [];
  selectedLoanId: number | null = null;
  paymentAmount: number | null = null;
  isLoading = true;
  isProcessing = false;

  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private toastController: ToastController
  ) {
    addIcons({ card, calculator });
  }

  async ngOnInit() {
    await this.loadActiveLoans();
  }

  async loadActiveLoans() {
    this.isLoading = true;
    try {
      const userId = await this.authService.getUserId();
      if (userId) {
        this.loanService.getUserApplications(userId).subscribe({
          next: (loans) => {
            this.activeLoans = loans.filter(l => l.status === 'APPROVED' && l.balance > 0);
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
    await this.loadActiveLoans();
    event.target.complete();
  }

  get selectedLoan(): LoanApplication | undefined {
    return this.activeLoans.find(l => l.id === this.selectedLoanId);
  }

  setFullPayment() {
    if (this.selectedLoan) {
      this.paymentAmount = this.selectedLoan.balance;
    }
  }

  setMonthlyPayment() {
    if (this.selectedLoan && this.selectedLoan.monthlyPayment) {
      this.paymentAmount = this.selectedLoan.monthlyPayment;
    }
  }

  async makePayment() {
    if (!this.selectedLoanId || !this.paymentAmount) {
      await this.showToast('Please select a loan and enter payment amount', 'warning');
      return;
    }

    if (this.paymentAmount <= 0) {
      await this.showToast('Payment amount must be greater than zero', 'warning');
      return;
    }

    if (this.selectedLoan && this.paymentAmount > this.selectedLoan.balance) {
      await this.showToast('Payment amount cannot exceed loan balance', 'warning');
      return;
    }

    this.isProcessing = true;
    try {
      const payment: Partial<LoanPayment> = {
        loanId: this.selectedLoanId,
        amount: this.paymentAmount,
        paymentDate: new Date().toISOString()
      };

      this.loanService.makePayment(payment).subscribe({
        next: async () => {
          await this.showToast('Payment submitted successfully!', 'success');
          this.selectedLoanId = null;
          this.paymentAmount = null;
          await this.loadActiveLoans();
        },
        error: async (err: any) => {
          console.error('Error making payment:', err);
          await this.showToast('Failed to process payment. Please try again.', 'danger');
        }
      });
    } catch (error) {
      console.error('Error making payment:', error);
      await this.showToast('An error occurred. Please try again.', 'danger');
    } finally {
      this.isProcessing = false;
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
