import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Discover available video input devices
  const updateDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error listing camera devices:', err);
    }
  }, [selectedDeviceId]);

  // Start webcam stream
  const startWebcam = useCallback(async (deviceId?: string) => {
    // Stop any existing stream first
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const targetDeviceId = deviceId || selectedDeviceId;
    const constraints: MediaStreamConstraints = {
      video: targetDeviceId 
        ? { deviceId: { exact: targetDeviceId }, width: { ideal: 640 }, height: { ideal: 480 } }
        : { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
    };

    try {
      setPermissionError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
      }
      
      // Update device list now that permissions are granted
      await updateDevices();
    } catch (err: any) {
      console.error('Error starting camera stream:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Camera permission denied. Please allow camera access in your browser settings.');
      } else {
        setPermissionError(`Failed to access camera: ${err.message || 'Unknown error'}`);
      }
      setIsCameraActive(false);
    }
  }, [selectedDeviceId, stream, updateDevices]);

  // Stop webcam stream
  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, [stream]);

  // Capture canvas frame helper
  const captureFrame = useCallback((targetCanvas: HTMLCanvasElement): string | null => {
    if (!videoRef.current || !isCameraActive) return null;
    const context = targetCanvas.getContext('2d');
    if (!context) return null;

    // Match canvas dimensions to the video
    const width = videoRef.current.videoWidth || 640;
    const height = videoRef.current.videoHeight || 480;
    targetCanvas.width = width;
    targetCanvas.height = height;

    // Draw the current video frame on the canvas
    context.drawImage(videoRef.current, 0, 0, width, height);

    // Return as data URL
    return targetCanvas.toDataURL('image/jpeg');
  }, [isCameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    isCameraActive,
    permissionError,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    startWebcam,
    stopWebcam,
    captureFrame
  };
};

export default useWebcam;
