import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chama, ChamaMember } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChamaService {
  private apiUrl = `${environment.apiUrl}/chamas`;

  constructor(private http: HttpClient) {}

  // ------------------- USER OPERATIONS -------------------

  /**
   * Get all chamas the logged-in user belongs to
   */
  getMyChamas(): Observable<Chama[]> {
    return this.http.get<Chama[]>(`${this.apiUrl}/my-chamas`);
  }

  /**
   * Join a chama using a join code
   */
  joinChama(joinCode: string): Observable<Chama> {
    return this.http.post<Chama>(
      `${this.apiUrl}/join?joinCode=${encodeURIComponent(joinCode)}`, 
      {}
    );
  }

  /**
   * Get details of a specific chama
   */
  getChamaById(chamaId: number): Observable<Chama> {
    return this.http.get<Chama>(`${this.apiUrl}/${chamaId}`);
  }

  // ------------------- ADMIN OPERATIONS -------------------

  /**
   * Create a new chama (admin only)
   */
  createChama(payload: { name: string; description: string }): Observable<Chama> {
    return this.http.post<Chama>(`${this.apiUrl}/create`, payload);
  }

  /**
   * Generate or regenerate a join code for a chama
   */
  generateJoinCode(chamaId: number): Observable<{ joinCode: string }> {
    return this.http.post<{ joinCode: string }>(
      `${this.apiUrl}/${chamaId}/generate-join-code`, 
      {}
    );
  }

  /**
   * Update chama details
   */
  updateChama(chamaId: number, payload: Partial<Chama>): Observable<Chama> {
    return this.http.put<Chama>(`${this.apiUrl}/${chamaId}`, payload);
  }

  /**
   * Delete a chama
   */
  deleteChama(chamaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${chamaId}`);
  }

  // ------------------- MEMBER OPERATIONS -------------------

  /**
   * Get all members of a specific chama
   */
  getChamaMembers(chamaId: number): Observable<ChamaMember[]> {
    return this.http.get<ChamaMember[]>(`${this.apiUrl}/${chamaId}/members`);
  }

  /**
   * Remove a member from a chama (admin only)
   */
  removeMember(chamaId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${chamaId}/members/${userId}`);
  }

  /**
   * Update member role in a chama
   */
  updateMemberRole(chamaId: number, userId: number, role: string): Observable<ChamaMember> {
    return this.http.put<ChamaMember>(
      `${this.apiUrl}/${chamaId}/members/${userId}/role`,
      { role }
    );
  }
}
