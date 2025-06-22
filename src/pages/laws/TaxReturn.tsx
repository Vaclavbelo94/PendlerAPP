
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const TaxReturn = () => {
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
        <div className="p-3 rounded-full bg-yellow-100">
          <FileText className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('laws.taxReturnTitle')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('laws.updated')}: {formatDate('2025-04-10')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('laws.whoMustFile')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('laws.selfEmployed')}</li>
              <li>{t('laws.sideIncome')}</li>
              <li>{t('laws.marriedTaxClass')}</li>
              <li>{t('laws.multipleEmployers')}</li>
              <li>{t('laws.unemploymentBenefits')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.filingDeadlines')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{t('laws.standardDeadline')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.standardDeadlineDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('laws.withTaxAdvisor')}</h4>
                <p className="text-sm text-muted-foreground">{t('laws.withTaxAdvisorDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('laws.deductibleItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('laws.commutingCosts')}</li>
              <li>{t('laws.workingTools')}</li>
              <li>{t('laws.furtherEducation')}</li>
              <li>{t('laws.insuranceContributions')}</li>
              <li>{t('laws.churchTax')}</li>
              <li>{t('laws.charityDonations')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxReturn;
