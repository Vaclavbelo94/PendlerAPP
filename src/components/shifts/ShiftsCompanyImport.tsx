import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Building2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import AnnualPlanImport from '@/components/admin/dhl/AnnualPlanImport';

interface ShiftsCompanyImportProps {
  onImportComplete?: () => void;
}

const ShiftsCompanyImport: React.FC<ShiftsCompanyImportProps> = ({ 
  onImportComplete 
}) => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  const { userAssignment, isLoading } = useDHLData(user?.id || null);
  
  const isDHLUser = user ? isDHLEmployee(user) : false;
  const hasDHLAssignment = isDHLUser && !!userAssignment;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">{t('loadingAuth')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // DHL Import Section
  if (isDHLUser && hasDHLAssignment) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              DHL {t('dataImport')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnnualPlanImport 
              onImportComplete={onImportComplete || (() => {})} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('import.mobileInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>{t('import.dhlShiftNote', 'DHL Wechselschicht 6h standard')}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {t('import.mobileDescription')}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Future company imports (Adecco, Randstad)
  if (user?.email?.includes('adecco')) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Adecco {t('dataImport')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Připravujeme
              </h3>
              <p className="text-muted-foreground">
                Import dat z Adecco systému bude brzy k dispozici.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.email?.includes('randstad')) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Randstad {t('dataImport')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Připravujeme
              </h3>
              <p className="text-muted-foreground">
                Import dat z Randstad systému bude brzy k dispozici.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No company association
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-muted-foreground" />
            {t('dataImport')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Žádné firemní pozadí
            </h3>
            <p className="text-muted-foreground mb-4">
              Pro import dat z firemního systému potřebujete být přiřazeni k jedné z podporovaných společností.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <h4 className="font-medium text-center">DHL</h4>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Automatický import rozvrhů
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <h4 className="font-medium text-center">Adecco</h4>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Připravuje se
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <h4 className="font-medium text-center">Randstad</h4>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Připravuje se
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftsCompanyImport;