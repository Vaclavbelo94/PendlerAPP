import React from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const WorkContract = () => {
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
        <div className="p-3 rounded-full bg-blue-100">
          <Briefcase className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('workContract')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: {formatDate('2025-03-18')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('contractRequirements')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('contractPartyIdentification')}</li>
              <li>{t('workStartDate')}</li>
              <li>{t('jobDescription')}</li>
              <li>{t('salaryAndPayment')}</li>
              <li>{t('workingTime')}</li>
              <li>{t('vacation')}</li>
              <li>{t('noticePeriods')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('probationPeriod')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {t('probationPeriodDescription')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('typesOfEmployment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t('fullTime')}:</strong> {t('fullTimeDesc')}</li>
              <li><strong>{t('partTime')}:</strong> {t('partTimeDesc')}</li>
              <li><strong>{t('minijob')}:</strong> {t('minijobDesc')}</li>
              <li><strong>{t('fixedTerm')}:</strong> {t('fixedTermDesc')}</li>
              <li><strong>{t('indefiniteTerm')}:</strong> {t('indefiniteTermDesc')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkContract;
