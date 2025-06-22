
import React from 'react';
import { ArrowLeft, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const MinimumWage = () => {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'cs' ? 'cs-CZ' : language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('laws.backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-green-100">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('laws.minimumWage')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('laws.updated')}: {formatDate('2025-05-15')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('laws.currentMinimumWage')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">12,41 € {t('laws.perHour')}</div>
            <p className="text-muted-foreground">
              {t('laws.currentWageDescription')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.whoIsEntitled')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('laws.allEmployeesOver18')}</li>
              <li>{t('laws.partTimeWorkers')}</li>
              <li>{t('laws.temporaryWorkers')}</li>
              <li>{t('laws.internsWithExceptions')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.exceptions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('laws.minorsWithoutEducation')}</li>
              <li>{t('laws.volunteers')}</li>
              <li>{t('laws.mandatoryInterns')}</li>
              <li>{t('laws.longTermUnemployed')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.practicalInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t('laws.complianceControl')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('laws.complianceControlDescription')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('laws.reportViolations')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('laws.reportViolationsDescription')}
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
