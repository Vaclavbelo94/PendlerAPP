
interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0];
        this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime;
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }

    // Navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        
        // FCP
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.firstContentfulPaint = fcpEntry.startTime;
        }
        
        this.reportMetrics();
      }, 1000);
    });
  }

  private reportMetrics() {
    // Report metrics pouze v production
    if (process.env.NODE_ENV === 'production') {
      console.log('Performance Metrics:', this.metrics);
      
      // Zde by se mohly metrics poslat na monitoring službu
      //例如: analytics.track('performance', this.metrics);
    }
  }

  // Method pro manuální měření custom metrics
  public measureCustomMetric(name: string, startTime: number) {
    const duration = performance.now() - startTime;
    console.log(`Custom Metric ${name}:`, duration, 'ms');
    return duration;
  }

  // Cleanup observers
  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Utility funkce pro měření výkonu komponent
export const measureComponentRender = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 16) { // Více než 1 frame (16ms)
      console.warn(`Slow component render: ${componentName} took ${duration.toFixed(2)}ms`);
    }
  };
};

// Hook pro měření výkonu komponent
export const usePerformanceMeasurement = (componentName: string) => {
  React.useEffect(() => {
    const measureEnd = measureComponentRender(componentName);
    return measureEnd;
  }, [componentName]);
};
