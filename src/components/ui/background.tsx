'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface BackgroundProps {
  children: ReactNode;
  disabled?: boolean;
}

// Softer, more performant color palette
const ORANGE = 'rgba(249, 115, 22, 0.25)';
const PURPLE = 'rgba(99, 102, 241, 0.25)';
const GREEN = 'rgba(34, 197, 94, 0.25)';

const COLOR_COMBINATIONS = [
  [ORANGE, PURPLE, GREEN],
  [PURPLE, GREEN, ORANGE],
  [GREEN, ORANGE, PURPLE],
] as const;

const ANIMATION_TIME = 45;
const BAR_COUNT = 12; // Reduced from 25 for better performance

const bars = Array.from({ length: BAR_COUNT }, (_, index) => {
  const colors = COLOR_COMBINATIONS[index % COLOR_COMBINATIONS.length];
  const duration = ANIMATION_TIME - ((ANIMATION_TIME / BAR_COUNT) / 2) * (index + 1);
  const delay = -((index + 1) / BAR_COUNT) * ANIMATION_TIME;

  return {
    index,
    style: {
      '--color-1': colors[0],
      '--color-2': colors[1],
      '--color-3': colors[2],
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    } as CSSProperties,
  };
});

// Hook to check reduced motion preference
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches); // eslint-disable-line react-hooks/set-state-in-effect

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);  
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Hook to check if mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);  
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function Background({ children, disabled = false }: BackgroundProps) {
  const isReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Disable on mobile or reduced motion for better performance
  if (disabled || isReducedMotion || isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="background-wrapper">
      <div className="rainbow-layer" aria-hidden="true">
        {bars.map((bar) => (
          <div key={bar.index} className="rainbow-bar" style={bar.style} />
        ))}
      </div>

      <div className="content">{children}</div>

      <style jsx global>{`
        .background-wrapper {
          position: relative;
          min-height: 100vh;
        }

        .rainbow-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          opacity: 0.35;
          filter: blur(80px);
          will-change: contents;
        }

        .rainbow-bar {
          position: absolute;
          top: 0;
          right: -25vw;
          width: 0;
          height: 100vh;
          transform: rotate(10deg);
          transform-origin: top right;
          will-change: right;
          box-shadow:
            -130px 0 80px 40px rgba(255, 255, 255, 0.15),
            -50px 0 50px 25px var(--color-1),
            0 0 50px 25px var(--color-2),
            50px 0 50px 25px var(--color-3),
            130px 0 80px 40px rgba(255, 255, 255, 0.15);
          animation-name: rainbow-slide;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          contain: layout style;
        }

        .content {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        @keyframes rainbow-slide {
          from {
            right: -25vw;
          }
          to {
            right: 125vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rainbow-bar {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }

        @media (max-width: 767px) {
          .rainbow-layer {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Background;
