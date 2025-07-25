
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
    // For employee-protection, show the specific content from EmployeeProtection component
    if (lawId === 'employee-protection') {
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
    }

    // For minimum-wage
    if (lawId === 'minimum-wage') {
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
        </div>
      );
    }

    // Default content for other laws
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
