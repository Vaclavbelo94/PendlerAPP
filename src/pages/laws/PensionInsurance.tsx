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
            {t('laws.backToLawsList')}
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">{t('laws.pensionInsuranceTitle')}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {t('laws.pensionInsuranceSubtitle')}
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('laws.germanPensionSystem')}</CardTitle>
              <CardDescription>{t('laws.systemStructure')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                {t('laws.systemDescription')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">{t('laws.statePension')}</h3>
                  <p className="text-sm">{t('laws.statePensionDesc')}</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">{t('laws.employeePension')}</h3>
                  <p className="text-sm">{t('laws.employeePensionDesc')}</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md h-full">
                  <h3 className="text-lg font-semibold mb-2">{t('laws.privateSavings')}</h3>
                  <p className="text-sm">{t('laws.privateSavingsDesc')}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3">{t('laws.statutoryPensionInsurance')}</h3>
              <p className="mb-4">
                {t('laws.statutoryDescription')}
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-md mb-6">
                <p className="font-medium">{t('laws.forCommuters')}</p>
                <p>{t('laws.commuterInfo')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('laws.pensionConditions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">{t('laws.minimumInsurancePeriod')}</h3>
              <p className="mb-6">
                {t('laws.minimumPeriodDesc')}
              </p>
              
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>
                  <strong>{t('laws.basicOldAgePension')}</strong>
                  <p className="mt-1">{t('laws.basicPensionDesc')}</p>
                </li>
                <li>
                  <strong>{t('laws.earlyPension')}</strong>
                  <p className="mt-1">{t('laws.earlyPensionDesc')}</p>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">{t('laws.retirementAge')}</h3>
              <p className="mb-2">
                {t('laws.retirementAgeDesc')}
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>{t('laws.ageBefore1947')}</li>
                <li>{t('laws.ageBetween1947And1963')}</li>
                <li>{t('laws.ageAfter1964')}</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="font-medium">{t('laws.pensionCalculation')}</p>
                <p className="mb-2">{t('laws.calculationFactors')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('laws.pensionsForCommuters')}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">{t('laws.addingInsurancePeriods')}</h3>
              <p className="mb-4">
                {t('laws.addingPeriodsDesc')}
              </p>
              
              <p className="mb-6">{t('laws.addingBenefits')}</p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">{t('laws.pensionPayment')}</h3>
              <p className="mb-4">
                {t('laws.paymentConditions')}
              </p>
              <p className="mb-6">{t('laws.paymentBenefits')}</p>
              
              <div className="bg-green-50 p-4 rounded-md mb-6">
                <p className="font-medium">{t('laws.practicalSteps')}</p>
                <p className="mt-2">{t('laws.practicalStepsList')}</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">{t('laws.contactsAndInfo')}</h3>
              <p className="mb-2">{t('laws.contactsDesc')}</p>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center mt-8">
            <Link to="/laws">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('laws.backToLawsList')}
              </Button>
            </Link>
            <a href="https://www.deutsche-rentenversicherung.de" target="_blank" rel="noopener noreferrer">
              <Button>
                {t('laws.officialInfoSource')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PensionInsurance;
