
import { useCallback, useRef } from 'react';

// Hook pro stabilní callbacks bez zbytečných re-renderů
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const callbackRef = useRef<T>(callback);
  const depsRef = useRef(deps);

  // Porovnání dependencies
  const depsChanged = deps.some((dep, index) => dep !== depsRef.current[index]);

  if (depsChanged) {
    callbackRef.current = callback;
    depsRef.current = deps;
  }

  return useCallback(callbackRef.current, []);
};
