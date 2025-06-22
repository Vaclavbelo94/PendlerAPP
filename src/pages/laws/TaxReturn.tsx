
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const TaxReturn = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/laws" className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-yellow-100">
          <FileText className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('taxReturnTitle')}</h1>
          <Badge variant="outline" className="mt-2">
            {t('updated')}: 10. dubna 2025
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('whoMustFile')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('selfEmployed')}</li>
              <li>{t('sideIncome')}</li>
              <li>{t('marriedTaxClass')}</li>
              <li>{t('multipleEmployers')}</li>
              <li>{t('unemploymentBenefits')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('filingDeadlines')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{t('standardDeadline')}</h4>
                <p className="text-sm text-muted-foreground">{t('standardDeadlineDesc')}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('withTaxAdvisor')}</h4>
                <p className="text-sm text-muted-foreground">{t('withTaxAdvisorDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('deductibleItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('commutingCosts')}</li>
              <li>{t('workingTools')}</li>
              <li>{t('furtherEducation')}</li>
              <li>{t('insuranceContributions')}</li>
              <li>{t('churchTax')}</li>
              <li>{t('charityDonations')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxReturn;
