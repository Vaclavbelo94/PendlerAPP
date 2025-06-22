
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from '@/hooks/useLanguage';

const PensionInsurance = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4">
          <Link to="/laws" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t('backToLawsList')}
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">{t('pensionInsuranceTitle')}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {t('pensionInsuranceSubtitle')}
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('germanPensionSystem')}</CardTitle>
              <CardDescription>{t('systemStructure')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                {t('systemDescription')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">{t('statePension')}</h3>
                  <p className="text-sm">{t('statePensionDesc')}</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">{t('employeePension')}</h3>
                  <p className="text-sm">{t('employeePensionDesc')}</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">{t('privateSavings')}</h3>
                  <p className="text-sm">{t('privateSavingsDesc')}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3">{t('statutoryPensionInsurance')}</h3>
              <p className="mb-4">
                {t('statutoryDescription')}
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-md mb-6">
                <p className="font-medium">{t('forCommuters')}</p>
                <p>{t('commuterInfo')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('pensionConditions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">{t('minimumInsurancePeriod')}</h3>
              <p className="mb-6">
                {t('minimumPeriodDesc')}
              </p>
              
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>
                  <strong>{t('basicOldAgePension')}</strong>
                  <p className="mt-1">{t('basicPensionDesc')}</p>
                </li>
                <li>
                  <strong>{t('earlyPension')}</strong>
                  <p className="mt-1">{t('earlyPensionDesc')}</p>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">{t('retirementAge')}</h3>
              <p className="mb-2">
                {t('retirementAgeDesc')}
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>{t('ageBefore1947')}</li>
                <li>{t('ageBetween1947And1963')}</li>
                <li>{t('ageAfter1964')}</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="font-medium">{t('pensionCalculation')}</p>
                <p className="mb-2">{t('calculationFactors')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('pensionsForCommuters')}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">{t('addingInsurancePeriods')}</h3>
              <p className="mb-4">
                {t('addingPeriodsDesc')}
              </p>
              
              <p className="mb-6">{t('addingBenefits')}</p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">{t('pensionPayment')}</h3>
              <p className="mb-4">
                {t('paymentConditions')}
              </p>
              <p className="mb-6">{t('paymentBenefits')}</p>
              
              <div className="bg-green-50 p-4 rounded-md mb-6">
                <p className="font-medium">{t('practicalSteps')}</p>
                <p className="mt-2">{t('practicalStepsList')}</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">{t('contactsAndInfo')}</h3>
              <p className="mb-2">{t('contactsDesc')}</p>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center mt-8">
            <Link to="/laws">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('backToLawsList')}
              </Button>
            </Link>
            <a href="https://www.deutsche-rentenversicherung.de" target="_blank" rel="noopener noreferrer">
              <Button>
                {t('officialInfoSource')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PensionInsurance;
