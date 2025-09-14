
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

export const WelcomeSection = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['dashboard', 'ui']);
  const [displayName, setDisplayName] = useState<string>('');
  
  // Load user's display name from extended profile
  useEffect(() => {
    const loadDisplayName = async () => {
      if (!user?.id) return;
      
      try {
        const { data: extendedProfile } = await supabase
          .from('user_extended_profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .maybeSingle();
          
        const name = extendedProfile?.display_name || user?.email?.split('@')[0] || t('ui:user');
        setDisplayName(name);
      } catch (error) {
        console.error('Error loading display name:', error);
        setDisplayName(user?.email?.split('@')[0] || t('ui:user'));
      }
    };
    
    loadDisplayName();
  }, [user, t]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t('dashboard:welcome')}, {displayName}!
        </h2>
        <p className="text-muted-foreground mt-1">
          {t('dashboard:welcomeBack')} {t('dashboard:workAssistant')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard:newUserTips')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('dashboard:liveTraining')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard:knowledgeBase')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard:notifications')}
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link to="/faq">
                {t('dashboard:showFaqHelp')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-md mr-2">PRO</span>
              {t('dashboard:premiumBenefits')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('dashboard:advancedFeatures')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard:allLanguageExercises')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard:exportData')}
            </p>
            <Button className="mt-4 w-full" asChild>
              <Link to="/premium">
                {t('dashboard:activatePremium')}
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
