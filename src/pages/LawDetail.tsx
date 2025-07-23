
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
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('laws');
  
  const lawItems = getLawItems(t);
  const law = lawItems.find(item => item.id === id);
  
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
            <div className="grid gap-6">
              {/* Overview Card */}
              <Card className="bg-card/10 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {t('overview')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {law.description}
                  </p>
                </CardContent>
              </Card>

              {/* Key Points Card */}
              <Card className="bg-card/10 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {t('keyPoints')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-foreground">{t('keyPoint1')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-foreground">{t('keyPoint2')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-foreground">{t('keyPoint3')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Requirements Card */}
              <Card className="bg-card/10 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {t('legalRequirements')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-card/20 rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('requirement1')}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t('requirementDesc1')}
                      </p>
                    </div>
                    <div className="p-4 bg-card/20 rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('requirement2')}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t('requirementDesc2')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card className="bg-card/10 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {t('resources')}
                  </CardTitle>
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
          </motion.div>
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default LawDetail;
