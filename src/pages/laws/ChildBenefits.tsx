
import React from 'react';
import { ArrowLeft, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const ChildBenefits = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-pink-100">
          <Baby className="h-6 w-6 text-pink-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('childBenefitsTitle')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: 5. dubna 2025
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
              <div className="text-2xl font-bold text-pink-600 mb-2">{t('kindergeldAmount')}</div>
              <p className="text-muted-foreground">{t('kindergeldDesc')}</p>
              <div>
                <h4 className="font-semibold mb-2">{t('ageLimits')}</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{t('upTo18')}</li>
                  <li>{t('upTo25')}</li>
                  <li>{t('disabled')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('eligibility')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('permanentResidence')}</li>
              <li>{t('sameHousehold')}</li>
              <li>{t('childUnprovided')}</li>
              <li>{t('ageConditions')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('howToApply')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{t('whereToApply')}</h4>
                <p className="text-sm text-muted-foreground">{t('familienkasse')}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('requiredDocuments')}</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>{t('applicationForm')}</li>
                  <li>{t('birthCertificate')}</li>
                  <li>{t('idDocument')}</li>
                  <li>{t('residenceConfirmation')}</li>
                  <li>{t('studyConfirmation')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('kinderzuschlag')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-lg font-bold text-green-600">{t('upTo250')}</div>
              <p className="text-sm text-muted-foreground">{t('lowIncomeDesc')}</p>
              <div>
                <h4 className="font-semibold">{t('kinderzuschlagConditions')}</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>{t('minimumIncome')}</li>
                  <li>{t('incomeNotSufficient')}</li>
                  <li>{t('noAlg2Needed')}</li>
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
