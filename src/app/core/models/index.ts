// Core models and interfaces for Chamahub Mobile
// Updated to match backend DTOs

export interface LoginRequest {
  identifier: string;  // can be email or username (matches backend)
  password: string;
}

export interface LoginResponse {
  token: string;
  statusCode: number;
  message: string;
  userId: number;
  role: string;
  user?: User;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role: string;
  createdAt?: string;
}

export interface Chama {
  id: number;
  name: string;
  description?: string;
  createdBy: number;
  joinCode?: string;
  createdAt?: string;
  memberCount?: number;
}

export interface CreateChamaRequest {
  name: string;
  description?: string;
}

export interface LoanApplication {
  id: number;
  memberId: number;
  userId?: number;  // alias for memberId
  chamaId: number;
  fullName?: string;
  email?: string;
  phone?: string;
  amount: number;
  requestedAmount: number; // Alias for amount
  duration: number; // term in months
  term: number; // alias for duration
  repaymentPeriod: number; // Alias for term
  purpose: string;
  loanType?: string;
  salary?: number;
  personalLoanInfo?: string;
  mortgagePropertyValue?: number;
  interestRate: number;
  totalRepayment?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  createdAt: string;
  appliedDate: string; // alias for createdAt
  applicationDate: string; // Alias for createdAt
  approvedDate?: string;
  username?: string;
  remainingBalance?: number;
  balance: number; // alias for remainingBalance
  monthlyPayment?: number;
  rejectionReason?: string;
}

export interface LoanPayment {
  id?: number;
  loanId: number;
  paidByUserId?: number;
  amount: number;
  amountPaid?: number; // alias for amount
  paymentDate: string;
  paidByAdmin?: boolean;
  status?: 'COMPLETED' | 'PENDING' | 'FAILED';
  transactionReference?: string;
}

export interface LoanStatusDTO {
  loanId: number;
  status: string;
  remainingBalance: number;
  totalPaid: number;
}

export interface ChamaMember {
  id: number;
  chamaId: number;
  userId: number;
  username?: string;
  email?: string;
  joinedDate: string;
  role: 'MEMBER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
}
