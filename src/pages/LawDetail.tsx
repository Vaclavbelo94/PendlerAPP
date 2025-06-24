
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
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">{t('importantNotice')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-6">
                    {t('orientationGuide')}
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{t('overview')}</h3>
                      <p className="text-white/90 leading-relaxed">
                        {law.description}
                      </p>
                    </div>

                    {/* Law-specific content based on ID */}
                    {law.id === 'minimum-wage' && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">{t('currentMinimumWage')}</h3>
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-400">12,41 €</div>
                            <div className="text-sm text-white/80">{t('perHour')}</div>
                            <p className="text-sm text-white/70 mt-2">
                              {t('currentWageDescription')}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">{t('whoIsEntitled')}</h3>
                          <ul className="space-y-2 text-white/90">
                            <li>• {t('allEmployeesOver18')}</li>
                            <li>• {t('partTimeWorkers')}</li>
                            <li>• {t('temporaryWorkers')}</li>
                            <li>• {t('internsWithExceptions')}</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {law.id === 'tax-classes' && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">{t('taxClassesOverview')}</h3>
                          <div className="grid gap-3">
                            <div className="bg-white/5 rounded-lg p-4">
                              <div className="font-semibold">Steuerklasse I</div>
                              <div className="text-sm text-white/80">Svobodní, rozvedení, ovdovělí</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                              <div className="font-semibold">Steuerklasse II</div>
                              <div className="text-sm text-white/80">Samoživitelé s dětmi</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                              <div className="font-semibold">Steuerklasse III/V</div>
                              <div className="text-sm text-white/80">Manželé s různými příjmy</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-white/20">
                      <div className="flex gap-4">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t('officialSource')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </Layout>
  );
};

export default LawDetail;
