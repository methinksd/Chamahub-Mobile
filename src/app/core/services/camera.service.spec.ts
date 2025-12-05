import { TestBed } from '@angular/core/testing';
import { CameraService } from './camera.service';
import { NativeService } from './native.service';
import { Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

describe('CameraService', () => {
  let service: CameraService;
  let nativeServiceSpy: jasmine.SpyObj<NativeService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NativeService', [
      'requestCameraPermissions',
      'takePhoto',
      'pickFromGallery',
      'showToast'
    ]);

    TestBed.configureTestingModule({
      providers: [
        CameraService,
        { provide: NativeService, useValue: spy }
      ]
    });

    service = TestBed.inject(CameraService);
    nativeServiceSpy = TestBed.inject(NativeService) as jasmine.SpyObj<NativeService>;
  });

  describe('takePhoto', () => {
    it('should take photo successfully with granted permissions', async () => {
      const mockPermission = { camera: 'granted' as const, photos: 'granted' as const };
      const mockPhoto = {
        webPath: 'file:///photo.jpg',
        format: 'jpeg',
        saved: false
      };

      nativeServiceSpy.requestCameraPermissions.and.returnValue(Promise.resolve(mockPermission));
      nativeServiceSpy.takePhoto.and.returnValue(Promise.resolve(mockPhoto as any));
      spyOn(Preferences, 'set').and.returnValue(Promise.resolve());
      spyOn(Filesystem, 'writeFile').and.returnValue(Promise.resolve({ uri: 'file:///saved.jpg' }));

      const result = await service.takePhoto('test_key');
      
      expect(result).toBe('file:///photo.jpg');
      expect(nativeServiceSpy.requestCameraPermissions).toHaveBeenCalled();
      expect(nativeServiceSpy.takePhoto).toHaveBeenCalled();
    });

    it('should return null when permission denied', async () => {
      const mockPermission = { camera: 'denied' as const, photos: 'denied' as const };

      nativeServiceSpy.requestCameraPermissions.and.returnValue(Promise.resolve(mockPermission));
      nativeServiceSpy.showToast.and.returnValue(Promise.resolve());

      const result = await service.takePhoto('test_key');
      
      expect(result).toBeNull();
      expect(nativeServiceSpy.showToast).toHaveBeenCalledWith('Camera permission denied', 'short');
    });

    it('should handle photo capture error', async () => {
      const mockPermission = { camera: 'granted' as const, photos: 'granted' as const };

      nativeServiceSpy.requestCameraPermissions.and.returnValue(Promise.resolve(mockPermission));
      nativeServiceSpy.takePhoto.and.returnValue(Promise.reject('Camera error'));

      const result = await service.takePhoto('test_key');
      
      expect(result).toBeNull();
    });
  });

  describe('pickPhoto', () => {
    it('should pick photo from gallery successfully', async () => {
      const mockPhoto = {
        webPath: 'file:///gallery.jpg',
        format: 'jpeg',
        saved: false
      };

      nativeServiceSpy.pickFromGallery.and.returnValue(Promise.resolve(mockPhoto as any));
      spyOn(Preferences, 'set').and.returnValue(Promise.resolve());
      spyOn(Filesystem, 'writeFile').and.returnValue(Promise.resolve({ uri: 'file:///saved.jpg' }));

      const result = await service.pickPhoto('gallery_key');
      
      expect(result).toBe('file:///gallery.jpg');
      expect(nativeServiceSpy.pickFromGallery).toHaveBeenCalled();
    });

    it('should return null when no photo selected', async () => {
      nativeServiceSpy.pickFromGallery.and.returnValue(Promise.resolve(null));

      const result = await service.pickPhoto('test_key');
      
      expect(result).toBeNull();
    });
  });

  describe('loadPhoto', () => {
    it('should load saved photo successfully', async () => {
      const mockFilename = 'test_key.jpeg';
      const mockBase64 = 'base64data';

      spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: mockFilename }));
      spyOn(Filesystem, 'readFile').and.returnValue(Promise.resolve({ data: mockBase64 }));

      const result = await service.loadPhoto('test_key');
      
      expect(result).toBe(`data:image/jpeg;base64,${mockBase64}`);
      expect(Preferences.get).toHaveBeenCalledWith({ key: 'test_key' });
    });

    it('should return null when no photo stored', async () => {
      spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));

      const result = await service.loadPhoto('nonexistent_key');
      
      expect(result).toBeNull();
    });

    it('should handle file read error', async () => {
      spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: 'test.jpeg' }));
      spyOn(Filesystem, 'readFile').and.returnValue(Promise.reject('File not found'));
      spyOn(console, 'error');

      const result = await service.loadPhoto('test_key');
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error loading photo:', 'File not found');
    });
  });

  describe('deletePhoto', () => {
    it('should delete photo successfully', async () => {
      const mockFilename = 'test_photo.jpeg';

      spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: mockFilename }));
      spyOn(Filesystem, 'deleteFile').and.returnValue(Promise.resolve());
      spyOn(Preferences, 'remove').and.returnValue(Promise.resolve());

      await service.deletePhoto('test_key');
      
      expect(Filesystem.deleteFile).toHaveBeenCalled();
      expect(Preferences.remove).toHaveBeenCalledWith({ key: 'test_key' });
    });

    it('should handle deletion when no photo exists', async () => {
      spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));
      spyOn(Filesystem, 'deleteFile').and.returnValue(Promise.resolve());

      await service.deletePhoto('nonexistent_key');
      
      expect(Filesystem.deleteFile).not.toHaveBeenCalled();
    });

    it('should handle deletion error gracefully', async () => {
      spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: 'test.jpeg' }));
      spyOn(Filesystem, 'deleteFile').and.returnValue(Promise.reject('Delete error'));
      spyOn(console, 'error');

      await service.deletePhoto('test_key');
      
      expect(console.error).toHaveBeenCalledWith('Error deleting photo:', 'Delete error');
    });
  });

  describe('getPhotoUri', () => {
    it('should return photo URI successfully', async () => {
      const mockUri = 'file:///path/to/photo.jpg';

      spyOn(Filesystem, 'getUri').and.returnValue(Promise.resolve({ uri: mockUri }));

      const result = await service.getPhotoUri('photo.jpeg');
      
      expect(result).toBe(mockUri);
    });

    it('should return null on error', async () => {
      spyOn(Filesystem, 'getUri').and.returnValue(Promise.reject('Error'));
      spyOn(console, 'error');

      const result = await service.getPhotoUri('photo.jpeg');
      
      expect(result).toBeNull();
    });
  });

  describe('convertBlobToBase64', () => {
    it('should convert blob to base64', async () => {
      const blob = new Blob(['test'], { type: 'image/jpeg' });
      
      // Call private method using bracket notation
      const result = await (service as any).convertBlobToBase64(blob);
      
      expect(result).toContain('data:image/jpeg;base64');
    });
  });
});
