
import React from 'react';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const EmployeeProtection = () => {
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
          <UserCheck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('employeeProtectionTitle')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: {formatDate('2025-03-30')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t('basicRights')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>{t('safeWorkplace')}</li>
              <li>{t('antiDiscrimination')}</li>
              <li>{t('fairWages')}</li>
              <li>{t('workingHours')}</li>
              <li>{t('vacation')}</li>
              <li>{t('wrongfulTermination')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t('dismissalProtection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground">{t('dismissalProtectionDesc')}</p>
              <div>
                <h4 className="font-semibold text-foreground">{t('dismissalReasons')}</h4>
                <ul className="list-disc pl-6 space-y-1 mt-2 text-foreground">
                  <li>{t('personalReasons')}</li>
                  <li>{t('dutyViolation')}</li>
                  <li>{t('operationalReasons')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t('workplaceSafety')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>{t('employerObligations')}</li>
              <li>{t('protectiveEquipment')}</li>
              <li>{t('safetyTraining')}</li>
              <li>{t('refuseDangerous')}</li>
              <li>{t('accidentReporting')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t('discriminationProtection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground">{t('equalTreatment')}</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground">
                <li>{t('raceEthnicity')}</li>
                <li>{t('gender')}</li>
                <li>{t('religion')}</li>
                <li>{t('disability')}</li>
                <li>{t('age')}</li>
                <li>{t('sexualOrientation')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProtection;
