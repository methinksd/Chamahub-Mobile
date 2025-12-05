# Native Features Integration Guide

## Overview
This guide documents the implementation of native device features in Chamahub Mobile using Capacitor plugins. The app integrates camera, haptic feedback, network monitoring, storage, notifications, and other device capabilities.

## Table of Contents
1. [Architecture](#architecture)
2. [Installed Plugins](#installed-plugins)
3. [Service Layer](#service-layer)
4. [Feature Implementations](#feature-implementations)
5. [Platform Detection](#platform-detection)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Architecture

### Service Wrapper Pattern
All Capacitor plugins are wrapped in two service layers:

```
Capacitor Plugins → NativeService (unified wrapper) → Feature Services → Components
                                   ↓
                           CameraService (specialized)
```

**Benefits:**
- Centralized error handling
- Consistent API across features
- Easy mocking for tests
- Platform-specific logic abstraction
- Type safety

---

## Installed Plugins

### Core Plugins (Included with Capacitor)
```json
{
  "@capacitor/app": "^7.0.1",
  "@capacitor/haptics": "^7.0.1",
  "@capacitor/keyboard": "^7.0.1",
  "@capacitor/preferences": "^7.0.1",
  "@capacitor/status-bar": "^7.0.1"
}
```

### Additional Plugins
```json
{
  "@capacitor/camera": "^7.0.0",
  "@capacitor/filesystem": "^7.0.0",
  "@capacitor/network": "^7.0.0",
  "@capacitor/push-notifications": "^7.0.0",
  "@capacitor/share": "^7.0.0",
  "@capacitor/toast": "^7.0.0"
}
```

### Installation Commands
```bash
# Install all native feature plugins
npm install @capacitor/camera @capacitor/filesystem @capacitor/network @capacitor/push-notifications @capacitor/share @capacitor/toast

# Sync with native projects
npx cap sync
```

---

## Service Layer

### NativeService (`core/services/native.service.ts`)
Unified wrapper for all Capacitor plugins.

#### Camera Methods
```typescript
// Take photo with camera
takePhoto(quality?: number): Promise<Photo>

// Pick photo from gallery
pickFromGallery(): Promise<Photo>

// Request camera permissions
requestCameraPermissions(): Promise<PermissionStatus>
```

#### Haptics Methods
```typescript
// Light tap (UI interactions)
hapticsImpactLight(): Promise<void>

// Medium impact (button presses)
hapticsImpactMedium(): Promise<void>

// Heavy impact (important actions)
hapticsImpactHeavy(): Promise<void>

// Selection change (picker/slider)
hapticsSelectionStart(): Promise<void>
hapticsSelectionChanged(): Promise<void>
hapticsSelectionEnd(): Promise<void>

// Notifications
hapticsNotificationSuccess(): Promise<void>
hapticsNotificationWarning(): Promise<void>
hapticsNotificationError(): Promise<void>
```

#### Network Methods
```typescript
// Get current network status
getNetworkStatus(): Promise<ConnectionStatus>

// Observable for status changes
getNetworkStatus$(): Observable<ConnectionStatus>

// Listen to status changes
addNetworkListener(callback: (status: ConnectionStatus) => void): Promise<PluginListenerHandle>
```

#### Toast Methods
```typescript
// Show native toast message
showToast(text: string, duration?: 'short' | 'long', position?: 'top' | 'center' | 'bottom'): Promise<void>
```

#### Share Methods
```typescript
// Share text content
shareText(title: string, text: string, url?: string): Promise<ShareResult>

// Share URL
shareUrl(title: string, url: string): Promise<ShareResult>

// Check if sharing is available
canShare(): Promise<CanShareResult>
```

#### Status Bar Methods
```typescript
// Set status bar style
setStatusBarStyleLight(): Promise<void>
setStatusBarStyleDark(): Promise<void>

// Show/hide status bar
hideStatusBar(): Promise<void>
showStatusBar(): Promise<void>
```

#### Utility Methods
```typescript
// Check if running on native platform
isNativePlatform(): boolean

// Get current platform
getPlatform(): 'ios' | 'android' | 'web'
```

### CameraService (`core/services/camera.service.ts`)
Specialized service for photo management.

#### Methods
```typescript
// Take photo and save with key
takePhoto(saveKey: string): Promise<string>

// Pick photo from gallery and save with key
pickPhoto(saveKey: string): Promise<string>

// Save photo data to filesystem
savePhoto(photo: Photo, saveKey: string): Promise<string>

// Load saved photo by key
loadPhoto(saveKey: string): Promise<string>

// Delete saved photo
deletePhoto(saveKey: string): Promise<void>

// Get photo URI for display
getPhotoUri(filepath: string): Promise<string>

// Convert blob to base64
convertBlobToBase64(blob: Blob): Promise<string>
```

#### Storage Strategy
Photos are stored using Capacitor Filesystem plugin:
- **Directory**: `Directory.Data` (app-specific storage)
- **Format**: JPEG
- **Naming**: `{saveKey}.jpeg` (e.g., `profile_123.jpeg`)
- **Path Storage**: Preferences API stores filepath for retrieval

---

## Feature Implementations

### 1. Profile Photo Upload

**Location**: `features/user/tabs/profile/profile.page.ts`

**Features:**
- Camera capture
- Gallery selection
- Photo display in avatar
- Haptic feedback on interactions
- Toast notifications for success/error

**Usage:**
```typescript
// Component imports
import { CameraService } from '../../../../core/services/camera.service';
import { NativeService } from '../../../../core/services/native.service';

// Take photo
async takePhoto() {
  const userId = await this.authService.getUserId();
  const photoPath = await this.cameraService.takePhoto(`profile_${userId}`);
  if (photoPath) {
    this.profilePhotoPath = photoPath;
    await this.nativeService.hapticsNotificationSuccess();
    await this.nativeService.showToast('Profile photo updated');
  }
}
```

**UI Integration:**
```html
<!-- Avatar with camera button -->
<div style="position: relative;">
  <ion-avatar (click)="changeProfilePhoto()">
    <img *ngIf="profilePhotoPath" [src]="profilePhotoPath" />
    <div *ngIf="!profilePhotoPath">{{ userName.charAt(0) }}</div>
  </ion-avatar>
  <ion-button (click)="changeProfilePhoto()">
    <ion-icon name="camera"></ion-icon>
  </ion-button>
</div>
```

### 2. Haptic Feedback

**Implemented in:**
- Login form submission (`login.page.ts`)
- Button clicks (`home.page.ts`)
- Profile photo actions (`profile.page.ts`)
- Navigation actions

**Best Practices:**
```typescript
// Light - Quick UI interactions (refresh, toggle)
await this.nativeService.hapticsImpactLight();

// Medium - Button presses, navigation
await this.nativeService.hapticsImpactMedium();

// Heavy - Important actions (delete, submit)
await this.nativeService.hapticsImpactHeavy();

// Success - Successful operations
await this.nativeService.hapticsNotificationSuccess();

// Error - Failed operations
await this.nativeService.hapticsNotificationError();
```

### 3. Network Status Monitor

**Location**: `shared/components/network-status/`

**Features:**
- Real-time connectivity monitoring
- Visual banner when offline
- Mobile data warning
- Auto-hide when online on WiFi

**Integration:**
```typescript
// App-wide (app.component.html)
<ion-app>
  <app-network-status></app-network-status>
  <ion-router-outlet></ion-router-outlet>
</ion-app>
```

**Styling:**
```scss
.network-status-banner {
  position: fixed;
  top: 0;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}
```

### 4. Native Toast Notifications

**Usage:**
```typescript
// Success toast
await this.nativeService.showToast('Operation successful', 'short', 'bottom');

// Error toast (uses Ionic ToastController for styling)
const toast = await this.toastController.create({
  message: 'Error occurred',
  duration: 3000,
  color: 'danger'
});
await toast.present();
```

### 5. Share Functionality

**Potential Use Cases:**
- Share loan application details
- Share payment receipts
- Share chama invite links

**Example Implementation:**
```typescript
async shareLoanDetails(loan: LoanApplication) {
  const canShare = await this.nativeService.canShare();
  if (canShare.value) {
    await this.nativeService.shareText(
      'Loan Application',
      `Amount: ${loan.amount}, Status: ${loan.status}`,
      'https://chamahub.app/loans/' + loan.id
    );
  }
}
```

---

## Platform Detection

### Checking Platform
```typescript
// In component
const isNative = this.nativeService.isNativePlatform();
const platform = this.nativeService.getPlatform();

if (platform === 'android') {
  // Android-specific code
} else if (platform === 'ios') {
  // iOS-specific code
} else {
  // Web fallback
}
```

### Conditional Features
```typescript
async takePhotoIfSupported() {
  if (this.nativeService.isNativePlatform()) {
    // Use native camera
    await this.cameraService.takePhoto('photo_key');
  } else {
    // Use web file input
    this.fileInput.nativeElement.click();
  }
}
```

---

## Testing

### Unit Testing
Mock the NativeService in tests:

```typescript
// test setup
const mockNativeService = {
  hapticsImpactMedium: jasmine.createSpy('hapticsImpactMedium').and.returnValue(Promise.resolve()),
  showToast: jasmine.createSpy('showToast').and.returnValue(Promise.resolve()),
  isNativePlatform: jasmine.createSpy('isNativePlatform').and.returnValue(true)
};

TestBed.configureTestingModule({
  providers: [
    { provide: NativeService, useValue: mockNativeService }
  ]
});
```

### Device Testing

#### Android Testing
```bash
# Build and sync
npm run build
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on device/emulator
# Click "Run" in Android Studio
```

#### iOS Testing (requires macOS)
```bash
# Build and sync
npm run build
npx cap sync ios

# Open in Xcode
npx cap open ios

# Run on device/simulator
# Click "Run" in Xcode
```

### Browser Testing
Most features have web fallbacks:
```bash
# Run in browser
ionic serve
# or
npm start
```

**Note**: Camera, haptics, and some other features require physical devices.

---

## Troubleshooting

### Common Issues

#### 1. Camera Not Working
**Symptoms**: Camera doesn't open or permissions denied

**Solutions:**
- Check Android manifest permissions:
  ```xml
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
  ```
- iOS: Add to Info.plist:
  ```xml
  <key>NSCameraUsageDescription</key>
  <string>We need access to your camera to take profile photos</string>
  <key>NSPhotoLibraryUsageDescription</key>
  <string>We need access to your photo library</string>
  ```

#### 2. Haptics Not Responding
**Symptoms**: No vibration on actions

**Solutions:**
- Android: Check device has vibration hardware
- iOS: Check device silent mode (haptics may be disabled)
- Web: Haptics not supported, ensure graceful fallback

#### 3. Network Status Not Updating
**Symptoms**: Network banner stuck or not showing

**Solutions:**
- Check plugin installed: `npm list @capacitor/network`
- Ensure listener is added in component's `ngOnInit`
- Clean subscription in `ngOnDestroy`

#### 4. Photos Not Saving
**Symptoms**: Camera works but photo doesn't display

**Solutions:**
- Check Filesystem permissions in manifest
- Verify Directory.Data is writable
- Check console for errors
- Ensure photo path is stored correctly

### Debug Logging
Enable debug mode in services:

```typescript
// In NativeService
private readonly DEBUG = true;

async takePhoto(quality = 90) {
  if (this.DEBUG) console.log('[NativeService] takePhoto called', { quality });
  try {
    const photo = await Camera.getPhoto({ ... });
    if (this.DEBUG) console.log('[NativeService] Photo captured', photo);
    return photo;
  } catch (error) {
    if (this.DEBUG) console.error('[NativeService] Camera error', error);
    throw error;
  }
}
```

### Platform-Specific Issues

#### Android
- **Build fails**: Run `npx cap sync android` and rebuild in Android Studio
- **Permissions**: Ensure all required permissions in `AndroidManifest.xml`
- **Gradle errors**: Update Android Studio and Gradle wrapper

#### iOS
- **Code signing**: Configure development team in Xcode
- **Permissions**: Add usage descriptions to `Info.plist`
- **Build fails**: Clean build folder (Cmd+Shift+K) and rebuild

---

## Best Practices

### 1. Always Check Platform
```typescript
if (this.nativeService.isNativePlatform()) {
  // Native feature
} else {
  // Web fallback
}
```

### 2. Handle Errors Gracefully
```typescript
try {
  await this.cameraService.takePhoto('key');
} catch (error) {
  console.error('Camera error:', error);
  await this.nativeService.showToast('Failed to take photo', 'short');
}
```

### 3. Request Permissions Early
```typescript
async ngOnInit() {
  const status = await this.nativeService.requestCameraPermissions();
  if (status.camera !== 'granted') {
    // Show permission required message
  }
}
```

### 4. Cleanup Subscriptions
```typescript
ngOnDestroy() {
  this.networkSubscription?.unsubscribe();
}
```

### 5. Provide Feedback
```typescript
// Always provide haptic + visual feedback
await this.nativeService.hapticsImpactMedium();
await this.nativeService.showToast('Action completed');
```

---

## Future Enhancements

### Planned Features
1. **Push Notifications**
   - Real-time loan status updates
   - Payment reminders
   - Chama announcements

2. **Biometric Authentication**
   - Fingerprint/Face ID login
   - Secure payment verification

3. **Geolocation**
   - Find nearby chama meetings
   - Branch locator

4. **QR Code Scanner**
   - Quick payment verification
   - Member check-in

5. **Background Sync**
   - Offline data sync
   - Payment queue

### Implementation Priority
1. Push Notifications (HIGH)
2. Biometric Auth (HIGH)
3. QR Scanner (MEDIUM)
4. Geolocation (LOW)
5. Background Sync (LOW)

---

## Additional Resources

### Official Documentation
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Ionic Native](https://ionic.io/docs/native)

### Plugin-Specific Docs
- [Camera Plugin](https://capacitorjs.com/docs/apis/camera)
- [Haptics Plugin](https://capacitorjs.com/docs/apis/haptics)
- [Network Plugin](https://capacitorjs.com/docs/apis/network)
- [Filesystem Plugin](https://capacitorjs.com/docs/apis/filesystem)
- [Preferences Plugin](https://capacitorjs.com/docs/apis/preferences)

### Community
- [Capacitor Community Plugins](https://github.com/capacitor-community)
- [Ionic Forum](https://forum.ionicframework.com/)

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0  
**Author**: Chamahub Development Team
