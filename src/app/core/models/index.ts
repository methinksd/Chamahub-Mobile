// Core models and interfaces for Chamahub Mobile

export interface LoginRequest {
  identifier: string;  // can be email or username
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId: number;
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
  createdAt?: string;
  memberCount?: number;
}

export interface LoanApplication {
  id: number;
  userId: number;
  chamaId: number;
  amount: number;
  requestedAmount: number; // Alias for amount
  purpose: string;
  term: number; // in months
  repaymentPeriod: number; // Alias for term
  interestRate: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  appliedDate: string;
  applicationDate: string; // Alias for appliedDate
  approvedDate?: string;
  monthlyPayment?: number;
  balance: number;
  rejectionReason?: string;
}

export interface LoanPayment {
  id: number;
  loanId: number;
  amount: number;
  paymentDate: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  transactionReference?: string;
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
