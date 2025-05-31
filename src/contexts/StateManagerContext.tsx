
import React, { createContext, useContext, useRef } from 'react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import RefactoredStateSyncService from '@/services/RefactoredStateSyncService';

interface StateManagerContextType {
  syncService: RefactoredStateSyncService;
}

const StateManagerContext = createContext<StateManagerContextType | null>(null);

export const useStateManager = () => {
  const context = useContext(StateManagerContext);
  if (!context) {
    throw new Error('useStateManager must be used within StateManagerProvider');
  }
  return context;
};

export const StateManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const syncServiceRef = useRef<RefactoredStateSyncService>();

  if (!syncServiceRef.current) {
    syncServiceRef.current = new RefactoredStateSyncService(queryClient);
  }

  const value = {
    syncService: syncServiceRef.current
  };

  return (
    <StateManagerContext.Provider value={value}>
      {children}
    </StateManagerContext.Provider>
  );
};
