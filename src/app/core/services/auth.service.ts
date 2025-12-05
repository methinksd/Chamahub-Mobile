import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, SignupRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private signupUrl = `${this.apiUrl}/auth/signup`;
  private loginUrl = `${this.apiUrl}/auth/login`;

  private readonly TOKEN_KEY = 'authToken';
  private readonly ROLE_KEY = 'userRole';
  private readonly USER_ID_KEY = 'userId';
  private readonly USERNAME_KEY = 'username';
  private readonly ACTIVE_CHAMA_KEY = 'activeChamaId';

  constructor(private http: HttpClient) {}

  // ------------------- AUTH CALLS -------------------

  signup(userPayload: SignupRequest): Observable<any> {
    return this.http.post(this.signupUrl, userPayload);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap(async (response: LoginResponse) => {
        if (response.statusCode === 200 && response.token) {
          await this.setAuthToken(response.token);
          await this.setRole(response.role);
          await Preferences.set({
            key: this.USER_ID_KEY,
            value: response.userId.toString()
          });
          // Store username if available in response
          if (response.user?.username) {
            await this.setUsername(response.user.username);
          }
        }
      })
    );
  }

  // ------------------- SESSION MANAGEMENT -------------------

  async logout(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
    await Preferences.remove({ key: this.ROLE_KEY });
    await Preferences.remove({ key: this.USER_ID_KEY });
    await Preferences.remove({ key: this.USERNAME_KEY });
    await Preferences.remove({ key: this.ACTIVE_CHAMA_KEY });
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return token !== null;
  }

  // ------------------- ROLE HELPERS -------------------

  async isAdmin(): Promise<boolean> {
    const role = await this.getRole();
    return role === 'admin';
  }

  async isUser(): Promise<boolean> {
    const role = await this.getRole();
    return role === 'user';
  }

  // ------------------- GETTERS/SETTERS -------------------

  async getCurrentUserId(): Promise<number | null> {
    const result = await Preferences.get({ key: this.USER_ID_KEY });
    return result.value ? parseInt(result.value, 10) : null;
  }

  async setAuthToken(token: string): Promise<void> {
    await Preferences.set({
      key: this.TOKEN_KEY,
      value: token
    });
  }

  async getAuthToken(): Promise<string | null> {
    const result = await Preferences.get({ key: this.TOKEN_KEY });
    return result.value;
  }

  async setRole(role: string): Promise<void> {
    await Preferences.set({
      key: this.ROLE_KEY,
      value: role.toLowerCase()
    });
  }

  async getRole(): Promise<string | null> {
    const result = await Preferences.get({ key: this.ROLE_KEY });
    return result.value;
  }

  async setActiveChamaId(chamaId: number): Promise<void> {
    await Preferences.set({
      key: this.ACTIVE_CHAMA_KEY,
      value: chamaId.toString()
    });
  }

  async getActiveChamaId(): Promise<number | null> {
    const result = await Preferences.get({ key: this.ACTIVE_CHAMA_KEY });
    return result.value ? parseInt(result.value, 10) : null;
  }

  // Additional helper methods
  async getUserId(): Promise<number | null> {
    return this.getCurrentUserId();
  }

  async getChamaId(): Promise<number | null> {
    return this.getActiveChamaId();
  }

  async setUsername(username: string): Promise<void> {
    await Preferences.set({
      key: this.USERNAME_KEY,
      value: username
    });
  }

  async getUsername(): Promise<string | null> {
    const result = await Preferences.get({ key: this.USERNAME_KEY });
    return result.value;
  }
}
