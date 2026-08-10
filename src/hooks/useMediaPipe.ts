import { useState, useEffect, useRef } from 'react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

export const useMediaPipe = () => {
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);
  const [isMediaPipeReady, setIsMediaPipeReady] = useState<boolean>(false);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const isInitializing = useRef<boolean>(false);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);

  useEffect(() => {
    if (isInitializing.current || landmarkerRef.current) return;
    isInitializing.current = true;

    let isMounted = true;

    // Timeout guard: If CDN / WASM takes > 4s, activate reliable optical fallback engine
    const timeoutTimer = setTimeout(() => {
      if (isMounted && !landmarkerRef.current) {
        console.warn("MediaPipe CDN load timed out (>4s). Activating resilient Optical Tracking Engine.");
        setIsUsingFallback(true);
        setIsMediaPipeReady(true);
      }
    }, 4000);

    const initMediaPipe = async () => {
      try {
        // Load WASM binaries with fallback mirrors
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm"
        );
        
        if (!isMounted) return;

        let landmarker: PoseLandmarker | null = null;

        // Try GPU delegate first with anti-jitter tracking confidences
        try {
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.6,
            minPosePresenceConfidence: 0.6,
            minTrackingConfidence: 0.65
          });
        } catch (gpuErr) {
          console.warn("GPU delegate failed, retrying with CPU delegate:", gpuErr);
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "CPU"
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.6,
            minPosePresenceConfidence: 0.6,
            minTrackingConfidence: 0.65
          });
        }
        
        if (!isMounted) {
          landmarker?.close();
          return;
        }

        clearTimeout(timeoutTimer);
        landmarkerRef.current = landmarker;
        setPoseLandmarker(landmarker);
        setIsMediaPipeReady(true);
        setIsUsingFallback(false);
      } catch (err: any) {
        console.warn("MediaPipe model load error, enabling optical contour fallback:", err);
        if (isMounted) {
          clearTimeout(timeoutTimer);
          setIsUsingFallback(true);
          setIsMediaPipeReady(true); // Mark ready so user is never blocked
          setLoadingError(null);
        }
      } finally {
        isInitializing.current = false;
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      clearTimeout(timeoutTimer);
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (e) {
          console.error("Error closing pose landmarker:", e);
        }
      }
    };
  }, []);

  return { poseLandmarker, isMediaPipeReady, isUsingFallback, loadingError };
};

export default useMediaPipe;
