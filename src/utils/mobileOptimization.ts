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
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
    }, { passive: true });
  }

  private handleOrientationChange() {
    // Force layout recalculation
    document.body.style.height = '100vh';
    setTimeout(() => {
      document.body.style.height = '';
    }, 100);

    // Emit custom event for components to react
    window.dispatchEvent(new CustomEvent('mobile-orientation-change', {
      detail: {
        orientation: window.screen?.orientation?.angle || 0,
        isLandscape: window.innerWidth > window.innerHeight
      }
    }));
  }

  private handleResize() {
    // Update CSS custom properties for viewport height
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );
  }

  private adjustForKeyboard(isOpen: boolean) {
    const translateElements = document.querySelectorAll('[data-keyboard-adjust]');
    
    translateElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      if (isOpen) {
        const adjustment = htmlElement.dataset.keyboardAdjust || '-50px';
        htmlElement.style.transform = `translateY(${adjustment})`;
      } else {
        htmlElement.style.transform = '';
      }
    });
  }

  private handleSwipeLeft() {
    window.dispatchEvent(new CustomEvent('mobile-swipe-left'));
  }

  private handleSwipeRight() {
    window.dispatchEvent(new CustomEvent('mobile-swipe-right'));
  }

  public destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.orientationTimeout) {
      clearTimeout(this.orientationTimeout);
    }

    // Remove event listeners
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    window.removeEventListener('resize', this.handleResize);
  }
}

// Initialize mobile optimization
export const mobileOptimizer = new MobileOptimizer();

// Hook for React components
export const useMobileOptimization = (config?: MobileOptimizationConfig) => {
  React.useEffect(() => {
    const optimizer = new MobileOptimizer(config);
    return () => optimizer.destroy();
  }, [config]);

  return {
    isMobile: window.innerWidth <= 768,
    isLandscape: window.innerWidth > window.innerHeight,
    isKeyboardOpen: document.body.classList.contains('keyboard-open')
  };
};
