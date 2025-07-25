
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import DashboardBackground from '@/components/common/DashboardBackground';
import { getLawItems } from '@/data/lawsData';
import { useTranslation } from 'react-i18next';

const LawDetail = () => {
  const { lawId } = useParams<{ lawId: string }>();
  const { t } = useTranslation('laws');
  
  console.log('LawDetail - URL param lawId:', lawId);
  
  const lawItems = getLawItems(t);
  console.log('LawDetail - Available law IDs:', lawItems.map(law => law.id));
  
  const law = lawItems.find(item => item.id === lawId);
  console.log('LawDetail - Found law:', law ? law.title : 'Not found');

  const renderLawSpecificContent = (lawId: string) => {
    switch (lawId) {
      case 'employee-protection':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('basicRights')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('safeWorkplace')}</li>
                  <li>{t('antiDiscrimination')}</li>
                  <li>{t('fairWages')}</li>
                  <li>{t('workingHours')}</li>
                  <li>{t('vacationRights')}</li>
                  <li>{t('wrongfulTermination')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('dismissalProtection')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground">{t('dismissalProtectionDesc')}</p>
                  <div>
                    <h4 className="font-semibold text-foreground">{t('dismissalReasons')}</h4>
                    <ul className="list-disc pl-6 space-y-1 mt-2 text-foreground">
                      <li>{t('personalReasons')}</li>
                      <li>{t('dutyViolation')}</li>
                      <li>{t('operationalReasons')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('workplaceSafety')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('employerObligations')}</li>
                  <li>{t('protectiveEquipment')}</li>
                  <li>{t('safetyTraining')}</li>
                  <li>{t('refuseDangerous')}</li>
                  <li>{t('accidentReporting')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('discriminationProtection')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground">{t('equalTreatment')}</p>
                  <ul className="list-disc pl-6 space-y-1 text-foreground">
                    <li>{t('raceEthnicity')}</li>
                    <li>{t('gender')}</li>
                    <li>{t('religion')}</li>
                    <li>{t('disability')}</li>
                    <li>{t('age')}</li>
                    <li>{t('sexualOrientation')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'minimum-wage':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('currentMinimumWage')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-primary mb-2">12,41 €</div>
                  <div className="text-lg text-muted-foreground">{t('perHour')}</div>
                  <p className="text-sm text-muted-foreground mt-4">{t('currentWageDescription')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('whoIsEntitled')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('allEmployeesOver18')}</li>
                  <li>{t('partTimeWorkers')}</li>
                  <li>{t('temporaryWorkers')}</li>
                  <li>{t('internsWithExceptions')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('exceptions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('minorsWithoutEducation')}</li>
                  <li>{t('volunteers')}</li>
                  <li>{t('mandatoryInterns')}</li>
                  <li>{t('longTermUnemployed')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('practicalInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{t('complianceControl')}</h4>
                    <p className="text-muted-foreground text-sm">{t('complianceControlDescription')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t('reportViolations')}</h4>
                    <p className="text-muted-foreground text-sm">{t('reportViolationsDescription')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'work-contract':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('contractRequirements')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('contractPartyIdentification')}</li>
                  <li>{t('workStartDate')}</li>
                  <li>{t('jobDescription')}</li>
                  <li>{t('salaryAndPayment')}</li>
                  <li>{t('workingTime')}</li>
                  <li>{t('vacation')}</li>
                  <li>{t('noticePeriods')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('probationPeriod')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{t('probationPeriodDescription')}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('typesOfEmployment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('fullTime')}</h4>
                    <p className="text-muted-foreground text-sm">{t('fullTimeDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('partTime')}</h4>
                    <p className="text-muted-foreground text-sm">{t('partTimeDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('minijob')}</h4>
                    <p className="text-muted-foreground text-sm">{t('minijobDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('fixedTerm')}</h4>
                    <p className="text-muted-foreground text-sm">{t('fixedTermDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'working-hours':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('workingTimeAct')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('maxDailyHours')}</h4>
                    <p className="text-muted-foreground text-sm">{t('maxDailyHoursDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('weeklyLimit')}</h4>
                    <p className="text-muted-foreground text-sm">{t('weeklyLimitDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('dailyRest')}</h4>
                    <p className="text-muted-foreground text-sm">{t('dailyRestDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('breaksAndPauses')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-card/20 rounded border border-border">
                    <span className="text-foreground">{t('work6to9Hours')}</span>
                    <span className="font-semibold text-primary">{t('break30min')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/20 rounded border border-border">
                    <span className="text-foreground">{t('workOver9Hours')}</span>
                    <span className="font-semibold text-primary">{t('break45min')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('nightWork')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('nightTime')}</li>
                  <li>{t('nightShift')}</li>
                  <li>{t('nightWorkLimit')}</li>
                  <li>{t('healthExams')}</li>
                  <li>{t('dayWorkTransfer')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'minimum-holidays':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('federalHolidayLaw')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{t('basicInfoDesc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('holidayEntitlementOverview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-foreground">{t('workingDaysPerWeek')}</th>
                        <th className="text-left p-3 text-foreground">{t('legalMinimumEntitlement')}</th>
                        <th className="text-left p-3 text-foreground">{t('commonCollectiveAgreement')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-3 text-foreground">6 {t('workingDaysPerWeek')}</td>
                        <td className="p-3 text-foreground">24 dní</td>
                        <td className="p-3 text-foreground">30 dní</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-foreground">5 {t('workingDaysPerWeek')}</td>
                        <td className="p-3 text-foreground">20 dní</td>
                        <td className="p-3 text-foreground">25-30 dní</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('keyHolidayRules')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{t('takingHolidays')}</h4>
                    <p className="text-muted-foreground text-sm">{t('takingHolidaysRules')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t('carryingOverHolidays')}</h4>
                    <p className="text-muted-foreground text-sm">{t('carryOverDesc')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t('sicknessDuringHolidays')}</h4>
                    <p className="text-muted-foreground text-sm">{t('sicknessDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'tax-return':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('whoMustFile')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('selfEmployed')}</li>
                  <li>{t('sideIncome')}</li>
                  <li>{t('marriedTaxClass')}</li>
                  <li>{t('multipleEmployers')}</li>
                  <li>{t('unemploymentBenefits')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('filingDeadlines')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('standardDeadline')}</h4>
                    <p className="text-muted-foreground text-sm">{t('standardDeadlineDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('withTaxAdvisor')}</h4>
                    <p className="text-muted-foreground text-sm">{t('withTaxAdvisorDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('deductibleItems')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
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
        );

      case 'health-insurance-system':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('basicInformation')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{t('basicInfoDesc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('typesOfInsurance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('publicInsurance')}</h4>
                    <p className="text-muted-foreground text-sm">{t('publicInsuranceDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('privateInsurance')}</h4>
                    <p className="text-muted-foreground text-sm">{t('privateInsuranceDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('whatIsCovered')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('medicalTreatment')}</li>
                  <li>{t('specialistCare')}</li>
                  <li>{t('hospitalTreatment')}</li>
                  <li>{t('prescriptionMedicine')}</li>
                  <li>{t('preventiveCare')}</li>
                  <li>{t('dentalBasic')}</li>
                  <li>{t('rehabilitation')}</li>
                  <li>{t('pregnancyCare')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'legal-aid':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('freeLegalAid')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{t('freeLegalAidDesc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('whereToGetHelp')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{t('legalAidOffices')}</h4>
                    <p className="text-muted-foreground text-sm">{t('legalAidOfficesDesc')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t('tradeUnions')}</h4>
                    <p className="text-muted-foreground text-sm">{t('tradeUnionsDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('legalAidCertificate')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-foreground">{t('legalAidCertificateDesc')}</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>{t('eligibilityIncome')}</li>
                    <li>{t('applicationProcess')}</li>
                    <li>{t('coveredCosts')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'pension-insurance':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('germanPensionSystem')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{t('systemDescription')}</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('statePension')}</h4>
                    <p className="text-muted-foreground text-sm">{t('statePensionDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('employeePension')}</h4>
                    <p className="text-muted-foreground text-sm">{t('employeePensionDesc')}</p>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('privateSavings')}</h4>
                    <p className="text-muted-foreground text-sm">{t('privateSavingsDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('pensionConditions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{t('basicOldAgePension')}</h4>
                    <p className="text-muted-foreground text-sm">{t('basicPensionDesc')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t('earlyPension')}</h4>
                    <p className="text-muted-foreground text-sm">{t('earlyPensionDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('retirementAge')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3">{t('retirementAgeDesc')}</p>
                <ul className="list-disc pl-6 space-y-1 text-foreground">
                  <li>{t('ageBefore1947')}</li>
                  <li>{t('ageBetween1947And1963')}</li>
                  <li>{t('ageAfter1964')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'child-benefits':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Kindergeld</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-primary mb-2">250 €</div>
                  <div className="text-lg text-muted-foreground">{t('kindergeldDesc')}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('ageLimits')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('upTo18')}</li>
                  <li>{t('upTo25')}</li>
                  <li>{t('disabled')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('eligibility')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>{t('permanentResidence')}</li>
                  <li>{t('sameHousehold')}</li>
                  <li>{t('childUnprovided')}</li>
                  <li>{t('ageConditions')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('kinderzuschlag')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 mb-4">
                  <div className="text-2xl font-bold text-primary">{t('upTo250')}</div>
                  <div className="text-sm text-muted-foreground">{t('lowIncomeDesc')}</div>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>{t('minimumIncome')}</li>
                  <li>{t('incomeNotSufficient')}</li>
                  <li>{t('noAlg2Needed')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'parental-allowance':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('whatIsElterngeld')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{t('elterngeldDescription')}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('amountOfBenefit')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{t('amountDescription')}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card/20 rounded-lg border border-border text-center">
                    <div className="text-lg font-semibold text-primary">{t('minimumAmount')}</div>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border text-center">
                    <div className="text-lg font-semibold text-primary">{t('maximumAmount')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('typesOfBenefits')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('basicBenefit')}</h4>
                    <p className="text-muted-foreground text-sm mb-2">{t('basicBenefitDesc')}</p>
                    <span className="text-primary font-medium">{t('basicBenefitAmount')}</span>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('extendedBenefit')}</h4>
                    <p className="text-muted-foreground text-sm mb-2">{t('extendedBenefitDesc')}</p>
                    <span className="text-primary font-medium">{t('extendedBenefitAmount')}</span>
                  </div>
                  <div className="p-4 bg-card/20 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{t('partnershipBonusTitle')}</h4>
                    <p className="text-muted-foreground text-sm">{t('partnershipBonusDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('howToApplyElterngeld')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{t('applicationProcess')}</p>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{t('requiredDocumentsTitle')}</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>{t('applicationFormFilled')}</li>
                    <li>{t('childBirthCertificate')}</li>
                    <li>{t('incomeConfirmation')}</li>
                    <li>{t('workInterruptionConfirmation')}</li>
                    <li>{t('parentsIdProof')}</li>
                    <li>{t('healthInsuranceConfirmation')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'tax-classes':
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('taxClassesOverview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{t('howToChoose')}</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="grid gap-6">
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('overview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{law?.description}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/10 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('resources')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="bg-card/10 border-border">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('officialDocument')}
                  </Button>
                  <Button variant="outline" className="bg-card/10 border-border">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('additionalInfo')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };
  if (!law) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <DashboardBackground variant="laws">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {t('lawNotFound')}
              </h1>
              <Link to="/laws" className="text-primary hover:underline">
                {t('backToLaws')}
              </Link>
            </div>
          </div>
        </DashboardBackground>
      </Layout>
    );
  }

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <DashboardBackground variant="laws">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Navigation */}
            <Link 
              to="/laws" 
              className="inline-flex items-center mb-6 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToLaws')}
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-card/20 border border-border">
                  <div className={`h-6 w-6 ${law.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {law.title}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    {law.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-card/10">
                      <Tag className="h-3 w-3 mr-1" />
                      {t(law.category)}
                    </Badge>
                    <Badge variant="outline" className="bg-card/10">
                      <Clock className="h-3 w-3 mr-1" />
                      {t('updated')}: {law.updated}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6 border-border" />

            {/* Main Content */}
            {renderLawSpecificContent(law.id)}
          </motion.div>
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default LawDetail;
