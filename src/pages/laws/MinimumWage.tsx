
import React from 'react';
import { ArrowLeft, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const MinimumWage = () => {
  const { t, i18n } = useTranslation('laws');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'cs' ? 'cs-CZ' : i18n.language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-green-100">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('minimumWage')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: {formatDate('2025-05-15')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t('currentMinimumWage')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">12,41 € {t('perHour')}</div>
            <p className="text-muted-foreground">
              {t('currentWageDescription')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t('whoIsEntitled')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>{t('allEmployeesOver18')}</li>
              <li>{t('partTimeWorkers')}</li>
              <li>{t('temporaryWorkers')}</li>
              <li>{t('internsWithExceptions')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t('exceptions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>{t('minorsWithoutEducation')}</li>
              <li>{t('volunteers')}</li>
              <li>{t('mandatoryInterns')}</li>
              <li>{t('longTermUnemployed')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t('practicalInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">{t('complianceControl')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('complianceControlDescription')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">{t('reportViolations')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('reportViolationsDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinimumWage;
