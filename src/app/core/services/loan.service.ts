import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoanApplication, LoanPayment } from '../models';

export interface LoanStats {
  count: number;
  total: number;
  profit: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = environment.apiUrl;
  private userApiUrl = `${this.apiUrl}/user/loan-applications`;
  private adminApiUrl = `${this.apiUrl}/admin/loan-applications`;
  private userPaymentUrl = `${this.apiUrl}/user/payments`;
  private adminPaymentUrl = `${this.apiUrl}/admin/payments`;

  constructor(private http: HttpClient) {}

  // ------------------- USER OPERATIONS -------------------

  /**
   * Submit a new loan application for a specific chama
   */
  submitApplication(application: Partial<LoanApplication>, chamaId: number): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(
      `${this.userApiUrl}?chamaId=${chamaId}`,
      application
    );
  }

  /**
   * Get current user's loan applications in a specific chama
   */
  getUserApplications(chamaId: number): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.userApiUrl}?chamaId=${chamaId}`);
  }

  /**
   * Get a specific loan application by ID
   */
  getLoanById(loanId: number, chamaId: number): Observable<LoanApplication> {
    return this.http.get<LoanApplication>(`${this.userApiUrl}/${loanId}?chamaId=${chamaId}`);
  }

  // ------------------- ADMIN OPERATIONS -------------------

  /**
   * Get all loan applications in a chama (admin view)
   */
  getAllApplications(chamaId: number): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.adminApiUrl}?chamaId=${chamaId}`);
  }

  /**
   * Update loan application status (admin only)
   */
  updateLoanStatus(id: number, status: string, chamaId: number): Observable<LoanApplication> {
    const params = new HttpParams()
      .set('status', status.toUpperCase())
      .set('chamaId', chamaId.toString());
    return this.http.put<LoanApplication>(`${this.adminApiUrl}/${id}/status`, {}, { params });
  }

  /**
   * Search loans by email or phone (admin)
   */
  searchByIdentifier(identifier: string, chamaId: number): Observable<LoanApplication[]> {
    return this.getAllApplications(chamaId).pipe(
      map(apps =>
        apps.filter(app =>
          app.userId?.toString().includes(identifier) ||
          app.status?.toLowerCase().includes(identifier.toLowerCase())
        )
      )
    );
  }

  // ------------------- STATISTICS -------------------

  /**
   * Get total loan value for a chama
   */
  getTotalLoanValue(chamaId: number): Observable<number> {
    return this.getAllApplications(chamaId).pipe(
      map(loans => loans.reduce((sum, app) => sum + (app.amount || 0), 0))
    );
  }

  /**
   * Get outstanding balance across all loans
   */
  getOutstandingBalance(chamaId: number): Observable<number> {
    return this.getAllApplications(chamaId).pipe(
      map(loans =>
        loans.reduce((sum, app) => {
          const amount = app.amount || 0;
          const interest = ((app.interestRate || 0) / 100) * amount;
          return sum + (amount + interest);
        }, 0)
      )
    );
  }

  /**
   * Get count of active loans
   */
  getActiveLoanCount(chamaId: number): Observable<number> {
    return this.getAllApplications(chamaId).pipe(
      map(loans =>
        loans.filter(app => app.status === 'APPROVED' || app.status === 'DISBURSED').length
      )
    );
  }

  /**
   * Get loan statistics by type
   */
  getLoanStatsByType(chamaId: number): Observable<{ [type: string]: LoanStats }> {
    return this.getAllApplications(chamaId).pipe(
      map((applications: LoanApplication[]) => {
        const stats: { [key: string]: LoanStats } = {};
        applications.forEach(app => {
          const type = 'loan'; // Simplified for mobile
          const amount = app.amount || 0;
          const interest = ((app.interestRate || 0) / 100) * amount;
          const profit = interest;

          if (!stats[type]) {
            stats[type] = { count: 0, total: 0, profit: 0 };
          }

          stats[type].count++;
          stats[type].total += amount;
          stats[type].profit += profit;
        });
        return stats;
      })
    );
  }

  // ------------------- PAYMENTS -------------------

  /**
   * Make a payment as a user
   */
  makeUserPayment(payment: Partial<LoanPayment>, chamaId: number): Observable<any> {
    return this.http.post(`${this.userPaymentUrl}?chamaId=${chamaId}`, payment);
  }

  /**
   * Make a payment as admin
   */
  makeAdminPayment(payment: Partial<LoanPayment>, chamaId: number): Observable<any> {
    return this.http.post(`${this.adminPaymentUrl}?chamaId=${chamaId}`, payment);
  }

  /**
   * Get all payments for a specific loan
   */
  getPaymentsByLoanId(loanId: number, chamaId: number): Observable<LoanPayment[]> {
    return this.http.get<LoanPayment[]>(`${this.adminPaymentUrl}/loan/${loanId}?chamaId=${chamaId}`);
  }

  /**
   * Get total amount paid for a specific loan
   */
  getTotalPaidForLoan(loanId: number, chamaId: number): Observable<number> {
    return this.http.get<number>(`${this.userPaymentUrl}/loan/${loanId}/total-paid?chamaId=${chamaId}`);
  }

  // ------------------- HELPERS -------------------

  /**
   * Calculate monthly payment for a loan
   */
  calculateMonthlyPayment(principal: number, annualRate: number, termInMonths: number): number {
    if (principal <= 0 || annualRate <= 0 || termInMonths <= 0) {
      return 0;
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment =
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -termInMonths));
    
    return Math.round(monthlyPayment * 100) / 100;
  }
}
