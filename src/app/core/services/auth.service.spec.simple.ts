import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const API_URL = environment.apiUrl;

  beforeEach(() => {
    // Clear all Preferences data before each test
    spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));
    spyOn(Preferences, 'set').and.returnValue(Promise.resolve());
    spyOn(Preferences, 'remove').and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully', (done) => {
      const mockLoginData = { identifier: 'testuser', password: 'password123' };
      const mockResponse = {
        statusCode: 200,
        token: 'mock-jwt-token',
        role: 'USER',
        userId: 1,
        user: { username: 'testuser' }
      };

      service.login(mockLoginData).subscribe(response => {
        expect(response.token).toBe('mock-jwt-token');
        expect(response.role).toBe('USER');
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('signup', () => {
    it('should signup successfully', (done) => {
      const mockSignupData = {
        username: 'newuser',
        email: 'new@test.com',
        password: 'pass123',
        phoneNumber: '1234567890'
      };

      service.signup(mockSignupData).subscribe(response => {
        expect(response).toBeTruthy();
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/auth/signup`);
      req.flush({ message: 'Success' });
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token', async () => {
      const result = await service.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear all data', async () => {
      await service.logout();
      expect(Preferences.remove).toHaveBeenCalled();
    });
  });
});
