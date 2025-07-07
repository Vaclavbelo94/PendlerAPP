
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
        {t('laws.backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-blue-100">
          <UserCheck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('laws.employeeProtectionTitle')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('laws.updated')}: {formatDate('2025-03-30')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('laws.basicRights')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('laws.safeWorkplace')}</li>
              <li>{t('laws.antiDiscrimination')}</li>
              <li>{t('laws.fairWages')}</li>
              <li>{t('laws.workingHours')}</li>
              <li>{t('laws.vacation')}</li>
              <li>{t('laws.wrongfulTermination')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.dismissalProtection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{t('laws.dismissalProtectionDesc')}</p>
              <div>
                <h4 className="font-semibold">{t('laws.dismissalReasons')}</h4>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>{t('laws.personalReasons')}</li>
                  <li>{t('laws.dutyViolation')}</li>
                  <li>{t('laws.operationalReasons')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.workplaceSafety')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('laws.employerObligations')}</li>
              <li>{t('laws.protectiveEquipment')}</li>
              <li>{t('laws.safetyTraining')}</li>
              <li>{t('laws.refuseDangerous')}</li>
              <li>{t('laws.accidentReporting')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.discriminationProtection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{t('laws.equalTreatment')}</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>{t('laws.raceEthnicity')}</li>
                <li>{t('laws.gender')}</li>
                <li>{t('laws.religion')}</li>
                <li>{t('laws.disability')}</li>
                <li>{t('laws.age')}</li>
                <li>{t('laws.sexualOrientation')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProtection;
