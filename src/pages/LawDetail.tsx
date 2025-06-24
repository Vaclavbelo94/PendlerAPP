
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Clock, Star, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import DashboardBackground from '@/components/common/DashboardBackground';
import { getLawItems } from '@/data/lawsData';
import PremiumCheck from '@/components/premium/PremiumCheck';

const LawDetail = () => {
  const { lawId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['laws', 'common']);

  const lawItems = getLawItems(t);
  const law = lawItems.find(item => item.id === lawId);

  if (!law) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <DashboardBackground variant="laws">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-4">{t('common:notFound')}</h1>
              <Button onClick={() => navigate('/laws')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToLaws')}
              </Button>
            </div>
          </div>
        </DashboardBackground>
      </Layout>
    );
  }

  const renderLawContent = () => {
    switch (law.id) {
      case 'minimum-wage':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-400">{t('currentMinimumWage')}</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">12,41 €</div>
              <div className="text-white/80">{t('perHour')}</div>
              <p className="text-white/70 mt-3">{t('currentWageDescription')}</p>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('whoIsEntitled')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('allEmployeesOver18')}</li>
                  <li>• {t('partTimeWorkers')}</li>
                  <li>• {t('temporaryWorkers')}</li>
                  <li>• {t('internsWithExceptions')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('exceptions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('minorsWithoutEducation')}</li>
                  <li>• {t('volunteers')}</li>
                  <li>• {t('mandatoryInterns')}</li>
                  <li>• {t('longTermUnemployed')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('practicalInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">{t('complianceControl')}</h4>
                    <p className="text-white/80">{t('complianceControlDescription')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">{t('reportViolations')}</h4>
                    <p className="text-white/80">{t('reportViolationsDescription')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'work-contract':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('contractRequirements')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{t('contractMustInclude')}</p>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('employerEmployee')}</li>
                  <li>• {t('workStartDate')}</li>
                  <li>• {t('jobDescription')}</li>
                  <li>• {t('salary')}</li>
                  <li>• {t('workingTime')}</li>
                  <li>• {t('vacationEntitlement')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('typesOfEmployment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('fullTimeContract')}</li>
                  <li>• {t('partTimeContract')}</li>
                  <li>• {t('fixedTermContract')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'working-hours':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('workingHours')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{t('maxDailyHours')}</h4>
                    <p className="text-white/80">{t('maxDailyHoursDesc')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{t('weeklyLimit')}</h4>
                    <p className="text-white/80">{t('weeklyLimitDesc')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{t('dailyRest')}</h4>
                    <p className="text-white/80">{t('dailyRestDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('breaksAndPauses')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('work6to9Hours')}</li>
                  <li>• {t('workOver9Hours')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'minimum-holidays':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('minimumHolidays')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{t('legalMinimumDays')}</h4>
                    <p className="text-white/80">{t('legalMinimumDesc')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{t('carryOverRules')}</h4>
                    <p className="text-white/80">{t('carryOverDesc')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{t('sicknessDuringVacation')}</h4>
                    <p className="text-white/80">{t('sicknessDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'employee-protection':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('basicRights')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('safeWorkplace')}</li>
                  <li>• {t('antiDiscrimination')}</li>
                  <li>• {t('fairWages')}</li>
                  <li>• {t('vacation')}</li>
                  <li>• {t('wrongfulTermination')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('dismissalProtection')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{t('dismissalProtectionDesc')}</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'tax-return':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('whoMustFile')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('selfEmployed')}</li>
                  <li>• {t('sideIncome')}</li>
                  <li>• {t('marriedTaxClass')}</li>
                  <li>• {t('multipleEmployers')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('filingDeadlines')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('standardDeadline')}</li>
                  <li>• {t('withTaxAdvisor')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'tax-classes':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('taxClassesOverview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="font-semibold text-white">{t('taxClass1')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="font-semibold text-white">{t('taxClass2')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="font-semibold text-white">{t('taxClass3')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="font-semibold text-white">{t('taxClass4')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="font-semibold text-white">{t('taxClass5')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="font-semibold text-white">{t('taxClass6')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'pension-insurance':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('pensionSystemOverview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{t('threePillars')}</p>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('statutoryPension')}</li>
                  <li>• {t('employerPension')}</li>
                  <li>• {t('privatePension')}</li>
                </ul>
                <div className="mt-6 space-y-2">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('minimumPeriod')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('retirementAge')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'child-benefits':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-pink-400">Kindergeld 2024</h3>
              <div className="text-2xl font-bold text-pink-400 mb-2">{t('kindergeldAmount')}</div>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('kindergeldConditions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>• {t('residenceInGermany')}</li>
                  <li>• {t('childInHousehold')}</li>
                  <li>• {t('ageLimit18')}</li>
                  <li>• {t('ageLimit25')}</li>
                </ul>
                <div className="mt-4 bg-white/5 rounded-lg p-4">
                  <p className="text-white/80">{t('applicationProcess')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'parental-allowance':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Elterngeld</h3>
              <div className="text-lg font-bold text-blue-400 mb-2">{t('elterngeldAmount')}</div>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Druhy Elterngeld</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('elterngeldPeriod')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('elterngeldPlus')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('partnershipBonus')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80 font-semibold">{t('applicationDeadline')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'health-insurance':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('insuranceTypes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{t('publicInsurance')}</h4>
                    <p className="text-white/80">Povinné pro zaměstnance s příjmem do 69 300 € ročně</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{t('privateInsurance')}</h4>
                    <p className="text-white/80">Pro vysokopříjmové, úředníky a živnostníky</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Příspěvky</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('contributionRate')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('additionalContribution')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Pokrytí</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{t('coverage')}</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'legal-aid':
        return (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('freeLegalAid')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('legalAidCenters')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('tradeUnionHelp')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('legalInsurance')}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/80">{t('legalAidCertificate')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center text-white/60 py-8">
            <p>Detailní obsah pro tento zákon bude brzy doplněn.</p>
          </div>
        );
    }
  };

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <PremiumCheck featureKey="laws">
        <DashboardBackground variant="laws">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <Button
                onClick={() => navigate('/laws')}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToLaws')}
              </Button>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    {law.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {t(law.category)}
                    </Badge>
                    <div className="flex items-center gap-1 text-white/80">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{t('updated')}: {law.updated}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/80">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">5/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">{t('importantNotice')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-6">
                    {t('orientationGuide')}
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">{t('overview')}</h3>
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="pt-6">
                      <p className="text-white/90 leading-relaxed">
                        {law.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {renderLawContent()}

                <div className="pt-6 border-t border-white/20">
                  <div className="flex gap-4">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('officialSource')}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </Layout>
  );
};

export default LawDetail;
