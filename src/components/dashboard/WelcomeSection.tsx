
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

export const WelcomeSection = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const username = user?.email?.split('@')[0] || t('user');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('welcomeUser').replace('{username}', username)}</h2>
        <p className="text-muted-foreground mt-1">
          {t('welcomeDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('newUserTips')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('liveTraining')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('knowledgeBase')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('notifications')}
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link to="/faq">
                {t('showFaqHelp')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-md mr-2">PRO</span>
              {t('premiumBenefits')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('advancedFeatures')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('allLanguageExercises')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('exportData')}
            </p>
            <Button className="mt-4 w-full" asChild>
              <Link to="/premium">
                {t('activatePremium')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeSection;
