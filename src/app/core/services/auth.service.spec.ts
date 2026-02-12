import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Preferences } from '@capacitor/preferences';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const API_URL = environment.apiUrl;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear Capacitor storage before each test
    await Preferences.clear();
  });

  afterEach(async () => {
    httpMock.verify();
    await Preferences.clear();
  });

  describe('login', () => {
    it('should login successfully and store token', (done) => {
      const mockLoginData = { identifier: 'testuser', password: 'password123' };
      const mockResponse = {
        statusCode: 200,
        message: 'Login successful',
        token: 'mock-jwt-token',
        role: 'USER',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        }
      };

      service.login(mockLoginData).subscribe(response => {
        expect(response.token).toBe('mock-jwt-token');
        expect(response.role).toBe('USER');
        expect(response.user?.username).toBe('testuser');
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginData);
      req.flush(mockResponse);
    });

    it('should handle login failure', (done) => {
      const mockLoginData = { identifier: 'wrong', password: 'wrong' };
      const mockError = { message: 'Invalid credentials' };

      service.login(mockLoginData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.error.message).toBe('Invalid credentials');
          done();
        }
      });

      const req = httpMock.expectOne(`${API_URL}/auth/login`);
      req.flush(mockError, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('signup', () => {
    it('should register new user successfully', (done) => {
      const mockSignupData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        phoneNumber: '1234567890'
      };
      const mockResponse = { message: 'User registered successfully' };

      service.signup(mockSignupData).subscribe(response => {
        expect(response.message).toBe('User registered successfully');
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/auth/signup`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('token management', () => {
    it('should store token using Preferences', async () => {
      const token = 'test-token-123';
      await service.setAuthToken(token);
      
      const storedToken = await service.getAuthToken();
      expect(storedToken).toBe(token);
    });

    it('should return null when no token stored', async () => {
      const token = await service.getAuthToken();
      expect(token).toBeNull();
    });

    it('should clear token on logout', async () => {
      await service.setAuthToken('test-token');
      await service.logout();
      
      const token = await service.getAuthToken();
      expect(token).toBeNull();
    });
  });

  describe('user data management', () => {
    it('should store and retrieve username', async () => {
      await service.setUsername('testuser');
      const username = await service.getUsername();
      expect(username).toBe('testuser');
    });

    it('should store and retrieve userId', async () => {
      await Preferences.set({ key: 'userId', value: '123' });
      const userId = await service.getUserId();
      expect(userId).toBe(123);
    });

    it('should store and retrieve chamaId', async () => {
      await service.setActiveChamaId(456);
      const chamaId = await service.getChamaId();
      expect(chamaId).toBe(456);
    });

    it('should store and retrieve user role', async () => {
      await service.setRole('ADMIN');
      const role = await service.getRole();
      expect(role).toBe('admin');
    });
  });

  describe('authentication state', () => {
    it('should return true when token exists', async () => {
      await service.setAuthToken('valid-token');
      const isAuth = await service.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    it('should return false when no token', async () => {
      const isAuth = await service.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    it('should clear all user data on logout', async () => {
      // Store all user data
      await service.setAuthToken('token');
      await service.setUsername('user');
      await Preferences.set({ key: 'userId', value: '123' });
      await service.setActiveChamaId(456);
      await service.setRole('USER');

      // Logout
      await service.logout();

      // Verify all cleared
      expect(await service.getAuthToken()).toBeNull();
      expect(await service.getUsername()).toBeNull();
      expect(await service.getUserId()).toBeNull();
      expect(await service.getChamaId()).toBeNull();
      expect(await service.getRole()).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', (done) => {
      const mockLoginData = { identifier: 'test', password: 'test' };

      service.login(mockLoginData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_URL}/auth/login`);
      req.error(new ProgressEvent('Network error'));
    });
  });
});
