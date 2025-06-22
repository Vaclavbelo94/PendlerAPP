import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, FileText, Calendar, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/hooks/useLanguage';

const ParentalAllowance = () => {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'cs' ? 'cs-CZ' : language === 'pl' ? 'pl-PL' : 'de-DE';
    return date.toLocaleDateString(locale);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/laws" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{t('laws.backToLaws')}</span>
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold">{t('laws.parentalAllowanceTitle')}</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Zákon</p>
                <p className="font-medium">Bundeselterngeld- und Elternzeitgesetz (BEEG)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('laws.updated')}</p>
                <p className="font-medium">{formatDate('2025-05-15')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('laws.importantNotice')}</AlertTitle>
          <AlertDescription>
            {t('laws.orientationGuide')}
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">{t('laws.whatIsElterngeld')}</h2>
            <p>
              {t('laws.elterngeldDescription')}
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('laws.basicFacts')}</h2>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">{t('laws.amountOfBenefit')}</h3>
              <p>{t('laws.amountDescription')}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{t('laws.withIncome')}</li>
                <li>{t('laws.minimumAmount')}</li>
                <li>{t('laws.maximumAmount')}</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">{t('laws.paymentPeriod')}</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('laws.basicElterngeld')}</li>
                <li>{t('laws.elterngeldPlus')}</li>
                <li>{t('laws.partnershipBonus')}</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">{t('laws.whoIsEntitledParental')}</h3>
              <p>{t('laws.entitlementConditions')}</p>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('laws.typesOfBenefits')}</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">{t('laws.basicBenefit')}</h3>
                <p>
                  {t('laws.basicBenefitDesc')}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Euro className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{t('laws.basicBenefitAmount')}</span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">{t('laws.extendedBenefit')}</h3>
                <p>
                  {t('laws.extendedBenefitDesc')}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Euro className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{t('laws.extendedBenefitAmount')}</span>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">{t('laws.partnershipBonusTitle')}</h3>
                <p>
                  {t('laws.partnershipBonusDesc')}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('laws.howToApplyElterngeld')}</h2>
            
            <div className="space-y-3">
              <p>{t('laws.applicationProcess')}</p>

              <h3 className="text-lg font-medium mt-4">{t('laws.requiredDocumentsTitle')}</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('laws.applicationFormFilled')}</li>
                <li>{t('laws.childBirthCertificate')}</li>
                <li>{t('laws.incomeConfirmation')}</li>
                <li>{t('laws.workInterruptionConfirmation')}</li>
                <li>{t('laws.parentsIdProof')}</li>
                <li>{t('laws.healthInsuranceConfirmation')}</li>
              </ul>
            </div>
          </section>

          <section className="bg-muted p-4 rounded-md mt-6">
            <h2 className="text-xl font-semibold mb-2">{t('laws.usefulLinks')}</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <a 
                  href="https://familienportal.de/familienportal/familienleistungen/elterngeld" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {t('laws.officialFamilyPortal')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <a 
                  href="https://www.elterngeld-digital.de/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {t('laws.digitalElterngeldApplication')}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ParentalAllowance;
