
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock providers for testing
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="auth-provider">{children}</div>;
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="theme-provider">{children}</div>;
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  withAuth?: boolean;
  withQuery?: boolean;
}

const createTestWrapper = (options: CustomRenderOptions = {}) => {
  const { withRouter = true, withAuth = true, withQuery = true } = options;
  
  return ({ children }: { children: React.ReactNode }) => {
    let component = children;
    
    if (withQuery) {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });
      component = (
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      );
    }
    
    if (withAuth) {
      component = <AuthProvider>{component}</AuthProvider>;
    }
    
    if (withRouter) {
      component = <BrowserRouter>{component}</BrowserRouter>;
    }
    
    return <ThemeProvider>{component}</ThemeProvider>;
  };
};

export const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  return render(ui, {
    wrapper: createTestWrapper(options),
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
