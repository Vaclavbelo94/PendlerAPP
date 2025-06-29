
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { unifiedUser } = useUnifiedAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Přístup odepřen</CardTitle>
          <CardDescription>
            Nemáte dostatečná oprávnění pro přístup k této stránce.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {unifiedUser && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Aktuální informace o účtu:
              </p>
              <div className="space-y-1">
                <p className="text-sm">
                  <strong>Email:</strong> {unifiedUser.email}
                </p>
                <p className="text-sm">
                  <strong>Role:</strong> {unifiedUser.role}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {unifiedUser.status}
                </p>
              </div>
            </div>
          )}
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Pokud si myslíte, že se jedná o chybu, kontaktujte prosím podporu.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zpět
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
