import React, { useRef, useEffect, useState } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { Button } from '@/components/ui/button';
import { Camera, SwitchCamera, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
  onCapture: (photo: { dataUrl: string; blob: Blob }) => void;
  onClose: () => void;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1080
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    openGallery,
    isSupported,
    hasPermission,
    requestPermission
  } = useCamera();

  useEffect(() => {
    initCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const initCamera = async () => {
    if (!isSupported) {
      setError('Camera not supported on this device');
      return;
    }

    try {
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          setError('Camera permission denied');
          return;
        }
      }

      if (videoRef.current) {
        await startCamera(videoRef.current, { quality, maxWidth, maxHeight });
        setIsReady(true);
      }
    } catch (err) {
      console.error('Camera init error:', err);
      setError('Failed to start camera');
    }
  };

  const handleCapture = async () => {
    try {
      const photo = await capturePhoto({ quality, maxWidth, maxHeight });
      onCapture(photo);
      stopCamera();
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture photo');
    }
  };

  const handleSwitchCamera = async () => {
    if (videoRef.current) {
      try {
        await switchCamera(videoRef.current);
      } catch (err) {
        console.error('Switch camera error:', err);
      }
    }
  };

  const handleGallery = async () => {
    try {
      const photo = await openGallery();
      onCapture(photo);
      stopCamera();
    } catch (err) {
      console.error('Gallery error:', err);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video Preview */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            !isReady && "opacity-0"
          )}
        />
        
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white">Starting camera...</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/80 backdrop-blur-sm p-6 safe-bottom">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Capture Button */}
          <Button
            onClick={handleCapture}
            disabled={!isReady}
            className="h-16 w-16 rounded-full bg-white hover:bg-white/90 disabled:opacity-50"
          >
            <Camera className="h-8 w-8 text-black" />
          </Button>

          {/* Gallery/Switch */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGallery}
              className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <ImageIcon className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwitchCamera}
              disabled={!isReady}
              className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50"
            >
              <SwitchCamera className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
