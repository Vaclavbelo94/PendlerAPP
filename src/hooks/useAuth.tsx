
// This is a re-export file to maintain backward compatibility
// as we refactor the auth hooks into smaller files

import { useAuth, AuthProvider } from './auth';

export { useAuth, AuthProvider };

export default useAuth;
