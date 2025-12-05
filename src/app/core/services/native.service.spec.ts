import { TestBed } from '@angular/core/testing';
import { NativeService } from './native.service';
import { Camera } from '@capacitor/camera';
import { Haptics } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';

describe('NativeService', () => {
  let service: NativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeService]
    });
    service = TestBed.inject(NativeService);
  });

  describe('Camera functionality', () => {
    it('should take photo successfully', async () => {
      const mockPhoto = {
        webPath: 'file:///path/to/photo.jpg',
        format: 'jpeg',
        saved: false
      };

      spyOn(Camera, 'getPhoto').and.returnValue(Promise.resolve(mockPhoto as any));

      const photo = await service.takePhoto();
      expect(photo).toEqual(mockPhoto);
      expect(Camera.getPhoto).toHaveBeenCalled();
    });

    it('should handle camera error gracefully', async () => {
      spyOn(Camera, 'getPhoto').and.returnValue(Promise.reject('Camera error'));

      const photo = await service.takePhoto();
      expect(photo).toBeNull();
    });

    it('should pick photo from gallery', async () => {
      const mockPhoto = {
        webPath: 'file:///path/to/gallery.jpg',
        format: 'jpeg',
        saved: false
      };

      spyOn(Camera, 'getPhoto').and.returnValue(Promise.resolve(mockPhoto as any));

      const photo = await service.pickFromGallery();
      expect(photo).toEqual(mockPhoto);
    });

    it('should request camera permissions', async () => {
      const mockPermissions = {
        camera: 'granted' as const,
        photos: 'granted' as const
      };

      spyOn(Camera, 'requestPermissions').and.returnValue(Promise.resolve(mockPermissions));

      const permissions = await service.requestCameraPermissions();
      expect(permissions.camera).toBe('granted');
      expect(Camera.requestPermissions).toHaveBeenCalled();
    });
  });

  describe('Haptics functionality', () => {
    it('should trigger light impact haptic', async () => {
      spyOn(Haptics, 'impact').and.returnValue(Promise.resolve());

      await service.hapticsImpactLight();
      expect(Haptics.impact).toHaveBeenCalledWith({ style: jasmine.any(Number) });
    });

    it('should trigger medium impact haptic', async () => {
      spyOn(Haptics, 'impact').and.returnValue(Promise.resolve());

      await service.hapticsImpactMedium();
      expect(Haptics.impact).toHaveBeenCalled();
    });

    it('should trigger heavy impact haptic', async () => {
      spyOn(Haptics, 'impact').and.returnValue(Promise.resolve());

      await service.hapticsImpactHeavy();
      expect(Haptics.impact).toHaveBeenCalled();
    });

    it('should trigger success notification haptic', async () => {
      spyOn(Haptics, 'notification').and.returnValue(Promise.resolve());

      await service.hapticsNotificationSuccess();
      expect(Haptics.notification).toHaveBeenCalled();
    });

    it('should handle haptics not available', async () => {
      spyOn(Haptics, 'impact').and.returnValue(Promise.reject('Not available'));
      spyOn(console, 'log');

      await service.hapticsImpactLight();
      expect(console.log).toHaveBeenCalledWith('Haptics not available');
    });
  });

  describe('Network functionality', () => {
    it('should get current network status', async () => {
      const mockStatus = {
        connected: true,
        connectionType: 'wifi' as const
      };

      spyOn(Network, 'getStatus').and.returnValue(Promise.resolve(mockStatus));

      const status = await service.getNetworkStatus();
      expect(status.connected).toBe(true);
      expect(status.connectionType).toBe('wifi');
    });

    it('should return observable for network status', (done) => {
      service.getNetworkStatus$().subscribe(status => {
        expect(status).toBeDefined();
        expect(status.connected).toBeDefined();
        done();
      });
    });

    it('should handle network error gracefully', async () => {
      spyOn(Network, 'getStatus').and.returnValue(Promise.reject('Network error'));

      const status = await service.getNetworkStatus();
      expect(status.connected).toBe(true); // Default fallback
      expect(status.connectionType).toBe('unknown');
    });
  });

  describe('Toast functionality', () => {
    it('should show toast with short duration', async () => {
      spyOn(Toast, 'show').and.returnValue(Promise.resolve());

      await service.showToast('Test message', 'short');
      expect(Toast.show).toHaveBeenCalledWith({
        text: 'Test message',
        duration: 'short',
        position: 'bottom'
      });
    });

    it('should show toast with long duration', async () => {
      spyOn(Toast, 'show').and.returnValue(Promise.resolve());

      await service.showToast('Long message', 'long');
      expect(Toast.show).toHaveBeenCalledWith({
        text: 'Long message',
        duration: 'long',
        position: 'bottom'
      });
    });

    it('should handle toast not available', async () => {
      spyOn(Toast, 'show').and.returnValue(Promise.reject('Not available'));
      spyOn(console, 'log');

      await service.showToast('Test');
      expect(console.log).toHaveBeenCalledWith('Toast not available, message:', 'Test');
    });
  });

  describe('Platform detection', () => {
    it('should detect native platform', () => {
      spyOn(service as any, 'getPlatform').and.returnValue('android');
      
      const isNative = service.isNativePlatform();
      expect(isNative).toBe(true);
    });

    it('should detect web platform', () => {
      spyOn(service as any, 'getPlatform').and.returnValue('web');
      
      const isNative = service.isNativePlatform();
      expect(isNative).toBe(false);
    });

    it('should return correct platform', () => {
      const platform = service.getPlatform();
      expect(['ios', 'android', 'web']).toContain(platform);
    });
  });
});
