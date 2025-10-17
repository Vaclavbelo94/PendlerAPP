import { useState, useCallback, useRef } from 'react';

interface CameraOptions {
  quality?: number; // 0-1
  maxWidth?: number;
  maxHeight?: number;
  facingMode?: 'user' | 'environment';
}

interface CapturedPhoto {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check if camera is supported
  const checkSupport = useCallback(() => {
    const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    setIsSupported(supported);
    return supported;
  }, []);

  // Request camera permission
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      setHasPermission(false);
      return false;
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (
    videoElement: HTMLVideoElement,
    options: CameraOptions = {}
  ) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: options.facingMode || 'environment',
          width: { ideal: options.maxWidth || 1920 },
          height: { ideal: options.maxHeight || 1080 }
        }
      });

      videoElement.srcObject = stream;
      videoRef.current = videoElement;
      streamRef.current = stream;
      setHasPermission(true);
      
      return stream;
    } catch (error) {
      console.error('Failed to start camera:', error);
      setHasPermission(false);
      throw error;
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
  }, []);

  // Capture photo from video stream
  const capturePhoto = useCallback(async (
    options: CameraOptions = {}
  ): Promise<CapturedPhoto> => {
    if (!videoRef.current || !streamRef.current) {
      throw new Error('Camera not started');
    }

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Set canvas size
      const maxWidth = options.maxWidth || 1920;
      const maxHeight = options.maxHeight || 1080;
      let width = video.videoWidth;
      let height = video.videoHeight;

      // Scale down if needed
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      
      ctx.drawImage(video, 0, 0, width, height);

      // Convert to blob
      const quality = options.quality || 0.8;
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          'image/jpeg',
          quality
        );
      });

      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      return { dataUrl, blob, width, height };
    } finally {
      setIsCapturing(false);
    }
  }, []);

  // Open device gallery/file picker
  const openGallery = useCallback(async (): Promise<CapturedPhoto> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }
              
              ctx.drawImage(img, 0, 0);
              
              canvas.toBlob((blob) => {
                if (!blob) {
                  reject(new Error('Failed to create blob'));
                  return;
                }
                
                resolve({
                  dataUrl: event.target?.result as string,
                  blob,
                  width: img.width,
                  height: img.height
                });
              }, 'image/jpeg', 0.8);
            };
            
            img.src = event.target?.result as string;
          };
          
          reader.readAsDataURL(file);
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  }, []);

  // Switch camera (front/back)
  const switchCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    const currentFacingMode = streamRef.current
      ?.getVideoTracks()[0]
      .getSettings().facingMode;
    
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    
    stopCamera();
    await startCamera(videoElement, { facingMode: newFacingMode });
  }, [startCamera, stopCamera]);

  return {
    hasPermission,
    isSupported,
    isCapturing,
    checkSupport,
    requestPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    openGallery,
    switchCamera
  };
};
