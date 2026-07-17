import { useState, useEffect } from 'react';

declare global {
  interface Window {
    cv: any;
    Module?: any;
  }
}

export const useOpenCv = () => {
  const [isOpenCvReady, setIsOpenCvReady] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    // If cv is already loaded and ready
    if (window.cv && window.cv.Mat) {
      setIsOpenCvReady(true);
      return;
    }

    let intervalId: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;

    const checkOpenCv = () => {
      // OpenCV is fully loaded when window.cv is defined AND has loaded core functions (like cv.Mat)
      if (window.cv && window.cv.Mat && typeof window.cv.Mat === 'function') {
        setIsOpenCvReady(true);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      }
    };

    // Set up check loop
    intervalId = setInterval(checkOpenCv, 250);

    // Timeout after 20 seconds
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (!window.cv || !window.cv.Mat) {
        setLoadingError('OpenCV.js load timeout. Please check your internet connection or reload.');
      }
    }, 20000);

    // Also attach to onRuntimeInitialized if Module exists
    if (!window.Module) {
      window.Module = {};
    }
    
    const prevRuntimeInitialized = window.Module.onRuntimeInitialized;
    window.Module.onRuntimeInitialized = () => {
      if (prevRuntimeInitialized) prevRuntimeInitialized();
      setIsOpenCvReady(true);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return { isOpenCvReady, loadingError };
};
export default useOpenCv;
