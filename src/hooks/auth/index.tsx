
import { useAuthContext } from './useAuthContext';
import { AuthProvider } from './useAuthProvider';
import { useOptimizedAuth } from './useOptimizedAuth';
import { useUnifiedAuth } from './useUnifiedAuth';

export const useAuth = useAuthContext;
export { AuthProvider, useOptimizedAuth, useUnifiedAuth };
