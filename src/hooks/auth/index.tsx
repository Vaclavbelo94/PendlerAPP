
import { useAuthContext } from './useAuthContext';
import { AuthProvider } from './useAuthProvider';
import { useUnifiedAuth } from './useUnifiedAuth';

export const useAuth = useAuthContext;
export { AuthProvider, useUnifiedAuth };
