
// This is a re-export file to maintain backward compatibility
// as we refactor the auth hooks into smaller files

import { useAuthContext as useAuth } from './auth/useAuthContext';
import { AuthProvider } from './auth/useAuthProvider';

export { useAuth, AuthProvider };

export default useAuth;
