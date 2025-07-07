
import React from 'react';
import { ArrowLeft, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const ChildBenefits = () => {
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
        <div className="p-3 rounded-full bg-pink-100">
          <Baby className="h-6 w-6 text-pink-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('laws.childBenefitsTitle')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('laws.updated')}: {formatDate('2025-04-05')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kindergeld 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold text-pink-600 mb-2">{t('laws.kindergeldAmount')}</div>
              <p className="text-muted-foreground">{t('laws.kindergeldDesc')}</p>
              <div>
                <h4 className="font-semibold mb-2">{t('laws.ageLimits')}</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('laws.upTo18')}</li>
                  <li>{t('laws.upTo25')}</li>
                  <li>{t('laws.disabled')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.eligibility')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('laws.permanentResidence')}</li>
              <li>{t('laws.sameHousehold')}</li>
              <li>{t('laws.childUnprovided')}</li>
              <li>{t('laws.ageConditions')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.howToApply')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{t('laws.whereToApply')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.familienkasse')}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('laws.requiredDocuments')}</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>{t('laws.applicationForm')}</li>
                  <li>{t('laws.birthCertificate')}</li>
                  <li>{t('laws.idDocument')}</li>
                  <li>{t('laws.residenceConfirmation')}</li>
                  <li>{t('laws.studyConfirmation')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.kinderzuschlag')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-lg font-bold text-green-600">{t('laws.upTo250')}</div>
              <p className="text-sm text-muted-foreground">{t('laws.lowIncomeDesc')}</p>
              <div>
                <h4 className="font-semibold">{t('laws.kinderzuschlagConditions')}</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>{t('laws.minimumIncome')}</li>
                  <li>{t('laws.incomeNotSufficient')}</li>
                  <li>{t('laws.noAlg2Needed')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChildBenefits;
