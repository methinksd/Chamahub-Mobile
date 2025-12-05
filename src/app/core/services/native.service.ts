import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo, PermissionStatus } from '@capacitor/camera';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Network, ConnectionStatus } from '@capacitor/network';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NativeService {
  private networkStatus$ = new BehaviorSubject<ConnectionStatus>({ 
    connected: true, 
    connectionType: 'unknown' 
  });

  constructor() {
    this.initializeNetworkListener();
  }

  // ==================== CAMERA ====================

  /**
   * Take a photo using device camera
   */
  async takePhoto(): Promise<Photo | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      return image;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }

  /**
   * Pick a photo from gallery
   */
  async pickFromGallery(): Promise<Photo | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      return image;
    } catch (error) {
      console.error('Error picking photo:', error);
      return null;
    }
  }

  /**
   * Check if camera is available
   */
  async isCameraAvailable(): Promise<boolean> {
    try {
      const permissions = await Camera.checkPermissions();
      return permissions.camera !== 'denied';
    } catch (error) {
      return false;
    }
  }

  /**
   * Request camera permissions
   */
  async requestCameraPermissions(): Promise<PermissionStatus> {
    try {
      return await Camera.requestPermissions();
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return { camera: 'denied', photos: 'denied' };
    }
  }

  // ==================== HAPTICS ====================

  /**
   * Trigger light impact haptic feedback
   */
  async hapticsImpactLight(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available');
    }
  }

  /**
   * Trigger medium impact haptic feedback
   */
  async hapticsImpactMedium(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.log('Haptics not available');
    }
  }

  /**
   * Trigger heavy impact haptic feedback
   */
  async hapticsImpactHeavy(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.log('Haptics not available');
    }
  }

  /**
   * Trigger success notification haptic
   */
  async hapticsNotificationSuccess(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.log('Haptics not available');
    }
  }

  /**
   * Trigger warning notification haptic
   */
  async hapticsNotificationWarning(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.log('Haptics not available');
    }
  }

  /**
   * Trigger error notification haptic
   */
  async hapticsNotificationError(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.log('Haptics not available');
    }
  }

  // ==================== NETWORK ====================

  /**
   * Get current network status
   */
  async getNetworkStatus(): Promise<ConnectionStatus> {
    try {
      return await Network.getStatus();
    } catch (error) {
      return { connected: true, connectionType: 'unknown' };
    }
  }

  /**
   * Observable for network status changes
   */
  getNetworkStatus$(): Observable<ConnectionStatus> {
    return this.networkStatus$.asObservable();
  }

  /**
   * Initialize network status listener
   */
  private async initializeNetworkListener(): Promise<void> {
    try {
      // Get initial status
      const status = await Network.getStatus();
      this.networkStatus$.next(status);

      // Listen for changes
      Network.addListener('networkStatusChange', (status) => {
        this.networkStatus$.next(status);
      });
    } catch (error) {
      console.log('Network monitoring not available');
    }
  }

  // ==================== TOAST ====================

  /**
   * Show a native toast message
   */
  async showToast(message: string, duration: 'short' | 'long' = 'short'): Promise<void> {
    try {
      await Toast.show({
        text: message,
        duration: duration,
        position: 'bottom'
      });
    } catch (error) {
      console.log('Toast not available, message:', message);
    }
  }

  // ==================== SHARE ====================

  /**
   * Share text content
   */
  async shareText(text: string, title?: string): Promise<boolean> {
    try {
      await Share.share({
        text: text,
        title: title || 'Share',
        dialogTitle: title || 'Share'
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }

  /**
   * Share with URL
   */
  async shareUrl(url: string, title?: string): Promise<boolean> {
    try {
      await Share.share({
        url: url,
        title: title || 'Share',
        dialogTitle: title || 'Share'
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }

  /**
   * Check if sharing is available
   */
  async canShare(): Promise<boolean> {
    try {
      const result = await Share.canShare();
      return result.value;
    } catch (error) {
      return false;
    }
  }

  // ==================== STATUS BAR ====================

  /**
   * Set status bar to light style
   */
  async setStatusBarLight(): Promise<void> {
    try {
      await StatusBar.setStyle({ style: Style.Light });
    } catch (error) {
      console.log('Status bar styling not available');
    }
  }

  /**
   * Set status bar to dark style
   */
  async setStatusBarDark(): Promise<void> {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
    } catch (error) {
      console.log('Status bar styling not available');
    }
  }

  /**
   * Hide status bar
   */
  async hideStatusBar(): Promise<void> {
    try {
      await StatusBar.hide();
    } catch (error) {
      console.log('Status bar control not available');
    }
  }

  /**
   * Show status bar
   */
  async showStatusBar(): Promise<void> {
    try {
      await StatusBar.show();
    } catch (error) {
      console.log('Status bar control not available');
    }
  }

  // ==================== UTILITY ====================

  /**
   * Check if running on a native platform
   */
  isNativePlatform(): boolean {
    return (window as any).Capacitor?.isNativePlatform() || false;
  }

  /**
   * Get platform name
   */
  getPlatform(): string {
    return (window as any).Capacitor?.getPlatform() || 'web';
  }
}
