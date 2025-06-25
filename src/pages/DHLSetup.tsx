
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import DHLSetupForm from '@/components/dhl/DHLSetupForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Building2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const DHLSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { userAssignment, isLoading: dhlLoading, refetch } = useDHLData(user?.id);
  const [setupCompleted, setSetupCompleted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (userAssignment && userAssignment.is_active) {
      setSetupCompleted(true);
    }
  }, [userAssignment]);

  const handleSetupComplete = async () => {
    await refetch();
    setSetupCompleted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (authLoading || dhlLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  // Pokud už má uživatel aktivní přiřazení
  if (setupCompleted || (userAssignment && userAssignment.is_active)) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              DHL Setup dokončen!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {userAssignment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Vaše přiřazení:</span>
                </div>
                <p className="text-green-800">
                  <strong>{userAssignment.dhl_position?.name}</strong>
                  {' '}ve skupině{' '}
                  <strong>{userAssignment.dhl_work_group?.name}</strong>
                </p>
                {userAssignment.dhl_position?.hourly_rate && (
                  <p className="text-sm text-green-600 mt-1">
                    Hodinová sazba: {userAssignment.dhl_position.hourly_rate.toFixed(2)} €/hod
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2 text-muted-foreground">
              <p>✅ Automatické spravování směn aktivováno</p>
              <p>✅ DHL notifikace nastaveny</p>
              <p>✅ Přístup k pokročilým funkcím povolen</p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={handleGoToDashboard} className="flex-1">
                Přejít na Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zpět na Dashboard
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Vítejte v DHL systému</h1>
          <p className="text-muted-foreground text-lg">
            Nastavte si svůj DHL profil pro automatické spravování směn
          </p>
        </div>
      </div>

      <DHLSetupForm onSetupComplete={handleSetupComplete} />
    </div>
  );
};

export default DHLSetupPage;
