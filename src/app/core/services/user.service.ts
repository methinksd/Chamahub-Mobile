import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, ChamaMember } from '../models';

export interface MemberDTO {
  phoneNumber: string;
  chamaRole: string;
  createdDate: string;
  userId: number;
  chamaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private adminUrl = `${this.apiUrl}/admin/users`;
  private memberUrl = `${this.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  // ------------------- ADMIN USER MANAGEMENT -------------------

  /**
   * Get all users pending approval for a specific chama
   */
  getPendingUsers(chamaId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminUrl}/pending?chamaId=${chamaId}`);
  }

  /**
   * Approve a user for a specific chama
   */
  approveUser(userId: number, chamaId: number): Observable<any> {
    return this.http.put(`${this.adminUrl}/${userId}/approve?chamaId=${chamaId}`, {});
  }

  /**
   * Reject a user for a specific chama
   */
  rejectUser(userId: number, chamaId: number): Observable<any> {
    return this.http.put(`${this.adminUrl}/${userId}/reject?chamaId=${chamaId}`, {});
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminUrl}`);
  }

  /**
   * Get user by ID
   */
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.adminUrl}/${userId}`);
  }

  // ------------------- MEMBER OPERATIONS -------------------

  /**
   * Get all members for a specific chama
   */
  getMembersByChamaId(chamaId: number): Observable<ChamaMember[]> {
    return this.http.get<ChamaMember[]>(`${this.memberUrl}/chama/${chamaId}`);
  }

  /**
   * Add a new member to a chama
   */
  addMember(memberData: MemberDTO): Observable<ChamaMember> {
    return this.http.post<ChamaMember>(this.memberUrl, memberData);
  }

  /**
   * Update member information
   */
  updateMember(memberId: number, memberData: Partial<MemberDTO>): Observable<ChamaMember> {
    return this.http.put<ChamaMember>(`${this.memberUrl}/${memberId}`, memberData);
  }

  /**
   * Remove a member from a chama
   */
  removeMember(memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.memberUrl}/${memberId}`);
  }

  // ------------------- USER PROFILE -------------------

  /**
   * Get current user's profile
   */
  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/profile`);
  }

  /**
   * Update current user's profile
   */
  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/profile`, userData);
  }
}
