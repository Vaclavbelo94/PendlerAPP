
import React, { useState } from 'react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import UnifiedRoleIndicator from '@/components/auth/UnifiedRoleIndicator';

const AuthDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { 
    user, 
    unifiedUser, 
    isLoading, 
    isInitialized, 
    error,
    refreshUserData,
    hasRole,
    canAccess 
  } = useUnifiedAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-background/80 backdrop-blur"
        >
          <Eye className="h-4 w-4" />
          Auth Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Auth Debug Panel</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshUserData}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex gap-2">
            <Badge variant={isInitialized ? "default" : "secondary"}>
              {isInitialized ? "Initialized" : "Initializing"}
            </Badge>
            <Badge variant={isLoading ? "secondary" : "outline"}>
              {isLoading ? "Loading" : "Ready"}
            </Badge>
          </div>
          
          {error && (
            <div className="p-2 bg-destructive/10 rounded text-destructive text-xs">
              {error}
            </div>
          )}
          
          {user && (
            <div className="space-y-2">
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>ID:</strong> {user.id.slice(0, 8)}...
              </div>
            </div>
          )}
          
          {unifiedUser && (
            <div className="space-y-2">
              <UnifiedRoleIndicator role={unifiedUser.role} status={unifiedUser.status} compact />
              
              <div className="grid grid-cols-2 gap-1 text-xs">
                <Badge variant={unifiedUser.isDHLUser ? "default" : "outline"}>
                  DHL: {unifiedUser.isDHLUser ? "Yes" : "No"}
                </Badge>
                <Badge variant={unifiedUser.hasAdminAccess ? "default" : "outline"}>
                  Admin: {unifiedUser.hasAdminAccess ? "Yes" : "No"}
                </Badge>
                <Badge variant={unifiedUser.hasPremiumAccess ? "default" : "outline"}>
                  Premium: {unifiedUser.hasPremiumAccess ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="font-medium">Feature Access:</div>
                <div className="grid grid-cols-2 gap-1">
                  <Badge variant={canAccess('dhl_features') ? "default" : "outline"} className="text-xs">
                    DHL Features
                  </Badge>
                  <Badge variant={canAccess('premium_features') ? "default" : "outline"} className="text-xs">
                    Premium
                  </Badge>
                  <Badge variant={canAccess('admin_panel') ? "default" : "outline"} className="text-xs">
                    Admin Panel
                  </Badge>
                  <Badge variant={canAccess('dhl_admin') ? "default" : "outline"} className="text-xs">
                    DHL Admin
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebugPanel;
