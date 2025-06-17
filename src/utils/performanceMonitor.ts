interface UserInteraction {
  type: string;
  element: string;
  timestamp: number;
}

class PerformanceMonitor {
  private interactions: UserInteraction[] = [];
  
  trackUserInteraction(type: string, element: string): void {
    this.interactions.push({
      type,
      element,
      timestamp: Date.now()
    });
    
    // Keep only last 100 interactions
    if (this.interactions.length > 100) {
      this.interactions.shift();
    }
  }
  
  getInteractions(): UserInteraction[] {
    return [...this.interactions];
  }
  
  clearInteractions(): void {
    this.interactions = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
