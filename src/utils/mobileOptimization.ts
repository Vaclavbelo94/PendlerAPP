import React from 'react';

interface MobileOptimizationConfig {
  enableTouchOptimization?: boolean;
  enableViewportOptimization?: boolean;
  enableKeyboardHandling?: boolean;
  enableGestureSupport?: boolean;
}

class MobileOptimizer {
  private config: Required<MobileOptimizationConfig>;
  private resizeObserver?: ResizeObserver;
  private orientationTimeout?: NodeJS.Timeout;

  constructor(config: MobileOptimizationConfig = {}) {
    this.config = {
      enableTouchOptimization: true,
      enableViewportOptimization: true,
      enableKeyboardHandling: true,
      enableGestureSupport: true,
      ...config
    };

    this.initialize();
  }

  private initialize() {
    if (this.config.enableViewportOptimization) {
      this.setupViewportOptimization();
    }

    if (this.config.enableTouchOptimization) {
      this.setupTouchOptimization();
    }

    if (this.config.enableKeyboardHandling) {
      this.setupKeyboardHandling();
    }

    if (this.config.enableGestureSupport) {
      this.setupGestureSupport();
    }
  }

  private setupViewportOptimization() {
    // Prevent zoom on input focus for iOS
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      if (this.orientationTimeout) {
        clearTimeout(this.orientationTimeout);
      }
      
      this.orientationTimeout = setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });

    // Handle resize events
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(() => {
        this.handleResize();
      });
    });

    this.resizeObserver.observe(document.body);
  }

  private setupTouchOptimization() {
    // Disable default touch behaviors that might interfere
    document.addEventListener('touchstart', (e) => {
      // Allow natural scrolling
      const target = e.target as HTMLElement;
      if (target.closest('.prevent-touch-default')) {
        e.preventDefault();
      }
    }, { passive: false });

    // Optimize touch feedback
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      input, textarea, [contenteditable] {
        -webkit-user-select: text;
        user-select: text;
      }
      
      button, [role="button"] {
        touch-action: manipulation;
      }
    `;
    document.head.appendChild(style);
  }

  private setupKeyboardHandling() {
    let initialViewportHeight = window.innerHeight;

    // Detect virtual keyboard
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      if (heightDifference > 150) {
        // Virtual keyboard is likely open
        document.body.classList.add('keyboard-open');
        this.adjustForKeyboard(true);
      } else {
        // Virtual keyboard is likely closed
        document.body.classList.remove('keyboard-open');
        this.adjustForKeyboard(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Handle input focus
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea')) {
        setTimeout(() => {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300);
      }
    });
  }

  private setupGestureSupport() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', () => {
      const diffX = startX - currentX;
      const diffY = startY - currentY;
      
      // Determine swipe direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.handleSwipe('left');
          } else {
            this.handleSwipe('right');
          }
        }
      } else {
        if (Math.abs(diffY) > 50) {
          if (diffY > 0) {
            this.handleSwipe('up');
          } else {
            this.handleSwipe('down');
          }
        }
      }
    }, { passive: true });
  }

  private handleOrientationChange() {
    // Force reflow to handle orientation changes
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }

  private handleResize() {
    // Handle resize events
    const event = new CustomEvent('mobileResize', {
      detail: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
    window.dispatchEvent(event);
  }

  private adjustForKeyboard(isOpen: boolean) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && isOpen) {
      // Adjust viewport when keyboard is open
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  }

  private handleSwipe(direction: 'left' | 'right' | 'up' | 'down') {
    const event = new CustomEvent('mobileSwipe', {
      detail: { direction }
    });
    window.dispatchEvent(event);
  }

  public destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.orientationTimeout) {
      clearTimeout(this.orientationTimeout);
    }
  }
}

// Hook for React components
export const useMobileOptimization = (config?: MobileOptimizationConfig) => {
  React.useEffect(() => {
    const optimizer = new MobileOptimizer(config);
    
    return () => {
      optimizer.destroy();
    };
  }, []);
};

// Utility functions
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroidDevice = () => {
  return /Android/.test(navigator.userAgent);
};

export const getTouchCapabilities = () => {
  return {
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    hasMouse: window.matchMedia('(hover: hover)').matches,
    hasCoarsePointer: window.matchMedia('(pointer: coarse)').matches
  };
};

export default MobileOptimizer;