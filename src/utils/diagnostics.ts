
export const logPageLoad = (pageName: string) => {
  console.log(`[DIAGNOSTIC] ${pageName} page started loading at:`, new Date().toISOString());
  performance.mark(`${pageName}-start`);
};

export const logPageReady = (pageName: string) => {
  console.log(`[DIAGNOSTIC] ${pageName} page finished loading at:`, new Date().toISOString());
  performance.mark(`${pageName}-end`);
  
  try {
    performance.measure(`${pageName}-load-time`, `${pageName}-start`, `${pageName}-end`);
    const measure = performance.getEntriesByName(`${pageName}-load-time`)[0];
    console.log(`[DIAGNOSTIC] ${pageName} load time:`, measure.duration, 'ms');
  } catch (error) {
    console.warn(`[DIAGNOSTIC] Could not measure ${pageName} load time:`, error);
  }
};

export const logError = (context: string, error: any) => {
  console.error(`[DIAGNOSTIC ERROR] ${context}:`, error);
  
  // Log additional context
  console.error(`[DIAGNOSTIC ERROR] Stack trace:`, error?.stack);
  console.error(`[DIAGNOSTIC ERROR] Error type:`, typeof error);
  console.error(`[DIAGNOSTIC ERROR] Error name:`, error?.name);
  console.error(`[DIAGNOSTIC ERROR] Error message:`, error?.message);
};

export const logComponentMount = (componentName: string) => {
  console.log(`[DIAGNOSTIC] Component ${componentName} mounted`);
};

export const logComponentUnmount = (componentName: string) => {
  console.log(`[DIAGNOSTIC] Component ${componentName} unmounted`);
};
