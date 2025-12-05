import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { NativeService } from './native.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  constructor(private nativeService: NativeService) {}

  /**
   * Take a photo and save it with a specific key
   */
  async takePhoto(saveKey: string): Promise<string | null> {
    try {
      // Request permissions first
      const permission = await this.nativeService.requestCameraPermissions();
      if (permission.camera !== 'granted') {
        await this.nativeService.showToast('Camera permission denied', 'short');
        return null;
      }

      // Take photo
      const photo = await this.nativeService.takePhoto();
      if (!photo) {
        return null;
      }

      // Save and return webPath
      await this.savePhoto(photo, saveKey);
      return photo.webPath || null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }

  /**
   * Pick photo from gallery and save it with a specific key
   */
  async pickPhoto(saveKey: string): Promise<string | null> {
    try {
      const photo = await this.nativeService.pickFromGallery();
      if (!photo) {
        return null;
      }

      await this.savePhoto(photo, saveKey);
      return photo.webPath || null;
    } catch (error) {
      console.error('Error picking photo:', error);
      return null;
    }
  }

  /**
   * Load saved photo by key
   */
  async loadPhoto(saveKey: string): Promise<string | null> {
    try {
      // Get filepath from preferences
      const { value } = await Preferences.get({ key: saveKey });
      if (!value) {
        return null;
      }

      // Read file
      const readFile = await Filesystem.readFile({
        path: value,
        directory: Directory.Data
      });
      
      return `data:image/jpeg;base64,${readFile.data}`;
    } catch (error) {
      console.error('Error loading photo:', error);
      return null;
    }
  }

  /**
   * Delete saved photo by key
   */
  async deletePhoto(saveKey: string): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: saveKey });
      if (value) {
        await Filesystem.deleteFile({
          path: value,
          directory: Directory.Data
        });
        await Preferences.remove({ key: saveKey });
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }

  /**
   * Get photo file URI
   */
  async getPhotoUri(filepath: string): Promise<string | null> {
    try {
      const uri = await Filesystem.getUri({
        directory: Directory.Data,
        path: filepath
      });
      return uri.uri;
    } catch (error) {
      console.error('Error getting photo URI:', error);
      return null;
    }
  }

  /**
   * Save photo to filesystem with key
   */
  private async savePhoto(photo: Photo, saveKey: string): Promise<void> {
    const fileName = `${saveKey}.jpeg`;
    
    let base64Data: string;

    // Read photo as base64
    if (photo.base64String) {
      base64Data = photo.base64String;
    } else if (photo.webPath) {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      base64Data = await this.convertBlobToBase64(blob) as string;
    } else {
      return;
    }

    // Save to data directory
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Store the filepath in preferences
    await Preferences.set({
      key: saveKey,
      value: fileName
    });
  }

  /**
   * Convert blob to base64
   */
  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
}
