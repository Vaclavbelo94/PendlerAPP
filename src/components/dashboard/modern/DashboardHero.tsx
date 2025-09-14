
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Calendar, Euro, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const DashboardHero: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['dashboard']);
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
          
        const name = extendedProfile?.display_name || user?.email?.split('@')[0] || t('dashboard:user');
        setDisplayName(name);
      } catch (error) {
        console.error('Error loading display name:', error);
        setDisplayName(user?.email?.split('@')[0] || t('dashboard:user'));
      }
    };
    
    loadDisplayName();
  }, [user, t]);

  return (
    <div className="mb-8">
      {/* Welcome Header - Clean and Simple */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          {t('dashboard:welcomeBack')}, {displayName}!
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('dashboard:dashboardSubtitle')}
        </p>
      </div>
    </div>
  );
};

export default DashboardHero;
