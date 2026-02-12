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
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal,
  IonTextarea,
  IonButtons,
  ToastController,
  AlertController,
  RefresherCustomEvent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  checkmarkCircle, 
  closeCircle, 
  timeOutline,
  cash,
  calendar,
  person
} from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { LoanService } from '../../../../core/services/loan.service';
import { NativeService } from '../../../../core/services/native.service';
import { LoanApplication } from '../../../../core/models';

@Component({
  selector: 'app-loan-approvals',
  templateUrl: './loan-approvals.page.html',
  styleUrls: ['./loan-approvals.page.scss'],
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
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonModal,
    IonTextarea,
    IonButtons
  ]
})
export class LoanApprovalsPage implements OnInit {
  loans: LoanApplication[] = [];
  filteredLoans: LoanApplication[] = [];
  selectedFilter = 'PENDING';
  isLoading = true;
  chamaId = 0;
  
  // Rejection modal
  showRejectModal = false;
  selectedLoan: LoanApplication | null = null;
  rejectionReason = '';

  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private nativeService: NativeService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ checkmarkCircle, closeCircle, timeOutline, cash, calendar, person });
  }

  async ngOnInit() {
    await this.loadLoans();
  }

  async loadLoans() {
    this.isLoading = true;
    try {
      this.chamaId = await this.authService.getUserId() || 0;
      
      this.loanService.getAllApplications(this.chamaId).subscribe({
        next: (loans) => {
          this.loans = loans.sort((a, b) => 
            new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
          );
          this.filterLoans();
          this.isLoading = false;
        },
        error: async (err) => {
          console.error('Error loading loans:', err);
          await this.showToast('Failed to load loan applications', 'danger');
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.isLoading = false;
    }
  }

  filterLoans() {
    if (this.selectedFilter === 'ALL') {
      this.filteredLoans = this.loans;
    } else {
      this.filteredLoans = this.loans.filter(loan => loan.status === this.selectedFilter);
    }
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.filterLoans();
  }

  async handleRefresh(event: RefresherCustomEvent) {
    await this.loadLoans();
    event.target.complete();
  }

  async approveLoan(loan: LoanApplication) {
    const alert = await this.alertController.create({
      header: 'Approve Loan',
      message: `Approve loan application for KES ${loan.amount?.toLocaleString()}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Approve',
          handler: async () => {
            await this.updateLoanStatus(loan.id, 'APPROVED');
          }
        }
      ]
    });

    await alert.present();
  }

  openRejectModal(loan: LoanApplication) {
    this.selectedLoan = loan;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedLoan = null;
    this.rejectionReason = '';
  }

  async confirmReject() {
    if (!this.selectedLoan || !this.rejectionReason.trim()) {
      await this.showToast('Please provide a rejection reason', 'warning');
      return;
    }

    await this.updateLoanStatus(this.selectedLoan.id, 'REJECTED', this.rejectionReason);
    this.closeRejectModal();
  }

  private async updateLoanStatus(loanId: number, status: string, reason?: string) {
    try {
      await this.nativeService.hapticsImpactMedium();
      
      this.loanService.updateLoanStatus(loanId, status, this.chamaId).subscribe({
        next: async (updatedLoan) => {
          // Update local data
          const index = this.loans.findIndex(l => l.id === loanId);
          if (index !== -1) {
            this.loans[index] = { ...this.loans[index], status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED', rejectionReason: reason };
          }
          this.filterLoans();
          
          await this.nativeService.hapticsNotificationSuccess();
          await this.showToast(`Loan ${status.toLowerCase()} successfully`, 'success');
        },
        error: async (err) => {
          console.error('Error updating loan:', err);
          await this.nativeService.hapticsNotificationError();
          await this.showToast('Failed to update loan status', 'danger');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      await this.showToast('An error occurred', 'danger');
    }
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'APPROVED': return 'success';
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
