import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, FileText, Calendar, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from '@/hooks/useLanguage';

const MinimumHolidays = () => {
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

        <h1 className="text-3xl font-bold">{t('laws.minimumHolidaysTitle')}</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Zákon</p>
                <p className="font-medium">{t('laws.federalHolidayLaw')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('laws.updated')}</p>
                <p className="font-medium">{formatDate('2025-05-12')}</p>
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
            <h2 className="text-2xl font-semibold">{t('laws.basicInformation')}</h2>
            <p>
              {t('laws.basicInfoDesc')}
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('laws.holidayEntitlementOverview')}</h2>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('laws.workingDaysPerWeek')}</TableHead>
                  <TableHead>{t('laws.legalMinimumEntitlement')}</TableHead>
                  <TableHead>{t('laws.commonCollectiveAgreement')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>5 dní</TableCell>
                  <TableCell>20 dní</TableCell>
                  <TableCell>25-30 dní</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4 dny</TableCell>
                  <TableCell>16 dní</TableCell>
                  <TableCell>20-24 dní</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3 dny</TableCell>
                  <TableCell>12 dní</TableCell>
                  <TableCell>15-18 dní</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6 dní</TableCell>
                  <TableCell>24 dní</TableCell>
                  <TableCell>30-36 dní</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">{t('laws.specialCases')}</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('laws.disabledPersons')}</li>
                <li>{t('laws.youngEmployees')}</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('laws.keyHolidayRules')}</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">{t('laws.takingHolidays')}</h3>
                <p>{t('laws.takingHolidaysRules')}</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">{t('laws.carryingOverHolidays')}</h3>
                <p>
                  {t('laws.carryOverDesc')}
                </p>
                <p className="mt-2">
                  <strong>Důležité:</strong> {t('laws.carryOverImportant')}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">{t('laws.sicknessDuringHolidays')}</h3>
                <p>
                  {t('laws.sicknessDesc')}
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">{t('laws.financialCompensation')}</h3>
                <p>
                  {t('laws.compensationDesc')}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('laws.proportionalEntitlement')}</h2>
            
            <div className="space-y-2">
              <p>
                {t('laws.proportionalDesc')}
              </p>
              
              <div className="bg-muted p-4 rounded-md mt-2">
                <p className="font-medium mb-2">{t('laws.proportionalCalculation')}</p>
                <p>
                  <strong>{t('laws.calculationFormula')}</strong>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('laws.calculationExample')}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-muted p-4 rounded-md mt-6">
            <h2 className="text-xl font-semibold mb-2">{t('laws.legalPositionAndEnforcement')}</h2>
            <div className="space-y-2">
              <p>
                {t('laws.legalRightsDesc')}
              </p>
              <p className="mt-2">
                <strong>Důležité:</strong> {t('laws.statuteOfLimitations')}
              </p>
            </div>
          </section>

          <section className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-6">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{t('laws.downloadHolidayRights')}</span>
            </div>
            <Button variant="outline" size="sm">
              {t('laws.download')}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MinimumHolidays;
