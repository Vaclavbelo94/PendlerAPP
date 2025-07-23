
import React from 'react';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Calendar, Euro, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHero: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['dashboard']);

  const username = user?.email?.split('@')[0] || t('dashboard:user');

  return (
    <div className="mb-8">
      {/* Welcome Header - Clean and Simple */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          {t('dashboard:welcomeBack')}, {username}!
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('dashboard:dashboardSubtitle')}
        </p>
      </div>
    </div>
  );
};

export default DashboardHero;
