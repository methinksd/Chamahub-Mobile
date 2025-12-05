# Chamahub Mobile

A mobile application for Chamahub built with Ionic Framework and Angular. Manage your chama finances, apply for loans, track payments, and more - all from your mobile device.

## Project Information

- **Framework**: Ionic 8.7.11 with Angular 20.3.13
- **Platform**: Android (Capacitor 7.4.4)
- **Package ID**: `com.chamahub.mobile`
- **Architecture**: Standalone Components
- **Backend**: Java Spring Boot REST API at `http://localhost:8080/api`

## Features

### ✅ Authentication & Authorization
- JWT-based authentication with Bearer tokens
- Secure token storage using Capacitor Preferences
- Role-based access (User/Admin)
- Auto-redirect based on authentication state

### ✅ User Dashboard
- Tab-based navigation (Home, Loans, Payments, Profile)
- Real-time chama information display
- Active loans summary with balance tracking
- Upcoming payment reminders
- Pull-to-refresh data synchronization

### ✅ Loan Management
- View all loan applications with status badges
- Filter by status (Pending, Approved, Rejected)
- Detailed loan information cards
- Approval/rejection workflow for admins
- Real-time status updates

### ✅ Payment Tracking
- Comprehensive payment history
- Status-based filtering
- Payment confirmation details
- Visual payment cards with amounts

### ✅ Native Device Features
- **Camera Integration**: Profile photo capture from camera or gallery
- **Haptic Feedback**: Tactile feedback on interactions (9 types)
- **Network Monitoring**: Real-time connectivity status with offline banner
- **Toast Notifications**: Native Android/iOS toasts
- **Share Functionality**: Share content with other apps
- **Status Bar Control**: Dynamic styling for different themes

### ✅ Chama Management
- Browse available chamas
- Join chama with visual feedback
- View chama details and member count
- Search and filter capabilities

## Prerequisites

- Node.js v22.19.0 or higher
- npm 10.9.3 or higher
- Ionic CLI 7.2.1 or higher
- Android Studio (for Android development)
- Java 17+ and Gradle (for backend API)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/methinksd/Chamahub-Mobile.git
cd Chamahub-Mobile
```

2. Install dependencies:
```bash
npm install
```

## Development

### Running in Browser
```bash
ionic serve
```

### Building for Production
```bash
ionic build
```

### Android Development

#### Sync with Android platform
```bash
npx cap sync android
```

#### Open in Android Studio
```bash
npx cap open android
```

#### Run on Android device/emulator
```bash
ionic capacitor run android
```

## Project Structure

```
Chamahub-Mobile/
├── android/              # Native Android project
├── src/
│   ├── app/
│   │   ├── core/         # Core application services and models
│   │   │   ├── guards/   # Route guards (auth.guard.ts, role.guard.ts)
│   │   │   ├── interceptors/ # HTTP interceptors (auth.interceptor.ts)
│   │   │   ├── models/   # TypeScript interfaces and DTOs
│   │   │   └── services/ # Business logic services
│   │   │       ├── auth.service.ts      # Authentication & JWT
│   │   │       ├── user.service.ts      # User management
│   │   │       ├── chama.service.ts     # Chama operations
│   │   │       ├── loan.service.ts      # Loan applications
│   │   │       ├── payment.service.ts   # Payment tracking
│   │   │       ├── native.service.ts    # Native plugin wrapper
│   │   │       └── camera.service.ts    # Photo management
│   │   ├── features/     # Feature modules
│   │   │   ├── auth/     # Login, Signup pages
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   └── user/     # User features
│   │   │       ├── select-chama/   # Chama selection
│   │   │       └── tabs/           # User dashboard tabs
│   │   │           ├── home/       # Dashboard home
│   │   │           ├── loans/      # Loan management
│   │   │           ├── payments/   # Payment history
│   │   │           └── profile/    # User profile
│   │   ├── shared/       # Shared components
│   │   │   └── components/
│   │   │       └── network-status/ # Network monitor
│   │   ├── app.component.ts
│   │   └── app.routes.ts # Application routing
│   ├── assets/           # Static assets (images, icons)
│   ├── environments/     # Environment configurations
│   └── theme/            # Global styles and theme variables
├── BACKEND-INTEGRATION.md   # Backend API integration guide
├── NATIVE-FEATURES.md       # Native features documentation
├── capacitor.config.ts      # Capacitor configuration
├── ionic.config.json        # Ionic CLI configuration
├── angular.json             # Angular CLI configuration
└── package.json             # Dependencies and scripts
```

## Capacitor Plugins

The following Capacitor plugins are installed:

### Core Plugins
- `@capacitor/app` (v7.0.1) - App state and URL handling
- `@capacitor/haptics` (v7.0.1) - Haptic feedback (9 types)
- `@capacitor/keyboard` (v7.0.1) - Keyboard control
- `@capacitor/status-bar` (v7.0.1) - Status bar styling
- `@capacitor/preferences` (v7.0.1) - Secure storage for tokens

### Native Feature Plugins
- `@capacitor/camera` (v7.0.0) - Photo capture and gallery access
- `@capacitor/filesystem` (v7.0.0) - File system operations
- `@capacitor/network` (v7.0.0) - Network status monitoring
- `@capacitor/toast` (v7.0.0) - Native toast notifications
- `@capacitor/share` (v7.0.0) - Share content with other apps
- `@capacitor/push-notifications` (v7.0.0) - Push notification support

For detailed plugin usage, see [NATIVE-FEATURES.md](./NATIVE-FEATURES.md)

## Scripts

- `npm start` - Start development server (localhost:8100)
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
- `npx cap sync` - Sync web assets with native platforms
- `npx cap open android` - Open Android project in Android Studio

## Backend Integration

The mobile app connects to a Java Spring Boot backend API. See [BACKEND-INTEGRATION.md](./BACKEND-INTEGRATION.md) for:
- Complete API endpoint documentation (40+ endpoints)
- Request/Response DTOs and field mappings
- Authentication flow with JWT tokens
- CORS configuration
- Error handling strategies
- Testing procedures

**Backend URL**: `http://localhost:8080/api` (configurable in `src/environments/`)

## Documentation

- **[BACKEND-INTEGRATION.md](./BACKEND-INTEGRATION.md)** - Complete backend API integration guide
  - All API endpoints with examples
  - Authentication & authorization flow
  - DTO field mappings and transformations
  - CORS setup and troubleshooting
  
- **[NATIVE-FEATURES.md](./NATIVE-FEATURES.md)** - Native device features guide
  - Camera integration for profile photos
  - Haptic feedback implementation
  - Network status monitoring
  - Plugin usage and best practices
  - Platform-specific configurations
  - Testing on physical devices

## Configuration Files

- **capacitor.config.ts**: Capacitor configuration including app ID, name, and web directory
- **ionic.config.json**: Ionic framework configuration
- **angular.json**: Angular build and serve options
- **tsconfig.json**: TypeScript compiler options
- **src/environments/**: Environment-specific API URLs and settings

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Sync Capacitor: `npx cap sync`
- Clear build cache: `ionic build --clean`

### Android Issues
- Open Android project in Android Studio and sync Gradle
- Check Android SDK installation
- Verify ANDROID_HOME environment variable is set
- Update Gradle: `cd android && ./gradlew wrapper --gradle-version 8.0`

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify JWT token is being sent in Authorization header
- Check browser console for network errors

### Native Plugin Issues
- Permissions: Ensure required permissions in AndroidManifest.xml
- Camera not working: Check camera and storage permissions
- Haptics not responding: Test on physical device (not browser)
- Network status: Ensure Network plugin is synced with `npx cap sync`

For detailed troubleshooting, see:
- [BACKEND-INTEGRATION.md](./BACKEND-INTEGRATION.md#troubleshooting)
- [NATIVE-FEATURES.md](./NATIVE-FEATURES.md#troubleshooting)

## Testing

### Browser Testing
```bash
ionic serve
```
**Note**: Some native features (camera, haptics) require physical devices.

### Android Device Testing
```bash
# Build the app
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on device/emulator (click "Run" in Android Studio)
```

### iOS Testing (macOS required)
```bash
# Build the app
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Run on device/simulator (click "Run" in Xcode)
```

## Development Workflow

1. **Start Backend API**: Run Spring Boot backend on port 8080
2. **Start Mobile App**: `ionic serve` for browser testing
3. **Make Changes**: Edit files in `src/app/`
4. **Test**: Verify in browser or on device
5. **Build**: `npm run build` for production
6. **Deploy**: Sync to native platforms with `npx cap sync`

## Initial Setup Notes

The project was initialized with:
- Ionic blank starter template
- Angular with Standalone Components architecture
- Capacitor for native functionality
- Android platform pre-configured

### Recent Updates
- ✅ Backend integration with JWT authentication
- ✅ Complete user dashboard with tab navigation
- ✅ Loan application and payment tracking
- ✅ Native camera integration for profile photos
- ✅ Haptic feedback on user interactions
- ✅ Real-time network status monitoring
- ✅ Comprehensive service layer with error handling

## Version Control

The project is connected to GitHub repository:
- **Repository**: https://github.com/methinksd/Chamahub-Mobile
- **Branch**: master

## License

[Add license information here]

## Contributors

[Add contributor information here]
