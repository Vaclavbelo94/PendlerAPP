
import * as React from 'react';
import { AuthProvider } from './useAuthProvider';
import { useAuthContext } from './useAuthContext';

export const useAuth = useAuthContext;

export { AuthProvider };
