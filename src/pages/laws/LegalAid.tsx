import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

const LegalAid = () => {
  const { t, i18n } = useTranslation('laws');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'cs' ? 'cs-CZ' : i18n.language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  // Use translations from the translation files

  

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/laws" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('laws.backToLaws')}
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-indigo-100">
          <Scale className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('legalAid')}</h1>
          <p className="text-muted-foreground">{t('legalAidDescription')}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              {t('freeLegalAid')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t('legalAidSituationsDesc')}</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>{t('workDisputes')}</li>
              <li>{t('housingProblems')}</li>
              <li>{t('workplaceDiscrimination')}</li>
              <li>{t('unpaidWages')}</li>
              <li>{t('socialBenefits')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('whereToGetHelp')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {t('unions')}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('unionsDesc')}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>DGB Rechtsschutz: 030 24060-0</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {t('migrantCenters')}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('migrantCentersDesc')}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>info@migrationsberatung.de</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {t('availableInCities')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {t('courtHelp')}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('courtHelpDesc')}
                </p>
                <Badge variant="secondary">
                  {t('incomeDependent')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-8">
          <Link to="/laws">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('backToLaws')}
            </Button>
          </Link>
          <Badge variant="outline">
            {t('updated')}: {formatDate('2025-01-01')}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default LegalAid;
