import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', (done) => {
    const mockToken = 'test-jwt-token';
    authServiceSpy.getToken.and.returnValue(Promise.resolve(mockToken));

    httpClient.get('/api/test').subscribe(() => {
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    }, 100);
  });

  it('should not add Authorization header when no token', (done) => {
    authServiceSpy.getToken.and.returnValue(Promise.resolve(null));

    httpClient.get('/api/test').subscribe(() => {
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    }, 100);
  });

  it('should not add Authorization header for login endpoint', (done) => {
    authServiceSpy.getToken.and.returnValue(Promise.resolve('token'));

    httpClient.post(`${environment.apiUrl}/auth/login`, {}).subscribe(() => {
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    }, 100);
  });

  it('should not add Authorization header for signup endpoint', (done) => {
    authServiceSpy.getToken.and.returnValue(Promise.resolve('token'));

    httpClient.post(`${environment.apiUrl}/auth/signup`, {}).subscribe(() => {
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup`);
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    }, 100);
  });
});
