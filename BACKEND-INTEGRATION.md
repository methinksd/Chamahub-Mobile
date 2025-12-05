# Chamahub Mobile - Backend Integration Guide

## Overview

This document outlines the integration between Chamahub Mobile (Ionic/Angular) and the Chamahub Backend (Java/Spring Boot).

**Backend Repository:** Evans-dev-code/Chamahub-Backend  
**Backend API Base URL:** `http://localhost:8080/api`

---

## API Endpoints Mapping

### Authentication Endpoints

#### Backend: `/api/auth/*`
- **Controller:** `UserController.java`
- **Base Path:** `/api/auth`

| Method | Endpoint | Frontend Service | Request Body | Response |
|--------|----------|------------------|--------------|----------|
| POST | `/auth/signup` | `AuthService.signup()` | `UserEntity` | `{ message: string }` |
| POST | `/auth/login` | `AuthService.login()` | `LoginRequest` | `LoginResponse` |
| GET | `/auth/user/{username}` | `UserService.getUserByUsername()` | - | `LoginResponse` |

**LoginRequest:**
```json
{
  "identifier": "string", // username or email
  "password": "string"
}
```

**LoginResponse:**
```json
{
  "token": "string",
  "statusCode": 200,
  "message": "Login successful",
  "userId": number,
  "role": "string",
  "user": {
    "id": number,
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  }
}
```

---

### Chama Management Endpoints

#### Backend: `/api/chamas/*`
- **Controller:** `ChamaController.java`
- **Base Path:** `/api/chamas`

| Method | Endpoint | Frontend Service | Auth Required | Request | Response |
|--------|----------|------------------|---------------|---------|----------|
| POST | `/chamas/create` | `ChamaService.createChama()` | ✅ Admin | `CreateChamaRequest` | `ChamaDto` |
| POST | `/chamas/join?joinCode={code}` | `ChamaService.joinChama()` | ✅ User | Query param | `ChamaDto` |
| GET | `/chamas/my-chamas` | `ChamaService.getMyChamas()` | ✅ User | - | `ChamaDto[]` |
| POST | `/chamas/{id}/generate-join-code` | `ChamaService.generateJoinCode()` | ✅ Admin | - | `{ joinCode: string }` |

**CreateChamaRequest:**
```json
{
  "name": "string",
  "description": "string"
}
```

**ChamaDto:**
```json
{
  "id": number,
  "name": "string",
  "description": "string",
  "joinCode": "string",
  "createdBy": number,
  "createdAt": "string"
}
```

---

### Loan Application Endpoints

#### User Loan Operations
- **Backend Controller:** `UserLoanApplicationController.java`
- **Base Path:** `/api/user/loan-applications`

| Method | Endpoint | Frontend Service | Request | Response |
|--------|----------|------------------|---------|----------|
| POST | `/user/loan-applications/chama/{chamaId}` | `LoanService.submitApplication()` | `LoanApplicationDTO` | `LoanApplicationDTO` |
| GET | `/user/loan-applications/chama/{chamaId}` | `LoanService.getUserApplications()` | - | `LoanApplicationDTO[]` |
| GET | `/user/loan-applications/loan-status/{loanId}` | `LoanService.getLoanStatus()` | - | `LoanStatusDTO` |

#### Admin Loan Operations
- **Backend Controller:** `AdminLoanApplicationController.java`
- **Base Path:** `/api/admin/loan-applications`

| Method | Endpoint | Frontend Service | Request | Response |
|--------|----------|------------------|---------|----------|
| GET | `/admin/loan-applications/chama/{chamaId}` | `LoanService.getAllApplications()` | - | `LoanApplicationDTO[]` |
| GET | `/admin/loan-applications/loan-status/{loanId}` | `LoanService.getAdminLoanStatus()` | - | `LoanStatusDTO` |

**LoanApplicationDTO:**
```json
{
  "id": number,
  "memberId": number,
  "chamaId": number,
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "amount": number,
  "duration": number,
  "purpose": "string",
  "loanType": "string",
  "salary": number,
  "personalLoanInfo": "string",
  "mortgagePropertyValue": number,
  "interestRate": number,
  "totalRepayment": number,
  "status": "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED",
  "createdAt": "string",
  "username": "string",
  "remainingBalance": number
}
```

---

### Payment Endpoints

#### User Payment Operations
- **Backend Controller:** `UserLoanpaymentController.java`
- **Base Path:** `/api/user/payments`

| Method | Endpoint | Frontend Service | Request | Response |
|--------|----------|------------------|---------|----------|
| POST | `/user/payments` | `LoanService.makePayment()` | `LoanpaymentDTO` | `LoanpaymentDTO` |
| GET | `/user/payments/my-payments` | `LoanService.getUserPayments()` | - | `LoanpaymentDTO[]` |
| GET | `/user/payments/by-loan/{loanId}` | `LoanService.getPaymentsByLoanId()` | - | `LoanpaymentDTO[]` |
| GET | `/user/payments/outstanding/{loanId}` | `LoanService.getOutstandingBalanceForLoan()` | - | `number` |
| GET | `/user/payments/loan/{loanId}/total-paid` | `LoanService.getTotalPaidForLoan()` | - | `number` |

#### Admin Payment Operations
- **Backend Controller:** `AdminLoanpaymentController.java`
- **Base Path:** `/api/admin/payments`

| Method | Endpoint | Frontend Service | Request | Response |
|--------|----------|------------------|---------|----------|
| POST | `/admin/payments` | `LoanService.makeAdminPayment()` | `LoanpaymentDTO` | `LoanpaymentDTO` |
| GET | `/admin/payments/chama/{chamaId}` | `LoanService.getAdminPayments()` | - | `LoanpaymentDTO[]` |

**LoanpaymentDTO:**
```json
{
  "loanId": number,
  "paidByUserId": number,
  "amountPaid": number,
  "paidByAdmin": boolean,
  "paymentDate": "YYYY-MM-DD"
}
```

---

### Member Management Endpoints

- **Backend Controller:** `MemberController.java`
- **Base Path:** `/api/members`

| Method | Endpoint | Frontend Service | Request | Response |
|--------|----------|------------------|---------|----------|
| POST | `/members/join` | `UserService.addMember()` | `MemberDTO` | `MemberEntity` |
| GET | `/members` | `UserService.getAllMembers()` | - | `MemberEntity[]` |
| GET | `/members/chama/{chamaId}` | `UserService.getMembersByChamaId()` | - | `MemberEntity[]` |
| GET | `/members/user/{userId}` | `UserService.getMembersByUserId()` | - | `MemberEntity[]` |

---

## Required Code Changes

### 1. Update Model Interfaces

The frontend models need to be updated to match backend DTOs:

**Key Changes:**
- `LoanApplication.memberId` (backend) → `userId` (frontend alias)
- `LoanApplication.duration` (backend) → `term` (frontend alias)
- `LoanApplication.createdAt` (backend) → `appliedDate`/`applicationDate` (frontend aliases)
- `LoanApplication.remainingBalance` (backend) → `balance` (frontend alias)
- `LoanPayment.amountPaid` (backend) → `amount` (frontend)

### 2. Update API Endpoint Paths

**Loan Service Updates Needed:**
```typescript
// OLD: /api/user/loan-applications?chamaId={id}
// NEW: /api/user/loan-applications/chama/{id}
submitApplication(application, chamaId) {
  return this.http.post(`${this.userApiUrl}/chama/${chamaId}`, application);
}

getUserApplications(chamaId) {
  return this.http.get(`${this.userApiUrl}/chama/${chamaId}`);
}

// NEW: Add status endpoint
getLoanStatus(loanId) {
  return this.http.get(`${this.userApiUrl}/loan-status/${loanId}`);
}
```

**Payment Service Updates Needed:**
```typescript
// Transform payment object to match backend DTO
makePayment(payment) {
  const dto = {
    loanId: payment.loanId,
    amountPaid: payment.amount,  // Transform field name
    paymentDate: payment.paymentDate,
    paidByAdmin: false
  };
  return this.http.post(`${this.userPaymentUrl}`, dto);
}

// Add new endpoints
getUserPayments() {
  return this.http.get(`${this.userPaymentUrl}/my-payments`);
}

getPaymentsByLoanId(loanId) {
  return this.http.get(`${this.userPaymentUrl}/by-loan/${loanId}`);
}

getOutstandingBalanceForLoan(loanId) {
  return this.http.get(`${this.userPaymentUrl}/outstanding/${loanId}`);
}

getTotalPaidForLoan(loanId) {
  return this.http.get(`${this.userPaymentUrl}/loan/${loanId}/total-paid`);
}
```

### 3. Authentication Flow Updates

```typescript
// AuthService login method needs to handle new response format
login(credentials: LoginRequest) {
  return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
    tap(async (response) => {
      if (response.statusCode === 200 && response.token) {
        await this.setAuthToken(response.token);
        await this.setRole(response.role);
        await this.setUserId(response.userId);
        if (response.user?.username) {
          await this.setUsername(response.user.username);
        }
      }
    })
  );
}
```

### 4. HTTP Interceptor Configuration

The backend uses JWT tokens in the Authorization header:

```typescript
// Existing interceptor should add:
// Authorization: Bearer <token>
```

The backend extracts `userId` from JWT and injects it into `HttpServletRequest` via `JwtTokenFilter`.

---

## Data Transformation Layer

Create a normalization function to map backend DTOs to frontend models:

```typescript
private normalizeLoanApplication(loan: any): LoanApplication {
  return {
    ...loan,
    // Map backend fields to frontend aliases
    userId: loan.memberId || loan.userId,
    requestedAmount: loan.amount,
    term: loan.duration,
    repaymentPeriod: loan.duration,
    appliedDate: loan.createdAt,
    applicationDate: loan.createdAt,
    balance: loan.remainingBalance || 0
  };
}
```

Apply this in service methods:

```typescript
getUserApplications(chamaId: number): Observable<LoanApplication[]> {
  return this.http.get<LoanApplication[]>(`${this.userApiUrl}/chama/${chamaId}`).pipe(
    map(loans => loans.map(loan => this.normalizeLoanApplication(loan)))
  );
}
```

---

## Authentication & Authorization

### JWT Token Flow

1. **Login:** User sends credentials → Backend returns JWT token
2. **Storage:** Token stored in Capacitor Preferences (secure)
3. **Requests:** Token added to all API requests via HTTP interceptor
4. **Backend:** JWT validated, userId extracted, user context injected

### Backend Security Configuration

- **Public Endpoints:** `/api/auth/login`, `/api/auth/signup`
- **Protected Endpoints:** All other `/api/*` endpoints require JWT
- **Role-Based Access:**
  - User endpoints: `/api/user/*`
  - Admin endpoints: `/api/admin/*`

---

## Error Handling

### Backend Error Responses

```json
{
  "statusCode": 401,
  "message": "Unauthorized: Invalid token"
}
```

### Frontend Error Handling

```typescript
this.http.post(url, data).subscribe({
  next: (response) => {
    // Handle success
  },
  error: (error) => {
    if (error.status === 401) {
      // Redirect to login
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      // Show forbidden message
    } else {
      // Show generic error
    }
  }
});
```

---

## Testing Integration

### 1. Start Backend Server

```bash
cd Chamahub-Backend
./gradlew bootRun
```

Backend runs on: `http://localhost:8080`

### 2. Configure Mobile Environment

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

For Android emulator, use `http://10.0.2.2:8080/api`  
For iOS simulator, use `http://localhost:8080/api` or computer's IP

### 3. Test Authentication Flow

```bash
# Start mobile app
npm run start

# Or test on device
npx ionic capacitor run android -l --external
```

Test sequence:
1. Signup → Verify user created in backend database
2. Login → Verify JWT token received and stored
3. Get user chamas → Verify Authorization header sent
4. Join chama → Verify chama membership created
5. Apply for loan → Verify loan application created
6. Make payment → Verify payment recorded

---

## Network Configuration

### CORS Configuration (Backend)

Ensure backend allows requests from mobile app:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8100", "capacitor://localhost")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Mobile Network Permissions

**Android:** `AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**iOS:** `Info.plist`
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

---

## Common Integration Issues

### Issue 1: CORS Errors
**Symptom:** `Access-Control-Allow-Origin` error  
**Solution:** Configure CORS in backend as shown above

### Issue 2: 401 Unauthorized
**Symptom:** All API calls return 401  
**Solution:** Verify JWT token is being sent in Authorization header

### Issue 3: Network Connection Failed
**Symptom:** Cannot reach backend from Android emulator  
**Solution:** Use `10.0.2.2` instead of `localhost` for Android emulator

### Issue 4: Data Type Mismatches
**Symptom:** TypeScript compilation errors  
**Solution:** Use normalization functions to map backend DTOs to frontend models

### Issue 5: Missing userId in Requests
**Symptom:** Backend cannot identify user  
**Solution:** Ensure JWT token is valid and backend JWT filter is configured

---

## API Documentation Tools

### Swagger/OpenAPI (Recommended)

Add to backend `build.gradle`:
```gradle
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2'
```

Access API docs at: `http://localhost:8080/swagger-ui.html`

### Postman Collection

Create Postman collection with all endpoints for manual testing:
1. Setup environment variables (`baseUrl`, `token`)
2. Configure Authorization with Bearer Token
3. Add all endpoint requests
4. Share collection with team

---

## Deployment Considerations

### Production API URL

Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.chamahub.com/api'
};
```

### SSL/TLS Requirements

- Backend must use HTTPS in production
- Mobile app should enforce HTTPS
- Certificate pinning recommended for additional security

### Token Refresh Strategy

Implement token refresh before expiration:
```typescript
// Check token expiration
if (isTokenExpiring()) {
  await this.authService.refreshToken();
}
```

---

## Next Steps

1. ✅ Review this integration guide
2. ⏳ Apply API endpoint updates to services
3. ⏳ Test authentication flow with backend
4. ⏳ Test chama operations (create, join, list)
5. ⏳ Test loan operations (apply, view, status)
6. ⏳ Test payment operations (submit, view history)
7. ⏳ Handle error cases and edge scenarios
8. ⏳ Document any API issues or bugs found
9. ⏳ Create integration test suite
10. ⏳ Update mobile app for production deployment

---

## Support & Resources

- **Backend Repository:** https://github.com/Evans-dev-code/Chamahub-Backend
- **Mobile Repository:** https://github.com/methinksd/Chamahub-Mobile
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Ionic/Angular Docs:** https://ionicframework.com/docs
- **Capacitor Docs:** https://capacitorjs.com/docs

---

**Last Updated:** December 5, 2024  
**Version:** 1.0.0  
**Status:** Integration guide complete - Ready for implementation
