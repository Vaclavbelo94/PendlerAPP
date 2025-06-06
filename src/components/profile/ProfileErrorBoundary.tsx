
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ProfileErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ProfileErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ProfileErrorBoundary extends React.Component<ProfileErrorBoundaryProps, ProfileErrorBoundaryState> {
  constructor(props: ProfileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ProfileErrorBoundaryState {
    console.error('ProfileErrorBoundary: Error caught', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ProfileErrorBoundary: Component error details', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    console.log('ProfileErrorBoundary: Retrying...');
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Chyba v nastavení profilu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Došlo k chybě při načítání nastavení profilu. Zkuste to prosím znovu.
            </p>
            {this.state.error && (
              <details className="text-xs text-muted-foreground">
                <summary>Detaily chyby</summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <Button onClick={this.handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Zkusit znovu
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ProfileErrorBoundary;
