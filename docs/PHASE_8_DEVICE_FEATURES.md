# Phase 8: Advanced Device Features & Native Capabilities

## Overview

Phase 8 implements advanced device features including camera access, geolocation/maps, biometric authentication, file management, and device sensors for a fully native-like mobile experience.

## Features Implemented

### 1. Camera & Photo Capture
- **Camera access** with front/back switching
- **Photo capture** with preview
- **Gallery access** for existing photos
- **Image compression** before upload
- **Permission handling** with user prompts
- **Fallback UI** for unsupported devices

### 2. Geolocation & Maps
- **Current location** tracking
- **Location permissions** management
- **Distance calculations** between points
- **Geocoding** (address to coordinates)
- **Reverse geocoding** (coordinates to address)
- **Location history** tracking
- **Battery-efficient** location updates

### 3. Biometric Authentication
- **Fingerprint** authentication
- **Face ID** support (iOS)
- **Fallback** to device PIN/password
- **Session management** with biometrics
- **Secure credential** storage
- **Platform detection** (iOS/Android/Web)

### 4. File Management
- **File picker** with type filtering
- **Multiple file** selection
- **Drag & drop** support (desktop)
- **File validation** (size, type)
- **Upload progress** tracking
- **File preview** generation
- **Automatic compression** for images

### 5. Device Sensors
- **Accelerometer** access
- **Gyroscope** data
- **Device orientation** tracking
- **Motion detection** for gestures
- **Battery status** monitoring
- **Network type** detection (WiFi/4G/5G)

### 6. Native Integrations
- **Contact picker** (when available)
- **Calendar access** (read/write events)
- **Device info** (model, OS version)
- **Clipboard** access (read/write)
- **Screen brightness** control
- **Keep screen awake** functionality

## Usage

### Camera Access
```typescript
import { useCamera } from '@/hooks/useCamera';

function PhotoCapture() {
  const { 
    capturePhoto, 
    openGallery, 
    isSupported, 
    hasPermission,
    requestPermission 
  } = useCamera();
  
  const handleCapture = async () => {
    if (!hasPermission) {
      await requestPermission();
    }
    
    const photo = await capturePhoto({
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080
    });
    
    // Use photo.dataUrl for display or upload
  };
  
  return (
    <Button onClick={handleCapture} disabled={!isSupported}>
      Take Photo
    </Button>
  );
}
```

### Geolocation
```typescript
import { useGeolocation } from '@/hooks/useGeolocation';

function LocationTracker() {
  const { 
    position, 
    error, 
    isLoading,
    getCurrentPosition,
    watchPosition,
    stopWatching,
    calculateDistance 
  } = useGeolocation();
  
  useEffect(() => {
    getCurrentPosition();
  }, []);
  
  return (
    <div>
      {position && (
        <p>
          Lat: {position.latitude}, 
          Lng: {position.longitude}
        </p>
      )}
    </div>
  );
}
```

### Biometric Authentication
```typescript
import { useBiometrics } from '@/hooks/useBiometrics';

function SecureLogin() {
  const { 
    isSupported, 
    biometricType, 
    authenticate,
    isEnrolled 
  } = useBiometrics();
  
  const handleBiometricLogin = async () => {
    const result = await authenticate({
      title: 'Login Required',
      subtitle: 'Authenticate to access your account',
      fallbackLabel: 'Use PIN'
    });
    
    if (result.success) {
      // Proceed with login
    }
  };
  
  if (!isSupported || !isEnrolled) {
    return <PasswordLogin />;
  }
  
  return (
    <Button onClick={handleBiometricLogin}>
      Login with {biometricType === 'face' ? 'Face ID' : 'Fingerprint'}
    </Button>
  );
}
```

### File Upload
```typescript
import { useFileUpload } from '@/hooks/useFileUpload';

function DocumentUpload() {
  const { 
    selectFile, 
    selectMultiple,
    uploadFile,
    progress,
    isUploading 
  } = useFileUpload();
  
  const handleUpload = async () => {
    const files = await selectMultiple({
      accept: 'image/*,application/pdf',
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    });
    
    for (const file of files) {
      await uploadFile(file, {
        bucket: 'documents',
        path: `users/${userId}/${file.name}`
      });
    }
  };
  
  return (
    <div>
      <Button onClick={handleUpload} disabled={isUploading}>
        Upload Files
      </Button>
      {isUploading && <Progress value={progress} />}
    </div>
  );
}
```

### Device Sensors
```typescript
import { useDeviceSensors } from '@/hooks/useDeviceSensors';

function MotionDetector() {
  const { 
    acceleration, 
    orientation,
    battery,
    networkType,
    startMonitoring,
    stopMonitoring 
  } = useDeviceSensors();
  
  useEffect(() => {
    startMonitoring(['accelerometer', 'orientation', 'battery']);
    
    return () => stopMonitoring();
  }, []);
  
  return (
    <div>
      <p>Network: {networkType}</p>
      <p>Battery: {battery.level}%</p>
      {acceleration && (
        <p>Motion: {Math.abs(acceleration.x).toFixed(2)}</p>
      )}
    </div>
  );
}
```

## Components

### CameraCapture
- Full-screen camera UI
- Switch between front/back camera
- Flash control
- Zoom functionality
- Photo preview before save

### LocationPicker
- Interactive map display
- Current location button
- Address search
- Place selection
- Distance display

### BiometricPrompt
- Native biometric UI
- Fallback password input
- Error handling
- Retry logic

### FileDropzone
- Drag & drop area
- Click to select
- File preview grid
- Remove files option
- Upload progress

### SensorMonitor
- Real-time sensor data display
- Motion visualization
- Battery indicator
- Network status
- Developer debug panel

## Best Practices

### Camera
- ✅ Request permission before access
- ✅ Provide clear UI for permission denial
- ✅ Compress images before upload
- ✅ Show preview before saving
- ❌ Don't access camera in background
- ❌ Don't store raw full-resolution images

### Geolocation
- ✅ Request minimum required accuracy
- ✅ Stop tracking when not needed
- ✅ Handle permission denial gracefully
- ✅ Cache location for offline use
- ❌ Don't track continuously (battery drain)
- ❌ Don't request location without context

### Biometrics
- ✅ Always provide fallback authentication
- ✅ Explain why biometrics are needed
- ✅ Store only tokens, never passwords
- ✅ Re-authenticate for sensitive actions
- ❌ Don't force biometric enrollment
- ❌ Don't bypass security on failure

### File Upload
- ✅ Validate file types and sizes
- ✅ Show upload progress
- ✅ Handle upload failures
- ✅ Compress media files
- ❌ Don't upload without validation
- ❌ Don't block UI during upload

### Sensors
- ✅ Stop monitoring when not needed
- ✅ Throttle sensor updates
- ✅ Handle permission changes
- ✅ Test on real devices
- ❌ Don't poll sensors continuously
- ❌ Don't ignore battery impact

## Performance Impact

- Camera: +8KB (camera handling)
- Geolocation: +6KB (location services)
- Biometrics: +4KB (auth wrapper)
- File Upload: +7KB (upload manager)
- Sensors: +5KB (sensor monitoring)
- Total: ~30KB additional bundle size

## Browser/Platform Support

| Feature | Chrome | Safari | Firefox | Samsung | iOS | Android |
|---------|--------|--------|---------|---------|-----|---------|
| Camera | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Geolocation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Biometrics | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅* | ✅* |
| File Upload | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Accelerometer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gyroscope | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Battery API | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |

*Requires native wrapper (Capacitor/Cordova) for full biometric support

## Testing

### Camera Testing
- [ ] Permission request works
- [ ] Camera switches (front/back)
- [ ] Photo captures successfully
- [ ] Gallery access works
- [ ] Image compression works

### Location Testing
- [ ] Permission request works
- [ ] Current location accurate
- [ ] Location updates work
- [ ] Geocoding functional
- [ ] Battery efficient

### Biometric Testing
- [ ] Detection works correctly
- [ ] Authentication succeeds
- [ ] Fallback works
- [ ] Error handling correct
- [ ] Session management secure

### File Upload Testing
- [ ] File selection works
- [ ] Validation correct
- [ ] Progress tracking accurate
- [ ] Upload completes
- [ ] Error handling works

### Sensor Testing
- [ ] Sensor detection works
- [ ] Data updates correctly
- [ ] Throttling effective
- [ ] Memory efficient
- [ ] Battery impact minimal

## Security Considerations

### Camera & Files
- Validate all file types on backend
- Scan uploaded files for malware
- Limit file sizes appropriately
- Store with secure permissions
- Delete temporary files

### Location
- Request minimum precision needed
- Don't store location unnecessarily
- Encrypt location data at rest
- Allow users to clear history
- Respect privacy preferences

### Biometrics
- Never store biometric data
- Use platform secure storage only
- Re-authenticate for sensitive actions
- Provide audit logs
- Allow disabling biometrics

## Capacitor Integration

For full native capabilities, integrate with Capacitor:

```typescript
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

// Camera with Capacitor
const capturePhoto = async () => {
  const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera
  });
  return photo.webPath;
};

// Biometrics with Capacitor
const authenticate = async () => {
  const result = await NativeBiometric.verifyIdentity({
    reason: 'For secure login',
    title: 'Authentication Required'
  });
  return result.verified;
};
```

## Maintenance

- Test on new device models
- Monitor permission denial rates
- Track feature usage analytics
- Update for new OS versions
- Review security regularly

## Next Steps

- Add QR code scanner
- Implement barcode reader
- Add NFC support
- Integrate payment APIs
- Add voice recognition

## Resources

- [Camera API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [Sensor APIs](https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
