import { lazy, ComponentType } from 'react';

/**
 * Enhanced lazy loading with retry logic and error handling
 */
export const lazyLoadWithRetry = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3,
  interval = 1000
): React.LazyExoticComponent<T> => {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (attemptsLeft: number) => {
        importFunc()
          .then(resolve)
          .catch((error) => {
            if (attemptsLeft === 1) {
              reject(error);
              return;
            }
            
            console.warn(`Failed to load component, ${attemptsLeft - 1} retries left`);
            setTimeout(() => {
              attemptImport(attemptsLeft - 1);
            }, interval);
          });
      };
      
      attemptImport(retries);
    });
  });
};

/**
 * Preload a lazy component
 */
export const preloadComponent = (importFunc: () => Promise<any>) => {
  importFunc().catch(() => {
    console.warn('Failed to preload component');
  });
};

/**
 * Create lazy component with preload method
 */
export const createLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const LazyComponent = lazyLoadWithRetry(importFunc);
  
  return {
    Component: LazyComponent,
    preload: () => preloadComponent(importFunc),
  };
};
