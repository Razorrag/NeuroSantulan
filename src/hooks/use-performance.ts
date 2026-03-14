import { useEffect, useRef, useState, RefObject } from 'react';

interface BrowserMemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface NetworkConnectionInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

type PerformanceWithMemory = Performance & {
  memory?: BrowserMemoryInfo;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkConnectionInfo;
};

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderTime: 0,
    renderCount: 0,
    lastRender: 0
  });

  useEffect(() => {
    renderCount.current += 1;
    const startTime = performance.now();
    
    // Measure render time
    const measureRender = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setPerformanceMetrics(prev => ({
        ...prev,
        renderTime,
        renderCount: renderCount.current,
        lastRender: typeof window !== 'undefined' ? Date.now() : 0
      }));

      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      }
    };

    const frameId = requestAnimationFrame(measureRender);

    return () => {
      cancelAnimationFrame(frameId);
    };
  });

  return performanceMetrics;
}

export function useIntersectionObserver<T extends Element>(
  elementRef: RefObject<T>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
}

export function useLazyLoad<T extends Element>(
  elementRef: RefObject<T>,
  loader: () => Promise<void>
) {
  const { hasIntersected } = useIntersectionObserver(elementRef);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const loadStarted = useRef(false);

  useEffect(() => {
    if (!hasIntersected || hasLoaded || loadStarted.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      loadStarted.current = true;
      setIsLoading(true);

      void loader()
        .then(() => {
          setHasLoaded(true);
        })
        .catch((error) => {
          console.error('Lazy loading failed:', error);
          loadStarted.current = false;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hasIntersected, hasLoaded, loader]);

  return { isLoading, hasLoaded };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const remaining = Math.max(limit - (now - lastRan.current), 0);
    const handler = setTimeout(() => {
      const executionTime = Date.now();
      if (executionTime - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = executionTime;
      }
    }, remaining);

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

export function useIdleCallback(callback: () => void, delay: number = 1000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const scheduleCallback = () => {
      timeoutRef.current = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => callback());
        } else {
          callback();
        }
      }, delay);
    };

    scheduleCallback();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
}

export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    used: number;
    total: number;
    limit: number;
    usage: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      const memory = (performance as PerformanceWithMemory).memory;
      if (memory) {
        setMemoryInfo({
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

export function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
    online: boolean;
  } | null>(null);

  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as NavigatorWithConnection).connection;
      setNetworkInfo({
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
        online: navigator.onLine
      });
    };

    updateNetworkInfo();

    const handleOnline = () => updateNetworkInfo();
    const handleOffline = () => updateNetworkInfo();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return networkInfo;
}
