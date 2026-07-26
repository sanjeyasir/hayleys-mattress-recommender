import { useState, useEffect, useRef } from 'react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

export const useMediaPipe = () => {
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);
  const [isMediaPipeReady, setIsMediaPipeReady] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const isInitializing = useRef<boolean>(false);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);

  useEffect(() => {
    if (poseLandmarker || isInitializing.current) return;
    isInitializing.current = true;

    const initMediaPipe = async () => {
      try {
        // Load WASM binaries from jsDelivr CDN
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm"
        );
        
        // Load the lite model asset from googleapis storage
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numPoses: 1
        });
        
        landmarkerRef.current = landmarker;
        setPoseLandmarker(landmarker);
        setIsMediaPipeReady(true);
      } catch (err: any) {
        console.error("Error loading MediaPipe PoseLandmarker:", err);
        setLoadingError(`Failed to load MediaPipe Pose: ${err.message || err}`);
      } finally {
        isInitializing.current = false;
      }
    };

    initMediaPipe();

    return () => {
      // Clean up landmarker resources on unmount if supported
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (e) {
          console.error("Error closing pose landmarker:", e);
        }
      }
    };
  }, []);

  return { poseLandmarker, isMediaPipeReady, loadingError };
};

export default useMediaPipe;
